import tilesetImg from '../assets/tileset.png'
import { Pos, Offset, Piece, Tile, Player, Board, Game, Side, PieceTypes } from './types'

const rows = 8
const cols = 8

const BG_COLOR = '#336633'

const COLOR_TILE_BORDER = '#000000'
const COLOR_WHITE = '#669933'
const COLOR_BLACK = '#113366'
const COLOR_WHITE_PIECES = '#222244'
const COLOR_BLACK_PIECES = '#993388'
const COLOR_HIGHLIGHTED_TILE = '#ff0581'

const loadAssets = (callback: (tileset: HTMLImageElement) => void) => {
  const img = new Image();
  img.addEventListener('load', function () {
    callback(img)
  }, false);
  img.src = tilesetImg
}

export const initGame = (width: number, height: number, onComplete: (game: Game) => void) => {
  loadAssets(tileset => {
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
        if (tile.highlighted) ctx.fillStyle = COLOR_HIGHLIGHTED_TILE
        else ctx.fillStyle = (x + y) % 2 == 0 ? COLOR_WHITE : COLOR_BLACK
        ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight)
        ctx.fillStyle = COLOR_TILE_BORDER
        ctx.strokeRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight)
      })
    }
    const renderPieces = (ctx: CanvasRenderingContext2D) => {
      const spriteWidth = tileset.width / 6
      const spriteHeight = tileset.height / 2
      const { tileWidth, tileHeight } = board
      board.forTile((tile) => {
        if (isTileEmpty(tile)) {
          const { side, type } = tile.piece
          const x = (tile.x * board.tileWidth)
          const y = (tile.y * board.tileHeight)
          const offset = getTileOffset(type, side, spriteWidth, spriteHeight)
          const offsetX = offset.x
          const offsetY = offset.y
          ctx.drawImage(tileset, offsetX, offsetY, spriteWidth, spriteHeight, x, y, tileWidth, tileHeight)
        }
      })
    }

    // Utils
    const clearBoardHighlights = () => board.forTile(tile => tile.highlighted = false)
    const isTileEmpty = (tile: Tile) => tile.piece
    const getPieceColor = (piece: Piece) => piece.side === 'WHITE' ? COLOR_WHITE_PIECES : COLOR_BLACK_PIECES
    const getTilePos = (x: number, y: number): Pos => {
      return {
        x: Math.floor(x / board.tileWidth),
        y: Math.floor(y / board.tileHeight),
      }
    }
    const getTile = (pos: Pos): Tile => board.tiles[pos.y][pos.x]
    const isPosWithinBounds = (pos: Pos) => (pos.x >= 0 && pos.x < board.tiles.length) && (pos.y >= 0 && pos.y < board.tiles[pos.x].length)
    const isSameTile = (tile1: Tile, tile2: Tile) => (tile1.x === tile2.x && tile1.y === tile2.y)

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
        console.log('tile', tile)
        const moves = getMoves(tile, board).filter(move => isPosWithinBounds(move))
        const legalMoves = getLegalMoves(tile, board, moves)
        // Only for testing
        const highlightTiles = legalMoves.map(move => getTile(move))
        highlightTiles.forEach(tile => tile.highlighted = true)
        board.selectedTile = tile
        tile.highlighted = true
      }
    }

    const handleMouseUp = (x: number, y: number) => {
      const tilePos = getTilePos(x, y)
      const withinBounds = isPosWithinBounds(tilePos)
      if (withinBounds) {
        const from = board.selectedTile
        const to = getTile(tilePos)
        const fromTileEmpty = isTileEmpty(from)
        if (!isSameTile(from, to) && fromTileEmpty) {
          movePiece(from, to)
        }
        board.selectedTile.highlighted = false
        board.selectedTile = null
      }
      clearBoardHighlights()
    }

    onComplete({
      board,
      render,
      handleMouseMove,
      handleMouseDown,
      handleMouseUp,
    })
  })
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

  const tileWidth = width / rows
  const tileHeight = height / cols
  const tiles: Tile[][] = []
  const players = []

  for (let y = 0; y < cols; y++) {
    tiles.push([])
    for (let x = 0; x < cols; x++) {
      const side: Side = y == 0 || y == 1 ? 'WHITE' : 'BLACK'
      const piece = { x, y, type: null, side }
      if (y == 0 || y == 7) piece.type = backRank[x]
      if (y == 1 || y == 6) piece.type = PieceTypes.pawn
      const tile = { x, y, piece: piece.type ? piece : null, highlighted: false }
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

const getLegalMoves = (tile: Tile, board: Board, moves: Pos[]): Pos[] => {
  // TODO: 
  return moves
}

const getMoves = (tile: Tile, board: Board): Pos[] => {
  // TODO
  const piece = tile.piece
  if (!piece) return []
  let moves = []

  const pos = { x: tile.x, y: tile.y }
  moves = getMovesForPiece(piece.type, piece.side, pos.x, pos.y)

  return moves
}

const getMovesForPiece = (type: PieceTypes, side: Side, x: number, y: number): Pos[] => {
  const moves = []
  switch (type) {
    case PieceTypes.pawn:
      const dir = side === 'WHITE' ? 1 : -1
      // Move up 1 § 2
      moves.push({ x: x, y: y + dir })
      moves.push({ x: x, y: y + (2 * dir) })
      // Capture left / right
      moves.push({ x: x + 1, y: y + dir })
      moves.push({ x: x - 1, y: y + dir })
      break;
    case PieceTypes.rook:
      for (let i = 0; i < rows; i++) {
        moves.push({ x: x, y: i })
        moves.push({ x: i, y: y })
      }
      break;
    case PieceTypes.knight:
      const posX = x
      const posY = y
      const xArr: number[] = [2, 1, - 1, -2, -2, -1, 1, 2]
      const yArr: number[] = [1, 2, 2, 1, - 1, -2, -2, -1]
      for (let i = 0; i < 8; i++) {
        const x = posX + xArr[i]
        const y = posY + yArr[i]
        moves.push({ x, y })
      }
      break
    case PieceTypes.bishop:
      const bishopX = x
      const bishopY = y
      const maxIterations = Math.max(7 - bishopX, 7 - bishopY, bishopX, bishopY);
      // const boardSize = board.tiles.length
      for (let iteration = 0; iteration <= maxIterations; iteration++) {
        if (bishopX + iteration <= rows) {
          if (bishopY + iteration <= cols) moves.push({ x: bishopX + iteration, y: bishopY + iteration }) // Up right
          if (bishopY - iteration >= 0) moves.push({ x: bishopX + iteration, y: bishopY - iteration }) // Down right
        }
        if (bishopX - iteration >= 0) {
          if (bishopY - iteration >= 0) moves.push({ x: bishopX - iteration, y: bishopY - iteration }) // Up left
          if (bishopY + iteration <= cols) moves.push({ x: bishopX - iteration, y: bishopY + iteration }) // Down left 
        }
      }
      break
    case PieceTypes.queen:
      moves.push(...getMovesForPiece(PieceTypes.rook, side, x, y))
      moves.push(...getMovesForPiece(PieceTypes.bishop, side, x, y))
      break
    case PieceTypes.king:
      moves.push(
        { x: x + 1, y: y },
        { x: x - 1, y: y },
        { x: x, y: y + 1 },
        { x: x, y: y - 1 },
        { x: x + 1, y: y + 1 },
        { x: x - 1, y: y + 1 },
        { x: x + 1, y: y - 1 },
        { x: x - 1, y: y - 1 },
      )
      break
  }
  return moves
}

// TILES
// TODO: Sprite interface. All pieces should hold a ref to how to draw the correct sprite
const tilesetLayout = [PieceTypes.king, PieceTypes.queen, PieceTypes.rook, PieceTypes.knight, PieceTypes.bishop, PieceTypes.pawn]
const getTileOffset = (type: PieceTypes, side: Side, spriteWidth: number, spriteHeight: number): Offset => {
  const spriteIndex = tilesetLayout.indexOf(type)
  if (spriteIndex > -1) {
    return {
      x: spriteIndex * spriteWidth,
      y: side === 'BLACK' ? 0 : spriteHeight
    }
  } else {
    return { x: 0, y: 0 }
  }
}