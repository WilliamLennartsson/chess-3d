import * as THREE from '../../../dependencies/three.module.js'

import Component from './component.js'
import SkinInstance from './skinInstance.js'
import Board from '../../board.js'
import Piece from './Piece';

const defaultProps = {
  models: {},
  grid: null
}

const innerRow = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook']
const outerRow = ['Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn']

export default class GameLogic extends Component {
  constructor(gameObject, config = defaultProps) {
    super(gameObject)
    const props = Object.assign(defaultProps, config)
    this.board = new Board()
    console.log('board in GameLogic :>> ', this.board)
    this.board.addPiece('Knight', 0, 5)
    this.board.addPiece('Knight', 0, 3)
    console.log('this.board :>> ', this.board);
    // this.populateGrid(gameObject, this.board, props.grid, props.models)

    // const pieces = gameObject.getComponentsByType(Piece)
    // // console.log('gameObject :>> ', gameObject);
    // console.log('pieces :>> ', pieces);
    // this.movePiece(pieces[0], props.grid, 1, 1)
    // this.movePiece(pieces[1], props.grid, 2, 2)
  }

  populateGrid = () => {
    this.board.forTile(tile => {
      if (tile.y == 0 || tile.y == 7) {
        tile.pieceType = innerRow[tile.x]
      }
      if (tile.y == 1 || tile.y == 6) {
        tile.pieceType = outerRow[tile.x]
      }
    })
  }


  update(deltaTime) {

  }
}