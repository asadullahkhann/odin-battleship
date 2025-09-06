const Ship = require('./ship');

function Gameboard() {
  const board = new Array(10).fill(null).map(() => new Array(10).fill(null));
  const canPlace = (x,y,len) => {
    if (x > 5) {
      return board[y].slice(x+1-len, x+1).every(item => item === null);  
    }
    return board[y].slice(x, x+len).every(item => item === null);
  };
  function placeShip(x, y, len) {
    if (!canPlace(x, y, len)) return;

    const ship = new Ship(len);
    for (let i = 0; i < len; i++) {
      let X = x > 5 ? x - i : x + i;
      board[y][X] = ship;
    }
  }
  function receiveAttack(x, y) {
    if (board[y][x] === null) board[y][x] = 0;
    else board[y][x].hit(); 
  }
  function allShipsSunk() {
    for (let i = 0; i < 10; i++) {
      const ships = board[i].filter(item => item !== null && typeof item === 'object');
      if (!ships.every(ship => ship.isSunk())) return false;
    }
    return true;
  }
  return {
    placeShip,
    receiveAttack,
    allShipsSunk,
    board,
  };
}

module.exports = Gameboard;