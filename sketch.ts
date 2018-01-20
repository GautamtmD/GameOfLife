let world: GOL;
const num = (st: number, en: number) => {
  let ar = [];
  while (st < en) ar.push(st++);
  return ar;
}

function setup() {
  createCanvas(600, 600);
  // world = new GOL(64, 36);
  world = new GOLWrapAround(60, 60);
  background(255);
  // frameRate(15);
}
let PAUSE = true;
function draw() {
  if (!PAUSE){
    world.step();
  }
  world.display();
}

function keyPressed() {
  if (keyCode === 32) {
    PAUSE = !PAUSE;
  }
}

function mouseClicked() {
  world.click(mouseX, mouseY);
  return false;
}

class Grid {
  h: number;
  w: number;
  constructor(width: number, height: number) {
    this.w = width;
    this.h = height;
  }
  display() {
    let wSteps = width / this.w;
    let hSteps = height / this.h;
    rect(0, 0, width - 1, height - 1);
    num(1, this.h).forEach(e => {
      line(0, e * hSteps, width, e * hSteps);
    });
    num(1, this.w).forEach(e => {
      line(e * wSteps, 0, e * wSteps, height);
    });
  }
}
class GOL extends Grid {
  cells: boolean[][];
  cellW: number;
  cellH: number;
  constructor(w: number, h: number) {
    super(w, h);
    this.cellW = width / w;
    this.cellH = height / h;
    this.cells = num(0, w).map(e => num(0, h).map(isAlive => random() > 0.5));
  }
  flipCell(x: number, y: number) {
    if (this.isInBounds(x, y)) {
      this.cells[x][y] = !this.cells[x][y];
    }
  }
  click(mouseX: number, mouseY: number) {
    this.flipCell(Math.floor(mouseX / this.cellW), Math.floor(mouseY / this.cellH));
  }
  isCellAlive(x: number, y: number) {
    return this.isInBounds(x, y) ? (this.cells[x][y] ? 1 : 0) : 0;
  }
  isInBounds(x: number, y: number) {
    return x > -1 && x < this.cells.length && y > -1 && y < this.cells[0].length;
  }
  aliveNeighborCount(x: number, y: number) {
    return this.isCellAlive(x - 1, y - 1) + this.isCellAlive(x, y - 1) + this.isCellAlive(x + 1, y - 1) +
      this.isCellAlive(x - 1, y) + this.isCellAlive(x + 1, y) +
      this.isCellAlive(x - 1, y + 1) + this.isCellAlive(x, y + 1) + this.isCellAlive(x + 1, y + 1);
  }
  step() {
    let nextState: boolean[][] = this.cells.map((row, w) => row.map((isAlive, h) => {
      let numberOfNeighbors = this.aliveNeighborCount(w, h);
      if (numberOfNeighbors < 2) {
        isAlive = false;
      } else if (numberOfNeighbors === 3) {
        isAlive = true;
      } else if (numberOfNeighbors > 3) {
        isAlive = false;
      }
      return isAlive;
    }));
    this.cells = nextState;
  }
  display() {
    super.display();
    fill(100);
    this.cells.forEach((row, w) => row.forEach((isAlive, h) => {
      if (isAlive) {
        rect(w * this.cellW, h * this.cellH, this.cellW, this.cellH);
      }
    }));
    fill(255);
  }
}

class GOLWrapAround extends GOL {
  w: number;
  h: number;
  constructor(w: number, h: number) {
    super(w, h);
    this.w = w;
    this.h = h;
  }
  isCellAlive(x: number, y: number) {
    if (x < 0) {
      x = this.w - 1;
    } else if (x >= this.w) {
      x = 0;
    }
    if (y < 0) {
      y = this.h - 1;
    } else if (y >= this.h) {
      y = 0;
    }
    return super.isCellAlive(x, y);
  }
}