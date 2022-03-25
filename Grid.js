const CELL_SIZE = 20;
const CELL_GAP = 1;
const GRID_SIZE = 4;

export default class Grid {
  #cells;

  constructor(gridElement) {
    gridElement.style.setProperty('--grid-size', GRID_SIZE);
    gridElement.style.setProperty('--cell-size', `${CELL_SIZE}vmin`);
    gridElement.style.setProperty('--cell-gap', `${CELL_GAP}vmin`);
    this.#cells = createCells(gridElement).map(
      (cellElement, index) =>
        new Cell(cellElement, index % GRID_SIZE, Math.floor(index / GRID_SIZE)),
    );
  }

  get #emptyCells() {
    return this.#cells.filter(cell => cell.tile === null);
  }

  get columns() {
    return this.#cells.reduce((columns, cell) => {
      (columns[cell.x] || (columns[cell.x] = []))[cell.y] = cell;
      return columns;
    }, []);
  }

  get rows() {
    return this.#cells.reduce((rows, cell) => {
      (rows[cell.y] || (rows[cell.y] = []))[cell.x] = cell;
      return rows;
    }, []);
  }

  randomEmptyCell() {
    const index = Math.floor(Math.random() * this.#emptyCells.length);
    return this.#emptyCells[index];
  }

  mergeTiles() {
    this.#cells.forEach(cell => cell.mergeTiles());
  }
}

class Cell {
  #cellElement;
  #x;
  #y;
  #tile;
  #mergeTile;

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
    this.#tile = null;
  }

  get tile() {
    return this.#tile;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set tile(tile) {
    this.#tile = tile;
    if (tile === null) return;
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }

  set mergeTile(tile) {
    this.#mergeTile = tile;
    if (!tile) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  canAccept(tile) {
    return !this.#tile || (!this.mergeTile && this.#tile.value === tile.value);
  }

  mergeTiles() {
    if (!this.#tile || !this.#mergeTile) return;
    this.#tile.value = this.#tile.value + this.#mergeTile.value;
    this.#mergeTile.remove();
    this.mergeTile = null;
  }
}

function createCells(gridElement) {
  const cells = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; ++i) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cells.push(cell);
    gridElement.append(cell);
  }
  return cells;
}
