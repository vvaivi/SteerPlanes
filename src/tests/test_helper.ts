import { Aircraft, Point } from '../types'

const initialAircrafts: Aircraft[] = [
  {
    id: '001',
    name: 'lentsikka',
    position: { x: -50, y: -100 },
    direction: 90,
    speed: 5,
    destination: 'A',
    collisionRadius: 20,
  },
  //Inside an airport
  {
    id: '002',
    name: 'helikopteri',
    position: { x: 100, y: -50 },
    direction: 180,
    speed: 5,
    destination: 'B',
    collisionRadius: 20,
  },
  //Directly infront airport but wrong way around
  {
    id: '003',
    name: 'hornetti',
    position: { x: 200, y: -50 },
    direction: 180,
    speed: 5,
    destination: 'B',
    collisionRadius: 20,
  },
  //To test collision
  {
    id: '004',
    name: 'vesitaso',
    position: { x: -70, y: -100 },
    direction: 270,
    speed: 5,
    destination: 'B',
    collisionRadius: 20,
  },
  //To test different directions of airports
  {
    id: '005',
    name: 'paperilennokki',
    position: { x: -50, y: -100 },
    direction: 270,
    speed: 5,
    destination: 'C',
    collisionRadius: 20,
  },
  {
    id: '006',
    name: 'drone',
    position: { x: -50, y: -100 },
    direction: 270,
    speed: 5,
    destination: 'D',
    collisionRadius: 20,
  },
  {
    id: '007',
    name: 'pulu',
    position: { x: -50, y: -100 },
    direction: 270,
    speed: 5,
    destination: 'E',
    collisionRadius: 20,
  },
  {
    id: '008',
    name: 'leija',
    position: { x: -50, y: -100 },
    direction: 45,
    speed: 5,
    destination: 'A',
    collisionRadius: 20,
  },
  {
    id: '009',
    name: 'ufo',
    position: { x: 100, y: -70 },
    direction: 0,
    speed: 5,
    destination: 'A',
    collisionRadius: 20,
  },
]

const initialAirports = [
  {
    name: 'A',
    position: { x: 100, y: 50 },
    direction: 0,
    landingRadius: 10,
  },
  {
    name: 'B',
    position: { x: 100, y: -50 },
    direction: 0,
    landingRadius: 10,
  },
  {
    name: 'C',
    position: { x: 100, y: -50 },
    direction: 270,
    landingRadius: 10,
  },
  {
    name: 'D',
    position: { x: 100, y: -50 },
    direction: 90,
    landingRadius: 10,
  },
  {
    name: 'E',
    position: { x: 100, y: -50 },
    direction: 180,
    landingRadius: 10,
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
