import { testGameState } from './test_helper'
import { findDestination } from '../components/moves'
import { getLandingCirclePoints } from '../components/path'

describe('When game data is saved', () => {
  test('Landing point can be found', async () => {
    for (const plane of testGameState.aircrafts) {
      findDestination(testGameState, plane)
    }

    for (const plane of testGameState.aircrafts) {
      expect(plane.airportLandingPosition).toBeDefined
    }

    //When direction 0
    expect(testGameState.aircrafts[0].airportLandingPosition!.x).toBe(90)
    expect(testGameState.aircrafts[0].airportLandingPosition!.y).toBe(50)

    //When direction 180
    expect(testGameState.aircrafts[6].airportLandingPosition!.x).toBe(110)
    expect(testGameState.aircrafts[6].airportLandingPosition!.y).toBe(-50)

    //When direction > 180
    expect(testGameState.aircrafts[4].airportLandingPosition!.x).toBe(100)
    expect(testGameState.aircrafts[4].airportLandingPosition!.y).toBe(-40)

    //When direction < 180
    expect(testGameState.aircrafts[5].airportLandingPosition!.x).toBe(100)
    expect(testGameState.aircrafts[5].airportLandingPosition!.y).toBe(-60)
  })

  test('Plane destination can be found', async () => {
    for (const plane of testGameState.aircrafts) {
      findDestination(testGameState, plane)
    }

    for (const plane of testGameState.aircrafts) {
      expect(plane.airportPosition).toBeDefined
      expect(plane.airportDirection).toBeDefined
    }

    expect(testGameState.aircrafts[0].airportDirection).toBe(testGameState.airports[0].direction)
    expect(testGameState.aircrafts[0].airportPosition).toBe(testGameState.airports[0].position)
  })

  test('Outer tangent points of landing cicle can be found', async () => {
    const points0 = getLandingCirclePoints(testGameState.aircrafts[0])

    expect(Math.round(points0[0].x)).toBe(90) //landing position
    expect(Math.round(points0[0].y)).toBe(50 - 14)
    expect(Math.round(points0[1].x)).toBe(90)
    expect(Math.round(points0[1].y)).toBe(50 + 14)

    const points5 = getLandingCirclePoints(testGameState.aircrafts[5])

    expect(Math.round(points5[0].x)).toBe(testGameState.aircrafts[5].airportLandingPosition!.x - 14)
    expect(Math.round(points5[0].y)).toBe(testGameState.aircrafts[5].airportLandingPosition!.y)
    expect(Math.round(points5[1].x)).toBe(testGameState.aircrafts[5].airportLandingPosition!.x + 14)
    expect(Math.round(points5[1].y)).toBe(testGameState.aircrafts[5].airportLandingPosition!.y)

    const points7 = getLandingCirclePoints(testGameState.aircrafts[7])

    expect(Math.round(points7[0].x)).toBe(testGameState.aircrafts[7].airportLandingPosition!.x + 10)
    expect(Math.round(points7[0].y)).toBe(testGameState.aircrafts[7].airportLandingPosition!.y - 10)
    expect(Math.round(points7[1].x)).toBe(testGameState.aircrafts[7].airportLandingPosition!.x + 10)
    expect(Math.round(points7[1].y)).toBe(testGameState.aircrafts[7].airportLandingPosition!.y + 10)
  })
})
