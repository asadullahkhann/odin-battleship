// const Ship = require('./ship');

import { Ship } from "./ship";

function createGameboard() {
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
  const getShips = (row) => board[row].filter(item => item !== null && typeof item === 'object');
  function allShipsSunk() {
    for (let i = 0; i < 10; i++) {
      const ships = getShips(i);
      if (!ships.every(ship => ship.isSunk())) return false;
    }
    return true;
  }
  function allShipsPlaced() {
    let total = 0;
    for (let i = 0; i < 10; i++) {
      const ships = getShips(i);
      total += ships.length;
    }
    return total === 17;
  }
  return {
    placeShip,
    receiveAttack,
    allShipsSunk,
    allShipsPlaced,
    board,
  };
}

// module.exports = createGameboard;

export { createGameboard };