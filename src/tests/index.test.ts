import { testGameState } from './test_helper'
import { findDestination } from '../components/moves'

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
})
