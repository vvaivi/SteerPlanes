import { Aircraft, Airport, NoPlaneState, Point } from '../types'
import { normalizeHeading } from '../utils/math'
import { findLandingPoint, getLandingCirclePoints } from './path'

const getDirection = (pointFrom: Point, pointTo: Point) => {
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
