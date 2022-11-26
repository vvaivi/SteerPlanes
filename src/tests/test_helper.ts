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
  //To test different directions of airports
  {
    id: '005',
    name: 'paperilennokki',
    position: { x: -50, y: -100 },
    direction: 270,
    speed: 5,
    destination: 'C',
  },
  {
    id: '006',
    name: 'drone',
    position: { x: -50, y: -100 },
    direction: 270,
    speed: 5,
    destination: 'D',
  },
  {
    id: '007',
    name: 'drone',
    position: { x: -50, y: -100 },
    direction: 270,
    speed: 5,
    destination: 'E',
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
