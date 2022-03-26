import Grid from './Grid.js';
import Tile from './Tile.js';

const board = document.getElementById('board');
const score = document.getElementById('score');

const grid = new Grid(board);

const spawnTile = () => {
  const newTile = new Tile(board);
  grid.randomEmptyCell().tile = newTile;
  return newTile;
};

spawnTile();
spawnTile();

function setupInput() {
  window.addEventListener('keydown', handleInput, { once: true });
}

async function handleInput(event) {
  switch (event.key) {
    case 'ArrowUp':
      if (!canMoveUp()) return setupInput();
      await slideUp();
      break;
    case 'ArrowDown':
      if (!canMoveDown()) return setupInput();
      await slideDown();
      break;
    case 'ArrowRight':
      if (!canMoveRight()) return setupInput();
      await slideRight();
      break;
    case 'ArrowLeft':
      if (!canMoveLeft()) return setupInput();
      await slideLeft();
      break;
    default:
      return setupInput();
  }

  grid.mergeTiles();
  grid.updateScore(score);

  const tile = spawnTile();

  if (!canMoveDown() && !canMoveLeft() && !canMoveRight() && !canMoveUp())
    return await tile.waitForAnimation().then(() => alert('You Lose'));

  setupInput();
}

function slide(grid) {
  const promises = [];
  grid.forEach(vector =>
    vector.forEach((cell, forward) => {
      if (forward === 0) return;
      if (!cell.tile) return;
      let targetCell;
      for (let backward = forward - 1; backward >= 0; --backward) {
        const currentCell = vector[backward];
        if (!currentCell.canAccept(cell.tile)) break;
        targetCell = currentCell;
      }

      if (!targetCell) return;

      promises.push(cell.tile.waitForTransition());
      targetCell.tile
        ? (targetCell.mergeTile = cell.tile)
        : (targetCell.tile = cell.tile);
      cell.tile = null;
    }),
  );
  return Promise.all(promises);
}

const slideUp = () => slide(grid.columns);
const slideDown = () => slide(grid.columns.map(c => [...c].reverse()));
const slideLeft = () => slide(grid.rows);
const slideRight = () => slide(grid.rows.map(r => [...r].reverse()));

function canMove(grid) {
  return grid.some(vector =>
    vector.some((cell, index) => {
      if (index === 0) return false;
      if (!cell.tile) return false;
      const targetCell = vector[index - 1];
      return targetCell.canAccept(cell.tile);
    }),
  );
}

const canMoveUp = () => canMove(grid.columns);
const canMoveDown = () => canMove(grid.columns.map(c => [...c].reverse()));
const canMoveLeft = () => canMove(grid.rows);
const canMoveRight = () => canMove(grid.rows.map(r => [...r].reverse()));

setupInput();
grid.updateScore(score);
