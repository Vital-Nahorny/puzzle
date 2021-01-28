import soundClick from './soundClick';
import Timer from './Timer';
import createArrayOfChipsField from './createArrayOfChipsField';
import create from './createElement';

class Puzzle {
  constructor() {
    this.elements = {
      gameField: null,
      info: null,
      control: null,
      fieldSize: null,
      topScore: null,
      chips: [],
      emptyChip: null,
      count: null,
      timer: null,
    };

    this.properties = {
      imgNum: 0,
      topResults: [],
      sound: true,
      count: 0,
      chipSize: 100,
      fieldSize: 8,
    };
    this.gameTimer = null;
  }

  init() {
    this.elements.info = create(
      'div',
      'info',
      this.renderInfoBlock(),
      document.body,
    );
    this.elements.control = create(
      'div',
      'control',
      this.renderControlsBlock(),
      document.body,
    );
    this.elements.topScore = create(
      'div',
      'top-score',
      this.renderScoreBlock(),
      document.body,
    );
    this.elements.gameField = create('div', 'game-field', null, document.body);
    this.elements.gameField.appendChild(this.renderGameField());
    this.createEventListeners();
    // <button type="button" class="btn btn-primary">Button</button>
    // create('button', 'btn btn-primary', 'Hello', document.body);
  }

  renderInfoBlock() {
    const fragment = document.createDocumentFragment();
    this.elements.timer = create('div', 'timer', null, fragment);
    this.elements.count = create(
      'div',
      'count',
      `Moves: ${this.properties.count}`,
      fragment,
    );
    this.gameTimer = new Timer(this.elements.timer);
    this.gameTimer.init();
    this.gameTimer.startTimer();

    if (localStorage.time) {
      const time = JSON.parse(localStorage.time);
      this.gameTimer.setTime(time);
    }
    if (localStorage.count) {
      this.properties.count = Number(localStorage.count);
    }
    return fragment;
  }

  renderControlsBlock() {
    const fragment = document.createDocumentFragment();

    this.elements.fieldSize = create(
      'select',
      'filed-size',
      `<option value="3">3x3</option>
      <option value="4" selected>4x4</option>
      <option value="5">5x5</option>
      <option value="6">6x6</option>
      <option value="7">7x7</option>
      <option value="8">8x8</option>`,
      fragment,
    );

    const buttonElement = create(
      'button',
      'btn btn-primary',
      'New game',
      fragment,
      ['type', 'button'],
    );
    buttonElement.addEventListener('click', () => {
      this.createNewGame();
    });

    const muteElement = create('button', 'btn btn-primary btn-floating', null, fragment);
    muteElement.innerHTML = this.properties.sound
      ? '<i class="fas fa-volume-up fa-lg"></i>'
      : '<i class="fas fa-volume-mute fa-lg"></i>';
    muteElement.addEventListener('click', () => {
      this.properties.sound = !this.properties.sound;
      muteElement.innerHTML = this.properties.sound
        ? '<i class="fas fa-volume-up fa-lg"></i>'
        : '<i class="fas fa-volume-mute fa-lg"></i>';
    });
    return fragment;
  }

  renderScoreBlock() {
    const fragment = document.createDocumentFragment();
    create('h3', 'top-score__title', 'Top 10 scores:', fragment);

    if (localStorage.topResults) {
      this.properties.topResults = JSON.parse(localStorage.topResults);
      this.properties.topResults.forEach((result) => {
        create(
          'div',
          'top-score__result',
          `Counts:  ${result.count}  Time  ${result.min}:${result.sec}`,
          fragment,
        );
      });
    }
    return fragment;
  }

  renderGameField() {
    const fragment = document.createDocumentFragment();
    if (localStorage.fieldSize) {
      this.properties.fieldSize = +localStorage.fieldSize;
    } else {
      this.properties.fieldSize = this.elements.fieldSize.value;
    }

    const randomNumber = Math.floor(Math.random() * 10);
    this.properties.imgNum = !localStorage.imgNum
      ? randomNumber
      : localStorage.imgNum;

    const chipLayout = !localStorage.chipLayout
      ? createArrayOfChipsField(this.properties.fieldSize)
      : JSON.parse(localStorage.chipLayout);
    const fieldWidth = this.elements.gameField.clientWidth;
    this.properties.chipSize = fieldWidth / this.properties.fieldSize;

    chipLayout.forEach((chip, i) => {
      this.createChipElement(i, chip, fragment);
    });
    return fragment;
  }

  createNewGame() {
    this.properties.count = 0;
    this.elements.count.textContent = `Moves: ${this.properties.count}`;

    this.elements.topScore.innerHTML = '';
    this.elements.topScore.appendChild(this.renderScoreBlock());

    this.elements.gameField.innerHTML = '';
    this.elements.gameField.removeAttribute('style');
    this.elements.chips = [];
    localStorage.clear();
    this.elements.gameField.appendChild(this.renderGameField());
    this.gameTimer.clearTime();
    this.gameTimer.startTimer();
  }

