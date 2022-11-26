import { Aircraft } from '../types'

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

const getLandingCircleRadius = (aircraft: Aircraft) => {
  //Looping around with 20 deg turns always forms a regular polygon with 18 corners of 160 deg
  //Radius of circle formed outside the polygon can be calculated with sine rule
  return aircraft.speed / 2 / Math.sin((10 * Math.PI) / 180)
}

export const getLandingCirclePoints = (aircraft: Aircraft) => {
  const x1 =
    aircraft.airportLandingPosition!.x +
    getLandingCircleRadius(aircraft) * Math.cos(((aircraft.airportDirection! - aircraft.direction) * Math.PI) / 180) //Convert to radians
  const y1 =
    aircraft.airportLandingPosition!.y +
    getLandingCircleRadius(aircraft) * Math.sin(((aircraft.airportDirection! - aircraft.direction) * Math.PI) / 180)

  const x2 =
    aircraft.airportLandingPosition!.x +
    getLandingCircleRadius(aircraft) * Math.cos(((aircraft.airportDirection! + aircraft.direction) * Math.PI) / 180) //Convert to radians
  const y2 =
    aircraft.airportLandingPosition!.y +
    getLandingCircleRadius(aircraft) * Math.sin(((aircraft.airportDirection! + aircraft.direction) * Math.PI) / 180)
  console.log(x1)
  console.log(y1)
  return [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
  ]
}
