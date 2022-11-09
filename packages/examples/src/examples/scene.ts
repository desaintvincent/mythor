import { createLoadingScene, Game } from '@mythor/game'
import createMainScene from './scene/createMainScene'

const game = new Game(createLoadingScene(), createMainScene())

game.start()
