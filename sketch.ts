let world: GameOfLife;
const num = (from: number, to: number) => {
  let ar = [];
  while (from < to) ar.push(from++);
  return ar;
}

function setup() {
  createCanvas(800, 500);
  // world = new GOL(64, 36);
  world = new GameWithWrapAround(80, 50);
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
  }else if(keyCode === 17){
    world.step();
  }
}

function mouseClicked() {
  world.click(mouseX, mouseY);
  return false;
}
function mouseDragged() {
  world.clickDrag(mouseX, mouseY);
  return false;
}

class Grid {
  rows: number;
  columns: number;
  constructor(columns: number, rows: number) {
    this.columns = columns;
    this.rows = rows;
  }
  columnSize(){
    return width / this.columns;
  }
  rowSize(){
    return height / this.rows;
  }
  display() {
    let columnSize = this.columnSize();
    let rowSize = this.rowSize();
    rect(0, 0, width - 1, height - 1);
    num(1, this.rows).forEach(row => {
      line(0, row * rowSize, width, row * rowSize);
    });
    num(1, this.columns).forEach(column => {
      line(column * columnSize, 0, column * columnSize, height);
    });
  }
}
class GameOfLife extends Grid {
  cells: boolean[][];
  cellWidth: number;
  cellHeight: number;
  constructor(columns: number, rows: number) {
    super(columns, rows);
    this.cellWidth = super.columnSize();
    this.cellHeight = super.rowSize();
    this.cells = num(0, columns).map(e => num(0, rows).map(isAlive => random() > 0.5));
  }
  flipCell(x: number, y: number) {
    if (this.isInBounds(x, y)) {
      this.cells[x][y] = !this.cells[x][y];
    }
  }
  click(mouseX: number, mouseY: number) {
    let cellX = Math.floor(mouseX / this.cellWidth);
    let cellY = Math.floor(mouseY / this.cellHeight);
    if(this.lastDragXY.x === cellX && this.lastDragXY.y === cellY){
      return;
    }
    this.flipCell(cellX,cellY);
  }
  lastDragXY:{x:number,y:number} = {x:-1,y:-1};
  clickDrag(mouseX: number, mouseY: number){
    let cellX = Math.floor(mouseX / this.cellWidth);
    let cellY = Math.floor(mouseY / this.cellHeight);
    if(this.lastDragXY.x === cellX && this.lastDragXY.y === cellY){
      return;
    }
    this.lastDragXY.x = cellX;
    this.lastDragXY.y = cellY;
    this.flipCell(cellX,cellY);
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
    let nextState: boolean[][] = this.cells.map((row, x) => row.map((isAlive, y) => {
      let numberOfNeighbors = this.aliveNeighborCount(x, y);
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
        rect(w * this.cellWidth, h * this.cellHeight, this.cellWidth, this.cellHeight);
      }
    }));
    fill(255);
  }
}

class GameWithWrapAround extends GameOfLife {
  columns: number;
  rows: number;
  constructor(columns: number, rows: number) {
    super(columns, rows);
    this.columns = columns;
    this.rows = rows;
  }
  isCellAlive(x: number, y: number) {
    if (x < 0) {
      x = this.columns - 1;
    } else if (x >= this.columns) {
      x = 0;
    }
    if (y < 0) {
      y = this.rows - 1;
    } else if (y >= this.rows) {
      y = 0;
    }
    return super.isCellAlive(x, y);
  }
}