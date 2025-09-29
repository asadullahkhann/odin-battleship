// const createGameboard = require('./gameboard');
import { createGameboard } from "./gameboard";

function createPlayer(type) {
  const gameboard = createGameboard();
  if (type === 'computer') {
    const shipLengths = [5,4,3,3,2];
    for (let i = 0; i < 5; i++) {
      const x = Math.floor(Math.random() * 10);
      const emptyRows = gameboard.board.filter(row => row.every(item => item === null));
      const indexesOfEmptyRows = []; 
      emptyRows.forEach(emptyRow => {
        indexesOfEmptyRows.push(gameboard.board.indexOf(emptyRow));
      });
      const randomIndexOfEmptyRow = Math.floor(Math.random() * indexesOfEmptyRows.length);
      const y = indexesOfEmptyRows[randomIndexOfEmptyRow];
      gameboard.placeShip(x,y,shipLengths[i]);
    }
    let isCom = true;
    return {
      gameboard,
      isCom
    };
  }
  return {
    gameboard
  };
};

// module.exports = createPlayer;

export { createPlayer };