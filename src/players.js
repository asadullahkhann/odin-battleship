const createGameboard = require('./gameboard');

function createPlayer(type) {
  const gameboard = createGameboard();
  if (type === 'computer') {
    const shipLengths = [5,4,3,3,2];
    for (let i = 0; i < 5; i++) {
      const x = Math.floor(Math.random() * 10);
      const y = i;
      gameboard.placeShip(x,y,shipLengths[i]);
    }
    return {
      gameboard
    };
  }
  return {
    gameboard
  };
};

module.exports = createPlayer;