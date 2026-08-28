import { createLoadingScene, Game } from '@mythor/game'
import createMainScene from './scene/createMainScene'
import showDescription from '../util/showDescription'

showDescription('Switching between scenes, with a loading screen in between.', [
  'Right click: go to the next scene',
])

const game = new Game(createLoadingScene(), createMainScene())

game.start()
