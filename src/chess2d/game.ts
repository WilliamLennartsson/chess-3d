import board from "../chess/board"

const BG_COLOR = '#336633'
const COLOR_WHITE = '#669933'
const COLOR_BLACK = '#113366'
const COLOR_WHITE_PIECES = '#222244'
const COLOR_BLACK_PIECES = '#993388'
const COLOR_HIGHLIGHTED_TILE = '#117711'

interface Pos {
  x: number,
  y: number
}

enum PieceTypes {
  rook = 'rook',
  knight = 'knight',
  bishop = 'bishop',
  queen = 'queen',
  king = 'king',
  pawn = 'pawn'
}

type Side = 'WHITE' | 'BLACK'

interface Piece {
  x: number,
  y: number,
  type: PieceTypes,
  side: Side,
}

export interface Tile {
  x: number,
  y: number,
  piece: Piece,
  highlighted: boolean,
}

export interface Player {
  name: string,
  side: Side
}

export interface Board {
  tiles: Tile[][],
  selectedTile: Tile,
  players: Player[],
  rows: number,
  cols: number,
  width: number,
  height: number,
  tileWidth: number,
  tileHeight: number,
  forTile: (callback: (tile: Tile) => void) => void
}

export interface Game {
  board: Board,
  render: (ctx: CanvasRenderingContext2D) => void,
  handleMouseMove: (x: number, y: number) => void,
  handleMouseDown: (x: number, y: number) => void,
  handleMouseUp: (x: number, y: number) => void
}

export const initGame = (width: number, height: number): Game => {
  const board: Board = createBoard(width, height)

  // Rendering
  const render = (ctx) => {
    clearScreen(ctx)
    renderBoard(ctx)
    renderPieces(ctx)
  }
  const clearScreen = (ctx) => {
    ctx.fillStyle = BG_COLOR
    ctx.fillRect(0, 0, width, height)
  }
  const renderBoard = (ctx: CanvasRenderingContext2D) => {
    board.forTile((tile) => {
      const { x, y } = tile
      const { tileWidth, tileHeight } = board
      // console.log(tile.highlighted)
      if (tile.highlighted) ctx.fillStyle = COLOR_HIGHLIGHTED_TILE
      else ctx.fillStyle = (x + y) % 2 == 0 ? COLOR_WHITE : COLOR_BLACK
      ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight)
    })
  }
  const renderPieces = (ctx: CanvasRenderingContext2D) => {
    board.forTile((tile) => {
      if (isTileEmpty(tile)) {
        const x = (tile.x * board.tileWidth) + (board.tileWidth * 0.5)
        const y = (tile.y * board.tileHeight) + (board.tileWidth * 0.5)
        const color = getPieceColor(tile.piece)
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.arc(x, y, 20, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      }
    })
  }

  // Utils
  const clearBoardHighlights = () => board.forTile(tile => tile.highlighted = false)
  const isTileEmpty = (tile: Tile) => tile.piece?.type
  const getPieceColor = (piece: Piece) => piece.side === 'WHITE' ? COLOR_WHITE_PIECES : COLOR_BLACK_PIECES
  const getTilePos = (x: number, y: number): Pos => {
    return {
      x: Math.floor(x / board.tileWidth),
      y: Math.floor(y / board.tileHeight),
    }
  }
  const getTile = (pos: Pos) => board.tiles[pos.y][pos.x]
  const isPosWithinBounds = (pos: Pos) => (pos.x >= 0 && pos.x < board.tiles.length) && (pos.y >= 0 && pos.y < board.tiles[pos.x].length)
  const isSameTile = (tile1: Tile, tile2: Tile) => tile1.x === tile2.x && tile1.y === tile2.y

  const movePiece = (from: Tile, to: Tile) => {
    //TODO: Add so that only the correct player can move the piece
    to.piece = from.piece
    from.piece = null
  }

  // Input handlers
  const handleMouseMove = (x: number, y: number) => { }
  const handleMouseDown = (x: number, y: number) => {
    const tilePos = getTilePos(x, y)
    const withinBounds = isPosWithinBounds(tilePos)
    if (withinBounds) {
      const tile = getTile(tilePos)
      const moves = getMoves(tile, board)

      // Only for testing
      const highlightTiles = moves.map(move => getTile(move))
      highlightTiles.forEach(tile => tile.highlighted = true)
      // ----_------- HÄR SLUTADE JAG kl 04.20..
      board.selectedTile = tile
      tile.highlighted = true
      // TODO: legalMoves rename to getMoves. legalMoves filters which of all possible moves are legal
      // const moves = getMoves(tile) 
    }
  }

  const handleMouseUp = (x: number, y: number) => {
    const tilePos = getTilePos(x, y)
    const withinBounds = isPosWithinBounds(tilePos)
    if (withinBounds) {
      const from = board.selectedTile
      const to = getTile(tilePos)
      if (!isSameTile(from, to)) movePiece(from, to)
      board.selectedTile.highlighted = false
      board.selectedTile = null
    }
    clearBoardHighlights()
  }

  return {
    board,
    render,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
  }
}

export const createBoard = (width: number, height: number): Board => {
  const backRank = [
    PieceTypes.rook,
    PieceTypes.knight,
    PieceTypes.bishop,
    PieceTypes.queen,
    PieceTypes.king,
    PieceTypes.bishop,
    PieceTypes.knight,
    PieceTypes.rook
  ]

  const size = 8
  const tileWidth = width / size
  const tileHeight = height / size
  const rows = 8
  const cols = 8
  const tiles: Tile[][] = []
  const players = []

  for (let y = 0; y < cols; y++) {
    tiles.push([])
    for (let x = 0; x < cols; x++) {
      const side: Side = y == 0 || y == 1 ? 'WHITE' : 'BLACK'
      const piece = { x, y, type: null, side }
      if (y == 0 || y == 7) piece.type = backRank[x]
      if (y == 1 || y == 6) piece.type = PieceTypes.pawn
      const tile = { x, y, piece: piece, highlighted: false }
      tiles[y].push(tile)
    }
  }

  const forTile = (callback: (tile: Tile) => void) => {
    tiles.map(row => {
      row.map(tile => {
        callback(tile)
      })
    })
  }

  return {
    rows, cols,
    width, height,
    tileWidth, tileHeight,
    tiles,
    players,
    forTile,
    selectedTile: null,
  }
}

const getMoves = (tile: Tile, board: Board): Pos[] => {
  // TODO
  const piece = tile.piece
  if (!piece) return

  const legalMoves = []
  const pos = { x: tile.x, y: tile.y }

  switch (piece.type) {
    case PieceTypes.pawn:
      const dir = piece.side === 'WHITE' ? 1 : -1
      return [
        // Move up 1 § 2
        { x: pos.x, y: pos.y + dir },
        { x: pos.x, y: pos.y + (2 * dir) },
        // Capture left / right
        { x: pos.x + 1, y: pos.y + dir },
        { x: pos.x - 1, y: pos.y + dir },
      ]
      // Move one up / down
      // Move two up / down
      // Capture upRight, upLeft / downRight, downLeft
      // Capture a passant
      // Promote
      break;
    case PieceTypes.rook:
      for (let i = 0; i < board.rows; i++) { }
      return [

      ]
      break;
    case PieceTypes.knight:
      break;
    case PieceTypes.bishop:
      break;
    case PieceTypes.queen:
      break;
    case PieceTypes.king:
      break;
  }
  return []
}