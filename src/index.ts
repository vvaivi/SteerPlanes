import 'dotenv/config'
import fetch from 'node-fetch'
import open from 'open'
import WebSocket from 'ws'
import { findDestination, turnPlane } from './components/moves'
import { checkCollisionPossibility } from './components/path'
import { Aircraft, GameInstance, Message, NoPlaneState } from './types'
import { normalizeHeading } from './utils/math'
import { message } from './utils/message'

const frontend_base = 'noflight.monad.fi'
const backend_base = 'noflight.monad.fi/backend'

const generateCommands = (gameState: NoPlaneState) => {
  const { aircrafts } = gameState
  const commands = []
  let previousPlane: Aircraft = aircrafts[0]

  for (const aircraft of aircrafts) {
    findDestination(gameState, aircraft)

    //To avoid steering when not needed
    const previousDirection = aircraft.direction

    //Decided that first plane on the list can move unobstructed and other planes make way for it if needed
    aircraft.id === aircrafts[0].id ? turnPlane(aircraft) : checkCollisionPossibility(aircraft, previousPlane)

    //Saving for next round to be able to examine collision
    previousPlane = aircraft

    //Examining if direction is really changed or just rounding error
    if (Math.abs(previousDirection - aircraft.direction) > 1) {
      commands.push(`HEAD ${aircraft.id} ${normalizeHeading(aircraft.direction)}`)
    }
  }

  return commands
}

const createGame = async (levelId: string, token: string) => {
  const res = await fetch(`https://${backend_base}/api/levels/${levelId}`, {
    method: 'POST',
    headers: {
      Authorization: token,
    },
  })

  if (!res.ok) {
    console.error(`Couldn't create game: ${res.statusText} - ${await res.text()}`)
    return null
  }

  return res.json() as any as GameInstance // Can be made safer
}

const main = async () => {
  const token = process.env['TOKEN'] ?? ''
  const levelId = process.env['LEVEL_ID'] ?? ''

  const game = await createGame(levelId, token)
  if (!game) return

  const url = `https://${frontend_base}/?id=${game.entityId}`
  console.log(`Game at ${url}`)
  await open(url)
  await new Promise((f) => setTimeout(f, 2000))

  const ws = new WebSocket(`wss://${backend_base}/${token}/`)

  ws.addEventListener('open', () => {
    ws.send(message('sub-game', { id: game.entityId }))
  })

  ws.addEventListener('message', ({ data }) => {
    const [action, payload] = JSON.parse(data.toString()) as Message<'game-instance'>

    if (action !== 'game-instance') {
      console.log([action, payload])
      return
    }

    // New game tick arrived!
    const gameState = JSON.parse(payload['gameState']) as NoPlaneState
    const commands = generateCommands(gameState)

    setTimeout(() => {
      ws.send(message('run-command', { gameId: game.entityId, payload: commands }))
    }, 100)
  })
}

await main()
