import { Aircraft, Airport, NoPlaneState, Point } from '../types'
import { normalizeHeading } from '../utils/math'
import { findLandingPoint, getLandingCirclePoints, getLandingCircleRadius } from './path'

export const getDirection = (pointFrom: Point, pointTo: Point) => {
  const direction = Math.atan2(pointTo.y - pointFrom.y, pointTo.x - pointFrom.x) * (180 / Math.PI) //Convert to degrees
  return normalizeHeading(direction)
}

const getDistance = (pointFrom: Point, pointTo: Point) => {
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

export const selectClosestTangentPoint = (aircraft: Aircraft) => {
  const tangentPoints = getLandingCirclePoints(aircraft)

  var distances: number[] = []

  distances.push(getDistance(tangentPoints[0], aircraft.position))
  distances.push(getDistance(tangentPoints[1], aircraft.position))

  //Coordinates of a point that is closest to airplane
  return tangentPoints[distances.indexOf(Math.min(...distances))]
}

export const selectPointToHeadTo = (aircraft: Aircraft) => {
  if (180 - Math.abs(aircraft.direction - aircraft.airportDirection!) < 90) {
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

export const turnPlane = (aircraft: Aircraft) => {
  //Adjusting direction values to aivoid multiple conditional statements
  const oldDirection = aircraft.direction - 180
  const aimDirection = selectNewDirection(aircraft)! - 180

  //Varible to determine direction of turning
  let n = 1
  if (oldDirection - aimDirection < 180) {
    n = -1
  }

  Math.abs(oldDirection - aimDirection) <= 20
    ? (aircraft.direction = aimDirection + 180)
    : // If cannot turn fully to aim, turned 20 deg towards aim
    oldDirection >= aimDirection
    ? (aircraft.direction += n * 20)
    : (aircraft.direction -= n * 20)
}
