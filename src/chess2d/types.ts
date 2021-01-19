
export interface Pos {
  x: number,
  y: number
}
export interface Offset {
  x: number,
  y: number
}

export enum PieceTypes {
  rook = 'rook',
  knight = 'knight',
  bishop = 'bishop',
  queen = 'queen',
  king = 'king',
  pawn = 'pawn'
}

export type Side = 'WHITE' | 'BLACK'

export interface Piece {
  x: number,
  y: number,
  type: PieceTypes,
  side: Side,
}

export interface Tile {
  x: number,
  y: number,
  piece: Piece | null,
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