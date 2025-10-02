import { createPlayer } from './players';
import {
  placeAttackOnUi,
  placeShipOnUi,
  showWinningMessage
} from './dom-manipulator';

let players = {};

const getUiGameboards = () => document.querySelectorAll('main > div');
const getCells = () => Array.from(document.querySelectorAll('.cell'));
const getRandomCoordinates = () => {
  const emptyCells = getCells().slice(0,100).filter(cell => {
    return !cell.firstChild && cell.style.opacity !== '0.5';
  });
  const randomIndex = Math.floor(Math.random() * emptyCells.length)
  const randomEmptyCell = emptyCells[randomIndex];
  const coordinates = randomEmptyCell.getAttribute('data-coordinates');
  return coordinates;
}

const handleShipPlacment = (e) => {
  const uiGameboards = getUiGameboards();
  const coordinates = e.target.getAttribute('data-coordinates');
  const x = +coordinates[0];
  const y = +coordinates[1];
  if (e.target.parentNode === uiGameboards[0] &&
    !players.player1.gameboard.allShipsPlaced()
  ) {
    players.player1.gameboard.placeShip(x,y);
    placeShipOnUi(players.player1.gameboard.board, uiGameboards[0]);
    e.target.removeEventListener('click', handleShipPlacment);
  } else if (e.target.parentNode === uiGameboards[1] && 
    !players.player2.gameboard.allShipsPlaced()
    ) {
      players.player2.gameboard.placeShip(x,y);
      placeShipOnUi(players.player2.gameboard.board, uiGameboards[1]);
      e.target.removeEventListener('click', handleShipPlacment);
    }
  if (players.player1.gameboard.allShipsPlaced() &&
    players.player2.gameboard.allShipsPlaced()
  ) {
    const cells = getCells();
    cells.forEach(cell => {
      cell.removeEventListener('click', handleShipPlacment);
      cell.addEventListener('click', handleShipAttack);
      if (cell.firstChild) cell.removeChild(cell.firstChild);
    });
    if (players.player2.isCom) {
      cells.slice(0,100).forEach(cell => {
        cell.removeEventListener('click', handleShipAttack);
      });
    }
  }
}

const handleShipAttack = (e) => {
  const uiGameboards = getUiGameboards();
  const coordinates = e.target.getAttribute('data-coordinates');
  const x = +coordinates[0];
  const y = +coordinates[1];
  switch (e.target.parentNode) {
    case uiGameboards[0]:
      players.player1.gameboard.receiveAttack(x,y);
      placeAttackOnUi(x, y, players.player1.gameboard.board, uiGameboards[0]);
      e.target.removeEventListener('click', handleShipAttack);
      break;
    case uiGameboards[1]: 
      players.player2.gameboard.receiveAttack(x,y);
      placeAttackOnUi(x, y, players.player2.gameboard.board, uiGameboards[1]);
      if (players.player2.isCom) {
        const coordinates = getRandomCoordinates();
        const x = +coordinates[0];
        const y = +coordinates[1];
        players.player1.gameboard.receiveAttack(x,y);
        placeAttackOnUi(x, y, players.player1.gameboard.board, uiGameboards[0]);
      };
      e.target.removeEventListener('click', handleShipAttack);
      break;
  };
  const opponent = players.player2.isCom ? 'Computer' : 'Player 2';
  if (players.player1.gameboard.allShipsSunk()) {
    showWinningMessage(`All the Player 1's ships are sunk. ${opponent} wins!`);
  } else if (players.player2.gameboard.allShipsSunk()) {
    showWinningMessage(`All the ${opponent}'s ships are sunk. Player 1 wins!`);
  }
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
    cell.style.opacity = 1;
    if (cell.firstChild) cell.removeChild(cell.firstChild);
  })
};

export { 
  handlePlayBtnClick, 
  handleShipPlacment, 
  handlePlayAgain,
};