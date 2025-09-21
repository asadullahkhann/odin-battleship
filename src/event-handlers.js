import { createPlayer } from './players';

const radioBtns = Array.from(document.querySelectorAll('input'));

const shipLengths = [[5,4,3,3,2], [5,4,3,3,2]];

let players = {};

const placeShipOnUi = (gameboard, parentNode) => {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (gameboard[i][j]) {
        parentNode.querySelectorAll(`.cell`)[+`${i}${j}`].textContent = '✅';
      }
    }
  }
};

const getUiGameboards = () => document.querySelectorAll('main > div');

function handleShipPlacment(e) {
  const uiGameboards = getUiGameboards();
  const coordinates = e.target.getAttribute('data-coordinates');
  const x = +coordinates[0];
  const y = +coordinates[1];
  if (e.target.parentNode === uiGameboards[0] &&
    !players.player1.gameboard.allShipsPlaced()
  ) {
    const shipLength = shipLengths[0].shift();
    players.player1.gameboard.placeShip(x,y,shipLength);
    placeShipOnUi(players.player1.gameboard.board, uiGameboards[0]);
    return;
  } else if (e.target.parentNode === uiGameboards[1] && 
    !players.player2.gameboard.allShipsPlaced()) {
    const shipLength = shipLengths[1].shift();
    players.player2.gameboard.placeShip(x,y,shipLength);
    placeShipOnUi(players.player2.gameboard.board, uiGameboards[1]);
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
      cell.onclick = null;
    })
  }
}

export { handleOkBtnClick, handleShipPlacment };