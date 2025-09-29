// const Ship = require('./ship');

import { Ship } from "./ship";

function createGameboard() {
  const board = new Array(10).fill(null).map(() => new Array(10).fill(null));
  const shipLengths = [5,4,3,3,2];
  const canPlaceOnLeft = (x,y,len) => {
    const arr = board[y].slice(x+1-len, x+1);
    return arr.length >= len && arr.every(item => item === null);
  } 
  const canPlaceOnRight = (x,y,len) => {
    const arr = board[y].slice(x, x+len);
    return arr.length >= len && arr.every(item => item === null);
  } 

  function placeShip(x, y) {
    const len = shipLengths.shift();
    const ship = new Ship(len);
    if (canPlaceOnLeft(x,y,len)) {
      for (let i = 0; i < len; i++) {
        board[y][x-i] = ship;
    }
      return;
    } else if (canPlaceOnRight(x,y,len)) {
        for (let i = 0; i < len; i++) {
          board[y][x+i] = ship;
        }
        return;
    }
    shipLengths.unshift(len);
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