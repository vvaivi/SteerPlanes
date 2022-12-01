import { Aircraft } from '../types'
import { getDistance, selectNewDirection, turnPlane } from './moves'

export const findLandingPoint = (aircraft: Aircraft) => {
  //Sine rule
  const x =
    aircraft.airportPosition!.x +
    aircraft.airportLandingRadius! * Math.cos(((aircraft.airportDirection! - 180) * Math.PI) / 180) //Convert to radians
  const y =
    aircraft.airportPosition!.y +
    aircraft.airportLandingRadius! * Math.sin(((aircraft.airportDirection! - 180) * Math.PI) / 180)

  aircraft.airportLandingPosition = { x, y }
}

export const getLandingCircleRadius = (aircraft: Aircraft) => {
  //Looping around with 20 deg turns always forms a regular polygon with 18 corners of 160 deg
  //Radius of circle formed outside the polygon can be calculated with sine rule
  return aircraft.speed / 2 / Math.sin((10 * Math.PI) / 180)
}

export const getLandingCirclePoints = (aircraft: Aircraft) => {
  const x1 =
    aircraft.airportLandingPosition!.x +
    getLandingCircleRadius(aircraft) * 2 * Math.sin((aircraft.airportDirection! * Math.PI) / 180) //Convert to radians
  const y1 =
    aircraft.airportLandingPosition!.y +
    getLandingCircleRadius(aircraft) * 2 * Math.cos((aircraft.airportDirection! * Math.PI) / 180)

  const x2 =
    aircraft.airportLandingPosition!.x -
    getLandingCircleRadius(aircraft) * 2 * Math.sin((aircraft.airportDirection! * Math.PI) / 180)
  const y2 =
    aircraft.airportLandingPosition!.y -
    getLandingCircleRadius(aircraft) * 2 * Math.cos((aircraft.airportDirection! * Math.PI) / 180)

  const x3 =
    aircraft.airportLandingPosition!.x +
    getLandingCircleRadius(aircraft) * 2 * Math.sin((-aircraft.airportDirection! * Math.PI) / 180)
  const y3 =
    aircraft.airportLandingPosition!.y +
    getLandingCircleRadius(aircraft) * 2 * Math.cos((-aircraft.airportDirection! * Math.PI) / 180)

  const x4 =
    aircraft.airportLandingPosition!.x -
    getLandingCircleRadius(aircraft) * 2 * Math.sin((-aircraft.airportDirection! * Math.PI) / 180)
  const y4 =
    aircraft.airportLandingPosition!.y -
    getLandingCircleRadius(aircraft) * 2 * Math.cos((-aircraft.airportDirection! * Math.PI) / 180)

  return [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
    { x: x3, y: y3 },
    { x: x4, y: y4 },
  ]
}

export const checkCollisionPossibility = (aircraft1: Aircraft, aircraft2: Aircraft) => {
  const directionToHead1 = selectNewDirection(aircraft1)!
  const directionToHead2 = selectNewDirection(aircraft2)!

  //Possible to collide if planes are close enough each other and heading to unparallel directions
  if (
    getDistance(aircraft1.position, aircraft2.position) <=
      (aircraft1.collisionRadius + aircraft2.collisionRadius) * 1.5 &&
    Math.abs(directionToHead1 - directionToHead2) != 180 &&
    Math.abs(directionToHead1 - directionToHead2) != 0
  ) {
    turnPlane(aircraft1, aircraft2)
  }
  //If not close to collision turned normally
  else {
    turnPlane(aircraft1)
  }
}
