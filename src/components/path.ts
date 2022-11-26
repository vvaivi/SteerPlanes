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
