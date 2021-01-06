import * as THREE from '../../../dependencies/three.module.js'
import Component from './component.js';
import Box from './box'

const ROWS = 8
const COLS = 8
const tileSize = 10
const tileHeight = 0.2
const tileSpacing = 1

export default class Grid extends Component {
  constructor(gameObject) {

    super(gameObject)
    this.gameObject = gameObject
    // gameObject.addComponent(Box, { x: 0, y: 0, z: 0 }, 5, 5)

    for (let y = 0; y < COLS; y++) {
      for (let x = 0; x < ROWS; x++) {
        gameObject.addComponent(Box, { x: x * tileSize, y: 0, z: y * tileSize }, tileSize - tileSpacing, tileHeight, tileSize - tileSpacing)
      }
    }
    this.tileSize = tileSize
    this.tileHeight = tileHeight
    this.tileSpacing = tileSpacing
  }

  getCenter = () => {
    const pos = this.gameObject.transform.position
    const x = pos.x + ((this.tileSize * ROWS) * 0.5)
    const y = pos.y
    const z = pos.z + ((this.tileSize * COLS) * 0.5)
    return new THREE.Vector3(x, y, z)
  }
  getGridSize = () => {
    return this.tileSize * (ROWS - 1)
  }

  getCenterOfTile = (x, y) => {
    return new THREE.Vector3(this.getGridSize() - (x * tileSize), this.gameObject.transform.position.y, y * tileSize)
  }

  forTile(callback) {
    tiles.map(row => {
      row.map(tile => {
        callback(tile)
      })
    })
  }
  update(deltaTime) {
  }
}


const Tile = (x, y) => {
  return {
    piece: null,
    x,
    y,
    id: x + y,
  }
}

const gridHelper = () => {
  const tiles = []
  for (let y = 0; y < COLS; y++) {
    tiles.push([])
    for (let x = 0; x < ROWS; x++) {
      tiles[y].push(new Tile(x, y))
    }
  }
  const forTile = (callback) => {
    tiles.map(row => {
      row.map(tile => {
        callback(tile)
      })
    })
  }
  const getTile = (x, y) => {
    return tiles[x][y]
  }
  return {
    tiles,
    forTile,
    getTile
  }
}