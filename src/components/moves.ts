import { Aircraft, Airport, NoPlaneState, Point } from '../types'
import { normalizeHeading } from '../utils/math'
import { findLandingPoint, getLandingCirclePoints, getLandingCircleRadius } from './path'

export const getDirection = (pointFrom: Point, pointTo: Point) => {
  const direction = Math.atan2(pointTo.y - pointFrom.y, pointTo.x - pointFrom.x) * (180 / Math.PI) //Convert to degrees
  return normalizeHeading(direction)
}

export const getDistance = (pointFrom: Point, pointTo: Point) => {
  return Math.sqrt(Math.pow(pointTo.x - pointFrom.x, 2) + Math.pow(pointTo.y - pointFrom.y, 2))
}

export const findDestination = (gameState: NoPlaneState, aircraft: Aircraft) => {
  const destination = gameState.airports.find((airport: Airport) => airport.name === aircraft.destination)

  if (destination != undefined) {
    aircraft.airportDirection = destination.direction
    aircraft.airportPosition = destination.position
    aircraft.airportLandingRadius = destination.landingRadius
  }

  findLandingPoint(aircraft)
}

const compareTangentPoints = (point1: Point, point2: Point, aircraft: Aircraft) => {
  //If points equally far from plane, selected one closest to airport
  return getDistance(point1, aircraft.airportLandingPosition!) < getDistance(point2, aircraft.airportLandingPosition!)
    ? getDistance(point1, aircraft.position)
    : getDistance(point2, aircraft.position)
}

export const selectClosestTangentPoint = (aircraft: Aircraft) => {
  const tangentPoints = getLandingCirclePoints(aircraft)
  var distances: number[] = []

  for (const point of tangentPoints) {
    if (
      getDirection(aircraft.position, aircraft.airportLandingPosition!) !=
      getDirection(point, aircraft.airportLandingPosition!)
    ) {
      const newDistance = getDistance(point, aircraft.position)

      //Checking if same distance already saved
      const found = distances.find((element) => element === newDistance)

      found === undefined
        ? distances.push(newDistance)
        : distances.splice(
            distances.indexOf(found),
            1,
            compareTangentPoints(tangentPoints[distances.indexOf(found)], point, aircraft)
          )
    }
  }

  //Coordinates of selected point
  return tangentPoints[distances.indexOf(Math.min(...distances))]
}

export const selectPointToHeadTo = (aircraft: Aircraft) => {
  if (Math.abs(aircraft.direction - aircraft.airportDirection!) < 90) {
    return aircraft.airportLandingPosition
  }
  //If cannot go straight to airport direction, headed to tangent point
  return selectClosestTangentPoint(aircraft)
}

export const selectNewDirection = (aircraft: Aircraft) => {
  const distanceToAirport = getDistance(aircraft.position, aircraft.airportLandingPosition!)
  //When reached landing circle can be turned towards landing point
  if (distanceToAirport <= getLandingCircleRadius(aircraft) + aircraft.speed) {
    return aircraft.airportDirection
  }

  return getDirection(aircraft.position, selectPointToHeadTo(aircraft)!)
}

export const turnPlane = (aircraft: Aircraft, aircraftToGiveWayTo?: Aircraft) => {
  const oldDirection = aircraft.direction

  let aimDirection
  aircraftToGiveWayTo === undefined
    ? (aimDirection = selectNewDirection(aircraft)!)
    : //If needed to give way for other plane, turned towards where it comes from
      (aimDirection = getDirection(aircraftToGiveWayTo.position, aircraft.position))

  //Varible to determine direction of turning
  let n = 1
  if (oldDirection - aimDirection < 180) {
    n = -1
  }

  Math.abs(oldDirection - aimDirection) <= 20
    ? (aircraft.direction = aimDirection)
    : // If cannot turn fully to aim, turned 20 deg towards aim
    oldDirection >= aimDirection
    ? (aircraft.direction += n * 20)
    : (aircraft.direction -= n * 20)
}