  moveChips(value) {
    // const chip = this.elements.chips[index];
    // debugger;
    const chip = this.elements.chips.find((item) => item.value === +value);

    const leftDiff = Math.abs(this.elements.emptyChip.left - chip.left);
    const topDiff = Math.abs(this.elements.emptyChip.top - chip.top);

    if (leftDiff + topDiff > 1) return;

    chip.element.style.left = `${
      this.elements.emptyChip.left * this.properties.chipSize
    }px`;
    chip.element.style.top = `${
      this.elements.emptyChip.top * this.properties.chipSize
    }px`;

    this.elements.emptyChip.element.style.left = `${
      chip.left * this.properties.chipSize
    }px`;
    this.elements.emptyChip.element.style.top = `${
      chip.top * this.properties.chipSize
    }px`;

    const emptyLeft = this.elements.emptyChip.left;
    const emptyTop = this.elements.emptyChip.top;
    this.elements.emptyChip.left = chip.left;
    this.elements.emptyChip.top = chip.top;
    chip.left = emptyLeft;
    chip.top = emptyTop;

    this.properties.count += 1;
    this.elements.count.textContent = `Moves: ${this.properties.count}`;

    this.saveGame();

    if (this.properties.sound) {
      soundClick();
    }
  }

  winCheck() {
    const isWin = this.elements.chips.every((chip) => {
      const a = chip.top * this.properties.fieldSize + chip.left + 1;
      return chip.value === a;
    });
    if (isWin) {
      this.gameTimer.stopTimer();
      const time = this.gameTimer.getTime();
      this.elements.gameField.innerHTML = `Ура! Вы решили головоломку за ${time.min} минут ${time.sec} секунд и ${this.properties.count} ходов.`;
      this.elements.gameField.style.backgroundImage = `url(./img/${this.properties.imgNum}.jpg)`;
      this.elements.gameField.style.backgroundSize = `${
        this.properties.chipSize * this.properties.fieldSize
      }px`;
      const res = {
        min: time.min,
        sec: time.sec,
        count: this.properties.count,
      };
      this.properties.topResults.push(res);
      this.properties.topResults.sort((a, b) => (a.count > b.count ? 1 : -1));
      this.properties.topResults = this.properties.topResults.slice(0, 10);
      localStorage.topResults = JSON.stringify(this.properties.topResults);
      this.elements.topScore.innerHTML = '';
      this.elements.topScore.appendChild(this.renderScoreBlock());
    }
  }

  saveGame() {
    const arr = this.elements.chips;
    const arrCopy = [...arr];
    const chipLayout = [];
    arrCopy.forEach((i) => {
      const chip = i;
      chip.index = chip.top * this.properties.fieldSize + chip.left;
    });
    arrCopy.sort((a, b) => (a.index > b.index ? 1 : -1));
    arrCopy.forEach((chip) => {
      chipLayout.push(chip.value);
    });
    localStorage.chipLayout = JSON.stringify(chipLayout);
    localStorage.fieldSize = this.properties.fieldSize;
    localStorage.imgNum = this.properties.imgNum;
    localStorage.count = this.properties.count;
    localStorage.time = JSON.stringify(this.gameTimer.getTime());
  }

  loadGame() {
    this.elements.chips = localStorage.getItem('arr');
  }

  createChipElement(i, chip, fragment) {
    const valueEmptyChip = this.properties.fieldSize ** 2;
    const chipElement = document.createElement('div');
    const left = i % this.properties.fieldSize;
    const top = (i - left) / this.properties.fieldSize;
    const bgLeft = (chip - 1) % this.properties.fieldSize;
    const bgTop = (chip - 1 - bgLeft) / this.properties.fieldSize;

    chipElement.style.left = `${left * this.properties.chipSize}px`;
    chipElement.style.top = `${top * this.properties.chipSize}px`;
    chipElement.style.width = `${this.properties.chipSize}px`;
    chipElement.style.height = `${this.properties.chipSize}px`;

    this.elements.chips.push({
      top,
      left,
      element: chipElement,
      value: chip,
    });

    switch (chip) {
      case valueEmptyChip:
        chipElement.classList.add('puzzle__chip-empty');
        this.elements.emptyChip = this.elements.chips[i];
        break;

      default:
        chipElement.classList.add('puzzle__chip');
        chipElement.style.backgroundImage = `url(./img/${this.properties.imgNum}.jpg)`;
        chipElement.style.backgroundSize = `${
          this.properties.chipSize * this.properties.fieldSize
        }px`;
        chipElement.style.backgroundPosition = `left ${
          -bgLeft * this.properties.chipSize
        }px top ${-bgTop * this.properties.chipSize}px`;
        chipElement.setAttribute('draggable', true);
        chipElement.textContent = chip;
        break;
    }
    fragment.appendChild(chipElement);
  }

  createEventListeners() {
    this.elements.gameField.addEventListener('click', (e) => {
      const { target } = e;
      if (target.classList.contains('puzzle__chip')) {
        this.moveChips(target.textContent);
        this.winCheck();
      }
    });
    this.elements.gameField.addEventListener('dragstart', (e) => {
      const { target } = e;
      if (target.classList.contains('puzzle__chip')) {
        e.dataTransfer.setData('value', target.textContent);
        setTimeout(() => {
          target.classList.add('hide');
        }, 0);
      }
    });
    this.elements.gameField.addEventListener('dragend', (e) => {
      const { target } = e;
      if (target.classList.contains('puzzle__chip')) {
        target.classList.remove('hide');
      }
    });
    this.elements.gameField.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    this.elements.gameField.addEventListener('dragenter', (e) => {
      e.preventDefault();
    });
    this.elements.gameField.addEventListener('drop', (e) => {
      e.preventDefault();
      const { target } = e;
      if (target.classList.contains('puzzle__chip-empty')) {
        const value = e.dataTransfer.getData('value');
        this.moveChips(value);
        this.winCheck();
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const puzzle = new Puzzle();
  puzzle.init();
});
