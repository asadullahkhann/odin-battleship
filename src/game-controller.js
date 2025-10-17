import dotImg from './images/dot-small.svg';
import fireImg from './images/fire.svg';
import victoryMp3 from './sounds/victory.mp3';
import failMp3 from './sounds/fail.mp3';
import { createPlayers } from './players';

const mainEl = document.querySelector('main');
const selectBtn = document.querySelector('.toggle-dropdown > button');
const playBtns = document.querySelectorAll('.dropdown-menu > button');
const dropdownMenu = document.querySelector('.dropdown-menu');
const infoPara = document.querySelector('header > p');

let players = createPlayers('computer');

const getUiBoards = () => document.querySelectorAll('main > div');
const getCells = () => Array.from(document.querySelectorAll('.cell'));
const getRandomCoordinates = () => {
  const emptyCells = getCells().slice(0,100).filter(cell => !cell.firstChild);
  const randomIndex = Math.floor(Math.random() * emptyCells.length)
  const randomEmptyCell = emptyCells[randomIndex];
  const coordinates = randomEmptyCell.getAttribute('data-coordinates');
  return coordinates;
};

const getAdjacentCoordinates = () => {
  const board = players.player1.gameboard.board;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (board[i][j] !== 1) continue;
      if (typeof board[i][j-1] === 'object' ) {
        return `${j-1}${i}`;
      } else if (typeof board[i][j+1] === 'object' ) {
        return `${j+1}${i}`;
      }
    }
  }
};

const setupUIBoardForAttack = () => {
  const cells = getCells();
  cells.forEach(cell => {
    cell.classList = 'cell';
    cell.onclick = handleShipAttack
  });
};

const sounds = {
  victorySound: new Audio(victoryMp3),
  failSound: new Audio(failMp3)
};

const handleShipPlacment = (e) => {
  const [uiBoard1, uiBoard2] = getUiBoards();
  const cells = getCells();
  const [x, y] = e.target.getAttribute('data-coordinates');
  const targetParent = e.target.parentNode;
  const {player1, player2} = players;
  player2.isCom && showInfo("Computer's ready. Place your ships on Grid #1.");
  if (targetParent === uiBoard1 && !player1.gameboard.allShipsPlaced()) {
    player1.gameboard.placeShip(+x, +y);
    placeShipOnUi(player1.gameboard.board, uiBoard1);
  } else if (targetParent === uiBoard2 && !player2.gameboard.allShipsPlaced()) {
    player2.gameboard.placeShip(+x, +y);
    placeShipOnUi(player2.gameboard.board, uiBoard2);
  };
  if (players.allShipsPlaced()) {
    setTimeout(() => {
      setupUIBoardForAttack();
      player2.isCom
      ? showInfo('The game started, your turn')
      : showInfo('The game started! Your turn, Player 1!');
    }, 1000);
  } else if (player1.gameboard.allShipsPlaced()) {
    setTimeout(() => {
      cells.slice(0, 100).forEach(cell => {
        cell.classList = 'cell';
        showInfo('Waiting for Player 2 to finish placing ships.');
      });
      }, 1000);
  } else if (!player2.isCom && player2.gameboard.allShipsPlaced()) {
    setTimeout(() => {
      cells.slice(100).forEach(cell => {
        cell.classList = 'cell';
        showInfo('Waiting for Player 1 to finish placing ships.');
      });
    }, 1000);
  }
}
const handleShipAttack = (e) => {
  if (players.hasAnyPlayerLost()) return;
  const {player1, player2} = players;
  const [uiBoard1, uiBoard2] = getUiBoards();
  const [x, y] = e.target.getAttribute('data-coordinates');
  const targetParent = e.target.parentNode;
  if (players.turn === 1 && targetParent === uiBoard2) {
    player2.gameboard.receiveAttack(+x, +y);
    placeAttackOnUi(+x, +y, player2.gameboard.board, uiBoard2);
    showInfo("Player 2, you're up!");
    players.turn = 2;
    e.target.onclick = null;
  }
  if (player2.gameboard.allShipsSunk()) {
    sounds.victorySound.play();
    player2.isCom
    ? showInfo('Computer fleet destroyed. You win.')
    : showInfo('Player 2 fleet destroyed. Player 1 wins.');
    return;
  };
  if (player2.isCom && targetParent === uiBoard2) {
    const [x, y] = getAdjacentCoordinates() || getRandomCoordinates();
    player1.gameboard.receiveAttack(+x, +y);
    placeAttackOnUi(+x, +y, player1.gameboard.board, uiBoard1);
    showInfo("The computer made its move. Now it's your turn.");
    players.turn = 1;
  } else if (players.turn === 2 && targetParent === uiBoard1) {
    player1.gameboard.receiveAttack(+x, +y);
    placeAttackOnUi(+x, +y, player1.gameboard.board, uiBoard1);
    showInfo('Your turn, Player 1!');
    players.turn = 1;
    e.target.onclick = null;
  };
  if (player1.gameboard.allShipsSunk() && player2.isCom) {
    sounds.failSound.play();
    showInfo('Your fleet is destroyed. You lose.');
  } else if (player1.gameboard.allShipsSunk()) {
    sounds.victorySound.play();
    showInfo('Player 1 fleet destroyed. Player 2 wins.');
  };
};

const handlePlayBtnClick = (e) => {
  const opponent = e.target.textContent;
  players = createPlayers(opponent);
  const cells = getCells();
  cells.forEach(cell => {
    cell.firstChild && cell.removeChild(cell.firstChild);
    cell.classList = 'cell';
    cell.onclick = handleShipPlacment;
  });
  showInfo('Place the ships.');
};

const renderGameboard = () => {
  const container = document.createElement('div');
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement('div');
      cell.setAttribute('class', 'cell');
      cell.setAttribute('data-coordinates', `${j}${i}`);
      container.appendChild(cell);
    };
  };
  mainEl.appendChild(container);
  const clone = container.cloneNode(true);
  mainEl.appendChild(clone);
  showInfo('Select an opponent to start the game.');
};

const placeShipOnUi = (gameboard, parentNode) => {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = parentNode.querySelectorAll(`.cell`)[+`${i}${j}`];
      if (!gameboard[i][j] || cell.firstChild) continue
      if (!gameboard[i][j-1]) cell.classList.add('border-left');
      if (!gameboard[i][j+1]) cell.classList.add('border-right');
      cell.classList.add('border-y');
    };
  };
};

const placeAttackOnUi = (x, y, gameboard, parentNode) => {
  const img = document.createElement('img');
  const cell = parentNode.querySelectorAll('.cell')[+`${y}${x}`];
  img.src = gameboard[y][x] ? fireImg : dotImg;
  cell.appendChild(img);
};

const showInfo = (info) => {
  infoPara.textContent = info;
};

selectBtn.addEventListener('click', () => {
  dropdownMenu.classList.toggle('hide');
});

playBtns.forEach(playBtn => {
  playBtn.addEventListener('click', (e) => {
    handlePlayBtnClick(e)
    dropdownMenu.classList.add('hide');
  });
});

export { 
  renderGameboard, 
};