import { Aircraft, Point } from '../types'

const initialAircrafts: Aircraft[] = [
  {
    id: '001',
    name: 'lentsikka',
    position: { x: -50, y: -100 },
    direction: 90,
    speed: 5,
    destination: 'A',
  },
  //Inside an airport
  {
    id: '002',
    name: 'helikopteri',
    position: { x: 0, y: 50 },
    direction: 180,
    speed: 5,
    destination: 'B',
  },
  //Directly infront airport but wrong way around
  {
    id: '003',
    name: 'hornetti',
    position: { x: 200, y: -50 },
    direction: 180,
    speed: 5,
    destination: 'B',
  },
  //To test collision
  {
    id: '004',
    name: 'vesitaso',
    position: { x: -50, y: -100 },
    direction: 270,
    speed: 5,
    destination: 'B',
  },
]

const initialAirports = [
  {
    name: 'A',
    position: { x: 100, y: 50 },
    direction: 0,
  },
  {
    name: 'B',
    position: { x: 100, y: -50 },
    direction: 0,
  },
]

const box: [Point, Point] = [
  { x: -200, y: -200 },
  { x: 200, y: 200 },
]

export const testGameState = {
  bbox: box,
  airports: initialAirports,
  aircrafts: initialAircrafts,
}
