import { 
  handleShipPlacment, 
  handlePlayBtnClick,
  handlePlayAgain,
} from "./event-handlers";
import fireImg1 from './images/fire1.gif';
import fireImg2 from './images/fire2.gif';
import dotImg from './images/dot-small.svg';
import explosionMp3 from './sounds/explosion.mp3';
import victoryMp3 from './sounds/victory.mp3';

const explosionSound = new Audio(explosionMp3);
const victorySound = new Audio(victoryMp3);

const mainEl = document.querySelector('main');
const dialog = document.querySelector('dialog');
const playBtn = document.querySelector('button');
const playAgainBtn = document.querySelector('div > button');

const renderGameboard = () => {
  const container = document.createElement('div');
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement('div');
      cell.setAttribute('class', 'cell');
      cell.setAttribute('data-coordinates', `${j}${i}`);
      cell.addEventListener('click', handleShipPlacment)
      container.appendChild(cell);
    };
  };
  mainEl.appendChild(container);
  const clone = container.cloneNode(true);
  clone.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleShipPlacment);
  });
  mainEl.appendChild(clone);
};

const showDialog = () => {
  dialog.showModal();
};

const placeShipOnUi = (gameboard, parentNode) => {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = parentNode.querySelectorAll(`.cell`)[+`${i}${j}`];
      if (!gameboard[i][j] || cell.firstChild) continue
      if (!gameboard[i][j-1]) cell.classList.add('border-left');
      if (!gameboard[i][j+1]) cell.classList.add('border-right');
      cell.classList.add('border-y');
    }
  }
};

const placeAttackOnUi = (x, y, gameboard, parentNode) => {
  const img = document.createElement('img');
  const cell = parentNode.querySelectorAll('.cell')[+`${y}${x}`];
  switch (gameboard[y][x]) {
    case 0:
      img.src = dotImg;
      cell.appendChild(img);
      break;
    default:
      explosionSound.play();
      img.src = fireImg1;
      cell.appendChild(img);
      setTimeout(() => {
        img.src = fireImg2;
      }, 1000);
  }
};

const showWinningMessage = (msg) => {
  setTimeout(() => {
    victorySound.play();
    dialog.querySelector('form').classList.add('hide');
    dialog.querySelector('div').classList.remove('hide');
    dialog.querySelector('div > p').textContent = msg;
    dialog.showModal();
  }, 1000);
}

playBtn.addEventListener('click', handlePlayBtnClick);

playAgainBtn.addEventListener('click', () => {
  handlePlayAgain();
  dialog.close();
});

export { 
  renderGameboard, 
  showDialog, 
  placeShipOnUi, 
  placeAttackOnUi,
  showWinningMessage,
};