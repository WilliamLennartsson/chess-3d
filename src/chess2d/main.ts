import { initGame } from './game'
import { Game } from './types'
const canvas: HTMLCanvasElement = document.querySelector('#gameScreen')
const ctx = canvas.getContext('2d')
const WIDTH: number = parseInt(canvas.getAttribute('width'))
const HEIGHT: number = parseInt(canvas.getAttribute('height'))


window.onload = () => {
  initGame(WIDTH, HEIGHT, (game: Game) => {
    canvas.onmousedown = (e) => game.handleMouseDown(e.clientX, e.clientY)
    canvas.onmouseup = (e) => game.handleMouseUp(e.clientX, e.clientY)
    canvas.onmousemove = (e) => game.handleMouseMove(e.clientX, e.clientY)
    setInterval(() => {
      game.render(ctx)
    }, 100)
  })
}

/**
 * TODO
 * tileNames. e4, f8 etc..
 * Legal moves
 * Check / chackmate
 * Clock
 * Take turns
 * Move history
 */
