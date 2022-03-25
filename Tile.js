export default class Tile {
  #tileElement;
  #x;
  #y;
  #value;

  constructor(board) {
    this.#tileElement = document.createElement('div');
    this.#tileElement.className = 'tile';
    board.append(this.#tileElement);
    this.value = Math.random() > 0.5 ? 2 : 4;
  }

  set x(x) {
    this.#x = x;
    this.#tileElement.style.setProperty('--x', x);
  }

  set y(y) {
    this.#y = y;
    this.#tileElement.style.setProperty('--y', y);
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value;
    this.#tileElement.textContent = value;
    const power = Math.log2(value);
    const bgLightness = 100 - power * 9;
    this.#tileElement.style.setProperty(
      '--background-lightness',
      `${bgLightness}%`,
    );
    this.#tileElement.style.setProperty(
      '--text-lightness',
      `${bgLightness < 50 ? 90 : 10}%`,
    );
  }

  remove() {
    this.#tileElement.remove();
  }

  waitForTransition() {
    return new Promise(resolve =>
      this.#tileElement.addEventListener('transitionend', resolve, {
        once: true,
      }),
    );
  }

  waitForAnimation() {
    return new Promise(resolve =>
      this.#tileElement.addEventListener('animationend', resolve, {
        once: true,
      }),
    );
  }
}
