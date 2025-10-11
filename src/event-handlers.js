import { createPlayer } from './players';
import {
  placeAttackOnUi,
  placeShipOnUi,
  showWinningMessage
} from './dom-manipulator';

let players = {};

const getUiBoards = () => document.querySelectorAll('main > div');
const getCells = () => Array.from(document.querySelectorAll('.cell'));
const getRandomCoordinates = () => {
  const emptyCells = getCells().slice(0,100).filter(cell => !cell.firstChild)
  const randomIndex = Math.floor(Math.random() * emptyCells.length)
  const randomEmptyCell = emptyCells[randomIndex];
  const coordinates = randomEmptyCell.getAttribute('data-coordinates');
  return coordinates;
}

const handleShipPlacment = (e) => {
  const [uiBoard1, uiBoard2] = getUiBoards();
  const cells = getCells();
  const [x, y] = e.target.getAttribute('data-coordinates');
  const targetParent = e.target.parentNode;
  const {player1, player2} = players;
  if (targetParent === uiBoard1 && !player1.gameboard.allShipsPlaced()) {
    player1.gameboard.placeShip(+x, +y);
    placeShipOnUi(player1.gameboard.board, uiBoard1);
  } else if (targetParent === uiBoard2 && !player2.gameboard.allShipsPlaced()) {
      player2.gameboard.placeShip(+x, +y);
      placeShipOnUi(player2.gameboard.board, uiBoard2);
    }
  if (player1.gameboard.allShipsPlaced()) {
    cells.slice(0, 100).forEach(cell => {
      setTimeout(() => {
        cell.classList = 'cell';
      }, 1000);
    })
  }
  if (player2.gameboard.allShipsPlaced()) {
    cells.slice(100).forEach(cell => {
      setTimeout(() => {
        cell.classList = 'cell';
      }, 1000);
    })
  }
  if (player1.gameboard.allShipsPlaced() && player2.gameboard.allShipsPlaced()) {
    cells.forEach(cell => {
      cell.removeEventListener('click', handleShipPlacment);
      setTimeout(() => {
        cell.addEventListener('click', handleShipAttack);
        if (player2.isCom && cell.parentNode === uiBoard1) {
          cell.removeEventListener('click', handleShipAttack);
        }
      }, 1000);
    });
  }
}

const handleShipAttack = (e) => {
  const [uiBoard1, uiBoard2] = getUiBoards();
  const [x, y] = e.target.getAttribute('data-coordinates');
  const targetParent = e.target.parentNode;
  const {player1, player2} = players;
  const opponent = player2.isCom ? 'Computer' : 'Player 2';
  if (targetParent === uiBoard1) {
    player1.gameboard.receiveAttack(+x, +y);
    placeAttackOnUi(+x, +y, player1.gameboard.board, uiBoard1);
    e.target.removeEventListener('click', handleShipAttack);
  } else if (targetParent === uiBoard2) {
      player2.gameboard.receiveAttack(+x, +y);
      placeAttackOnUi(+x, +y, player2.gameboard.board, uiBoard2);
      e.target.removeEventListener('click', handleShipAttack);
  };
  if (player2.isCom) {
    const [x, y] = getRandomCoordinates();
    player1.gameboard.receiveAttack(+x, +y);
    placeAttackOnUi(+x, +y, player1.gameboard.board, uiBoard1);
  };
  if (player1.gameboard.allShipsSunk()) {
    showWinningMessage(`${opponent} wins — all Player 1 ships sunk`);
  } else if (player2.gameboard.allShipsSunk()) {
      showWinningMessage(`Player 1 wins — all ${opponent} ships sunk`);
  };
};

const handlePlayBtnClick = () => { 
  const radioBtns = Array.from(document.querySelectorAll('input'));
  const opponent = radioBtns.filter(radioBtn => radioBtn.checked)[0].value;
  players.player1 = createPlayer('human');
  players.player2 = createPlayer(opponent);
  if (opponent === 'computer') {
    const gameboard2Cells = getCells().slice(100);
    gameboard2Cells.forEach(cell => {
      cell.removeEventListener('click', handleShipPlacment)
    })
  }
};

const handlePlayAgain = () => {
  players.player1 = createPlayer('human');
    players.player2 = players.player2.isCom
      ? createPlayer('computer')
      : createPlayer('human');
  const cells = getCells();
  cells.forEach(cell => {
    cell.removeEventListener('click', handleShipAttack);
    cell.addEventListener('click', handleShipPlacment);
    if (cell.firstChild) cell.removeChild(cell.firstChild);
  })
};

export { 
  handlePlayBtnClick, 
  handleShipPlacment, 
  handlePlayAgain,
};