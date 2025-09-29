import { handleShipPlacment, handleOkBtnClick } from "./event-handlers";
import battleshipImg from './images/battleship2.svg';
import fireImg1 from './images/fire1.gif';
import fireImg2 from './images/fire2.gif';
import explosionSound from './sounds/explosion.mp3';

const explosionAudio = new Audio(explosionSound);

const mainEl = document.querySelector('main');
const dialog = document.querySelector('dialog');
const okBtn = document.querySelector('button');

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

function showDialog() {
  dialog.showModal();
};

const placeShipOnUi = (gameboard, parentNode) => {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = parentNode.querySelectorAll(`.cell`)[+`${i}${j}`];
      if (!gameboard[i][j] || cell.firstChild) continue;
      const img = document.createElement('img');
      img.src = battleshipImg;
      cell.appendChild(img);
    }
  }
};

const placeAttackOnUi = (x, y, gameboard, parentNode) => {
  const img = document.createElement('img');
  const cell = parentNode.querySelectorAll('.cell')[+`${y}${x}`];
  switch (gameboard[y][x]) {
    case 0:
      cell.style.opacity = 0.5;
      break;
    default:
      explosionAudio.play();
      img.src = fireImg1;
      cell.appendChild(img);
      setTimeout(() => {
        img.src = fireImg2;
      }, 1000);
  }
};

const showWinningMessage = (msg) => {
  dialog.querySelector('form').classList.add('hide');
  dialog.querySelector('div').classList.remove('hide');
  dialog.querySelector('div > p').textContent = msg;
  dialog.showModal();
}

okBtn.addEventListener('click', handleOkBtnClick);

export { 
  renderGameboard, 
  showDialog, 
  placeShipOnUi, 
  placeAttackOnUi,
  showWinningMessage,

};