import { testGameState } from './test_helper'
import {
  findDestination,
  getDistance,
  selectClosestTangentPoint,
  selectNewDirection,
  selectPointToHeadTo,
  turnPlane,
} from '../components/moves'
import { checkCollisionPossibility, getLandingCirclePoints, getLandingCircleRadius } from '../components/path'

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

    expect(Math.round(points0[0].x)).toBe(90)
    expect(points0[0].y).toBe(50 + 2 * getLandingCircleRadius(testGameState.aircrafts[0]))
    expect(Math.round(points0[1].x)).toBe(90)
    expect(points0[1].y).toBe(50 - 2 * getLandingCircleRadius(testGameState.aircrafts[0]))

    const points5 = getLandingCirclePoints(testGameState.aircrafts[5])

    expect(points5[0].x).toBe(
      testGameState.aircrafts[5].airportLandingPosition!.x + 2 * getLandingCircleRadius(testGameState.aircrafts[5])
    )
    expect(Math.round(points5[0].y)).toBe(testGameState.aircrafts[5].airportLandingPosition!.y)
    expect(points5[1].x).toBe(
      testGameState.aircrafts[5].airportLandingPosition!.x - 2 * getLandingCircleRadius(testGameState.aircrafts[5])
    )
    expect(Math.round(points5[1].y)).toBe(testGameState.aircrafts[5].airportLandingPosition!.y)

    //Opposite directions
    const points2 = getLandingCirclePoints(testGameState.aircrafts[2])

    expect(Math.round(points2[0].x)).toBe(testGameState.aircrafts[2].airportLandingPosition!.x)
    expect(points2[0].y).toBe(
      testGameState.aircrafts[2].airportLandingPosition!.y + 2 * getLandingCircleRadius(testGameState.aircrafts[2])
    )
    expect(Math.round(points2[1].x)).toBe(testGameState.aircrafts[2].airportLandingPosition!.x)
    expect(points2[1].y).toBe(
      testGameState.aircrafts[2].airportLandingPosition!.y - 2 * getLandingCircleRadius(testGameState.aircrafts[2])
    )
  })
})

describe('When steering planes', () => {
  beforeAll(() => {
    for (const plane of testGameState.aircrafts) {
      findDestination(testGameState, plane)
    }
  })

  test('Closest tangent point can be found when both not equal', async () => {
    const closestPoint3 = selectClosestTangentPoint(testGameState.aircrafts[3])
    expect(Math.round(closestPoint3.x)).toBe(90)
    expect(closestPoint3.y).toBe(-50 - 2 * getLandingCircleRadius(testGameState.aircrafts[3]))
  })

  test('Headed to tangent if airport direction is not (almost) straight forward ', async () => {
    expect(selectPointToHeadTo(testGameState.aircrafts[8])).toStrictEqual(
      testGameState.aircrafts[8].airportLandingPosition
    )
    expect(selectPointToHeadTo(testGameState.aircrafts[1])).toStrictEqual(
      selectClosestTangentPoint(testGameState.aircrafts[1])
    )
  })

  test('Direction selected correctly depending on distance to airport', async () => {
    expect(selectNewDirection(testGameState.aircrafts[1])).toBe(testGameState.airports[1].direction)
    expect(selectNewDirection(testGameState.aircrafts[0])).not.toBe(testGameState.airports[0].direction)
  })

  test('Aircraft can be turned', async () => {
    const initialDirection = testGameState.aircrafts[0].direction
    turnPlane(testGameState.aircrafts[0])
    const directionAfterTurning = testGameState.aircrafts[0].direction

    expect(initialDirection).not.toBe(directionAfterTurning)
  })

  test('If possible to collide, turned away from other plane', async () => {
    //Close enough to collide
    expect(getDistance(testGameState.aircrafts[3].position, testGameState.aircrafts[0].position)).toBeLessThanOrEqual(
      (testGameState.aircrafts[3].collisionRadius + testGameState.aircrafts[0].collisionRadius) * 1.5
    )

    const planeDirectionBeforeTurning = testGameState.aircrafts[3].direction
    turnPlane(testGameState.aircrafts[3], testGameState.aircrafts[0])
    const planeDirectionAfterAvoidingCollision = testGameState.aircrafts[3].direction

    //Reset to original value
    testGameState.aircrafts[3].direction = planeDirectionBeforeTurning
    turnPlane(testGameState.aircrafts[3])

    //Turned differently that would have without risk of collision
    expect(testGameState.aircrafts[3].direction).not.toBe(planeDirectionAfterAvoidingCollision)
  })

  test('If not possible to collide, turned towards airport', async () => {
    //Not close enough to collide
    expect(
      getDistance(testGameState.aircrafts[1].position, testGameState.aircrafts[0].position)
    ).toBeGreaterThanOrEqual(
      (testGameState.aircrafts[1].collisionRadius + testGameState.aircrafts[0].collisionRadius) * 1.5
    )

    const planeDirectionBeforeTurning = testGameState.aircrafts[1].direction
    checkCollisionPossibility(testGameState.aircrafts[1], testGameState.aircrafts[0])
    const planeDirectionAfterAvoidingCollision = testGameState.aircrafts[1].direction

    //Reset to original value
    testGameState.aircrafts[1].direction = planeDirectionBeforeTurning
    turnPlane(testGameState.aircrafts[1])

    //Turned similarly than without examining collision possibility
    expect(testGameState.aircrafts[1].direction).toBe(planeDirectionAfterAvoidingCollision)
  })

  test('If airplane routes are parallel, nobody gives way', async () => {
    //Close enough to collide
    expect(getDistance(testGameState.aircrafts[10].position, testGameState.aircrafts[9].position)).toBeLessThanOrEqual(
      (testGameState.aircrafts[10].collisionRadius + testGameState.aircrafts[9].collisionRadius) * 1.5
    )

    const planeDirectionBeforeTurning = testGameState.aircrafts[10].direction
    checkCollisionPossibility(testGameState.aircrafts[10], testGameState.aircrafts[9])
    const planeDirectionAfterAvoidingCollision = testGameState.aircrafts[10].direction

    //Reset to original value
    testGameState.aircrafts[10].direction = planeDirectionBeforeTurning
    turnPlane(testGameState.aircrafts[10])

    //Turned similarly than without examining collision possibility
    expect(testGameState.aircrafts[10].direction).toBe(planeDirectionAfterAvoidingCollision)
  })
})
