const ROWS = 8
const COLS = 8

const Tile = (x, y) => {
  return {
    pieceType: null,
    x,
    y,
    id: x + y,
  }
}

export default () => {
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
  const addPiece = (type, x, y) => {
    if (tiles.length <= x) return
    if (tiles[x].length <= y) return
    tiles[x][y].pieceType = type
  }
  return {
    tiles,
    forTile,
    addPiece
  }
}