class Ship {
  constructor(length) {
    this.length = length;
    this.timesHit = 0;
  }
  isSunk() {
    return this.timesHit === this.length;
  }
  hit() {
    this.timesHit += 1;
  }
}

// module.exports = Ship;

export { Ship };