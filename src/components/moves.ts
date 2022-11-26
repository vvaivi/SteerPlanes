import { Aircraft, Airport, NoPlaneState, Point } from '../types'
import { normalizeHeading } from '../utils/math'
import { findLandingPoint } from './path'

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
