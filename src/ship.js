function createShip(length) {
  let len = length;
  let timesHit = 0
  const isSunk = () => timesHit === len;
  const hit = () => {
    timesHit += 1; 
  }
  return {
    isSunk,
    hit,
  }
};

export { createShip };