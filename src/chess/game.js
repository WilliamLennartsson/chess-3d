import * as THREE from '../dependencies/three.module.js'

import Board from './board'

import Player from './componentSystem/components/player'
import Piece from './componentSystem/components/Piece'
import Grid from './componentSystem/components/grid.js'
import GameLogic from './componentSystem/components/gameLogic.js'


import MouseControlManager from './controls/mouseControls.js'
import KeyboardInputManager from './controls/keyboardInputManager.js'

import GameObjectManager from './componentSystem/gameObjectManager.js'
import { loadModels, prepModelsAnimations } from './loaders/loaders.js'
import PieceHandler from './componentSystem/components/pieceHandler.js'

const containerId = 'chessCanvas'

export default () => {
  loadModels(() => {
    const { clock, scene, camera, canvas, renderer, gameObjectManager } = setUp()
    const models = prepModelsAnimations()

    // const player = gameObjectManager.createGameObject(scene, 'Player')
    // player.addComponent(Player, { model: models.fox })

    const chessBoard = gameObjectManager.createGameObject(scene, 'Grid')
    chessBoard.addComponent(Grid)
    console.log('chessBoard :>> ', chessBoard);
    const grid = chessBoard.getComponentByType(Grid)
    const gridCenter = grid.getCenter()
    console.log('gridCenter :>> ', gridCenter)

    const game = gameObjectManager.createGameObject(scene, 'Game')
    game.addComponent(GameLogic, { models, grid })
    const gameLogic = game.getComponentByType(GameLogic)
    gameLogic.populateGrid()

    console.log('grid :>> ', grid);
    const board = gameLogic.board
    board.forTile(tile => {
      const { pieceType } = tile
      if (pieceType) {
        let tilePos = new THREE.Vector3(tile.x, 1, tile.y)
        if (grid) {
          tilePos = grid.getCenterOfTile(tile.x, tile.y)
          // console.log('tilePos :>> ', tilePos);
        }
        const gameObject = gameObjectManager.createGameObject(scene, 'Piece')
        gameObject.addComponent(Piece, { model: models.duck, type: pieceType, position: tilePos })
      }
    })

    const movePiece = (piece, grid, row, column) => {
      const newPos = grid.getCenterOfTile(row, column)
      piece.transform.position.x = newPos.x
      piece.transform.position.z = newPos.z
    }

    // const rook1 = gameObjectManager.createGameObject(scene, 'Rook')
    // pieceHandler.addComponent(PieceHandler, { models: models })
    // const rook2 = gameObjectManager.findGameObjectByName('Rook')
    // console.log('rook2 :>> ', rook2)

    // movePiece(rook1, 0, 0)
    // movePiece(rook2, 0, 1)

    const update = function () {
      // requestAnimationFrame(update);
      const delta = clock.getDelta()
      gameObjectManager.update(delta)
      // Camera follow function
      const rotationAngle = chessBoard.transform.rotation.y
      var rotZ = Math.cos(rotationAngle)
      var rotX = Math.sin(rotationAngle)
      var distance = 50;
      // TODO: Camera class
      camera.position.x = chessBoard.transform.position.x - (distance * rotX);
      camera.position.y = chessBoard.transform.position.y + 20;
      camera.position.z = chessBoard.transform.position.z - (distance * rotZ);

      camera.lookAt(gridCenter)

      // Zoom out effect
      // camera.position.z += 0.04
      renderer.render(scene, camera);
    }
    requestAnimationFrame(update)
  })
}



function setUp() {
  // Clock
  const clock = new THREE.Clock()

  // Scene 
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x222222)

  // Camera
  const fov = 45
  const aspect = 2  // the canvas default
  const near = 0.1
  const far = 200
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  camera.position.set(0, 10, 0);

  // Renderer
  const canvas = document.getElementById('3DScreen');
  // canvas.onwheel = onWheelEvent
  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(window.innerWidth, window.innerHeight)
  //document.body.appendChild(renderer.domElement)

  // Light
  var light = new THREE.DirectionalLight(0xfdfdfd, 2)
  light.position.set(2, 2, 1).normalize()
  scene.add(light)

  // Controls
  // mouseControls = new MouseControlManager(scene, camera)
  const keyboardInputManager = new KeyboardInputManager()

  // GameObjectManager
  const gameObjectManager = new GameObjectManager()
  return { clock, scene, camera, canvas, renderer, keyboardInputManager, gameObjectManager }
}
// window.onresize = () => { resizeScreen(renderer) }
