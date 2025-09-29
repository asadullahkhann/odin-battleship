function createShip(length) {
    let len = length;
    let timesHit = 0
  const isSunk = () => {
    return timesHit === len;
  }
  const hit = () => {
    timesHit += 1; 
  }
  return {
    isSunk,
    hit,
  }
}

// module.exports = Ship;

export { createShip };