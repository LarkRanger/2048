import Grid from './Grid.js';
import Tile from './Tile.js';

const board = document.getElementById('board');

const grid = new Grid(board);

grid.randomEmptyCell().tile = new Tile(board);
grid.randomEmptyCell().tile = new Tile(board);

function setupInput() {
  window.addEventListener('keydown', handleInput, { once: true });
}

async function handleInput(event) {
  switch (event.key) {
    case 'ArrowUp':
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case 'ArrowDown':
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case 'ArrowRight':
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    case 'ArrowLeft':
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    default:
      setupInput();
      return;
  }

  grid.mergeTiles();

  const newTile = new Tile(board);
  grid.randomEmptyCell().tile = newTile;

  if (!canMoveDown() && !canMoveLeft() && !canMoveRight() && !canMoveUp) {
    await newTile.waitForAnimation().then(() => alert('You Lose'));
    return;
  }

  setupInput();
}

function moveUp() {
  return slide(grid.columns);
}

function moveDown() {
  return slide(grid.columns.map(column => [...column].reverse()));
}

function moveLeft() {
  return slide(grid.rows);
}

function moveRight() {
  return slide(grid.rows.map(row => [...row].reverse()));
}

setupInput();

function slide(grid) {
  const promises = [];
  grid.forEach(vector =>
    vector.forEach((cell, forward) => {
      if (forward === 0) return;
      if (!cell.tile) return;
      let target;
      for (let backward = forward - 1; backward >= 0; --backward) {
        const current = vector[backward];
        if (!current.canAccept(cell.tile)) break;
        target = current;
      }

      if (!target) return;

      promises.push(cell.tile.waitForTransition());
      target.tile ? (target.mergeTile = cell.tile) : (target.tile = cell.tile);
      cell.tile = null;
    }),
  );
  return Promise.all(promises);
}

function canMoveUp() {
  return canMove(grid.columns);
}

function canMoveLeft() {
  return canMove(grid.rows);
}

function canMoveRight() {
  return canMove(grid.rows.map(row => [...row].reverse()));
}

function canMoveDown() {
  return canMove(grid.columns.map(column => [...column].reverse()));
}

function canMove(grid) {
  return grid.some(vector =>
    vector.some((cell, index) => {
      if (index === 0) return false;
      if (!cell.tile) return false;
      const moveToCell = vector[index - 1];
      return moveToCell.canAccept(cell.tile);
    }),
  );
}
