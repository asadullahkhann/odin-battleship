import { createPlayer } from './players';
import battleshipImg from './images/battleship2.svg';
import fireImg1 from './images/fire1.gif';
import fireImg2 from './images/fire2.gif';

const radioBtns = Array.from(document.querySelectorAll('input'));
const dialog = document.querySelector('dialog');
const closeDialogBtn = document.querySelector('div > button');

let players = {};

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
    case null:
      break;
    case 0:
      cell.style.opacity = 0.5;
      break
    default:
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

const getUiGameboards = () => document.querySelectorAll('main > div');

function handleShipPlacment(e) {
  const uiGameboards = getUiGameboards();
  const coordinates = e.target.getAttribute('data-coordinates');
  const x = +coordinates[0];
  const y = +coordinates[1];
  if (e.target.parentNode === uiGameboards[0] &&
    !players.player1.gameboard.allShipsPlaced()
  ) {
    players.player1.gameboard.placeShip(x,y);
    placeShipOnUi(players.player1.gameboard.board, uiGameboards[0]);
    if (e.target.firstChild) e.target.removeEventListener('click', handleShipPlacment);
  } else if (e.target.parentNode === uiGameboards[1] && 
    !players.player2.gameboard.allShipsPlaced()
    ) {
    players.player2.gameboard.placeShip(x,y);
    placeShipOnUi(players.player2.gameboard.board, uiGameboards[1]);
    if (e.target.firstChild) e.target.removeEventListener('click', handleShipPlacment);
    }
  if (players.player1.gameboard.allShipsPlaced() &&
    players.player2.gameboard.allShipsPlaced()
  ) {
    document.querySelectorAll('.cell').forEach(cell => {
      cell.removeEventListener('click', handleShipPlacment);
      cell.addEventListener('click', handleShipAttack);
      if (cell.firstChild) cell.removeChild(cell.firstChild);
    })
  }
}

function handleShipAttack(e) {
  const uiGameboards = getUiGameboards();
  const coordinates = e.target.getAttribute('data-coordinates');
  const x = +coordinates[0];
  const y = +coordinates[1];
  switch (e.target.parentNode) {
    case uiGameboards[0]:
      players.player1.gameboard.receiveAttack(x,y);
      placeAttackOnUi(x, y, players.player1.gameboard.board, e.target.parentNode);
      e.target.removeEventListener('click', handleShipAttack);
      break;
    case uiGameboards[1]: 
      players.player2.gameboard.receiveAttack(x,y);
      placeAttackOnUi(x, y, players.player2.gameboard.board, e.target.parentNode);
      e.target.removeEventListener('click', handleShipAttack);
      break;
  };
  if (players.player1.gameboard.allShipsSunk()) {
    showWinningMessage('All ships sunk of Player 1 therefore Player 2 won');
  } else if (players.player2.gameboard.allShipsSunk()) {
    showWinningMessage('All ships sunk of Player 2 therefore Player 1 won');
  }

}

function handleOkBtnClick() { 
  const uiGameboards = getUiGameboards();
  const opponent = radioBtns.filter(radioBtn => radioBtn.checked)[0].value;
  players.player1 = createPlayer('human');
  players.player2 = createPlayer(opponent);
  if (opponent === 'computer') {
    players.player2.isCom = true;
    const gameboard2Cells = uiGameboards[1].querySelectorAll('.cell');
    gameboard2Cells.forEach(cell => {
      cell.removeEventListener('click', handleShipPlacment)
    })
  }
};

closeDialogBtn.addEventListener('click', () => {
  dialog.close();
});

export { handleOkBtnClick, handleShipPlacment };