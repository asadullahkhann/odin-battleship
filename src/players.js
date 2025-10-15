import { createGameboard } from "./gameboard";

function createPlayers(Player2Type) {
  const player1 = {};
  const player2 = {};
  player1.gameboard = createGameboard();
  player2.gameboard = createGameboard();
  const gameboard1 = player1.gameboard;
  const gameboard2 = player2.gameboard;
  if (Player2Type === 'computer') {
    for (let i = 0; i < 5; i++) {
      const gameboard = player2.gameboard;
      const x = Math.floor(Math.random() * 10);
      const emptyRows = gameboard.board.filter(row => row.every(item => item === null));
      const indexesOfEmptyRows = []; 
      emptyRows.forEach(emptyRow => {
        indexesOfEmptyRows.push(gameboard.board.indexOf(emptyRow));
      });
      const randomIndexOfEmptyRow = Math.floor(Math.random() * indexesOfEmptyRows.length);
      const y = indexesOfEmptyRows[randomIndexOfEmptyRow];
      gameboard.placeShip(x,y);
    }
    player2.isCom = true;
  }
  const allShipsPlaced = () => {
    return gameboard1.allShipsPlaced() && gameboard2.allShipsPlaced();
  }
  const hasAnyPlayerLost = () => {
    return gameboard1.allShipsSunk() || gameboard2.allShipsSunk();
  };
  return {
    player1,
    player2,
    turn: 1,
    allShipsPlaced,
    hasAnyPlayerLost,
  };
};

export { createPlayers };