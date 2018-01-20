var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var world;
var num = function (from, to) {
    var ar = [];
    while (from < to)
        ar.push(from++);
    return ar;
};
function setup() {
    createCanvas(1400, 800);
    world = new GameWithWrapAround(280, 160);
    background(255);
}
var PAUSE = true;
function draw() {
    if (!PAUSE) {
        world.step();
    }
    world.display();
}
function keyPressed() {
    if (keyCode === 32) {
        PAUSE = !PAUSE;
    }
    else if (keyCode === 17) {
        world.step();
    }
    else if (keyCode === 71) {
        world.toggleGrid();
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
var Grid = (function () {
    function Grid(columns, rows) {
        this.shouldDrawGrid = false;
        this.columns = columns;
        this.rows = rows;
    }
    Grid.prototype.columnSize = function () {
        return width / this.columns;
    };
    Grid.prototype.rowSize = function () {
        return height / this.rows;
    };
    Grid.prototype.toggleGrid = function () {
        this.shouldDrawGrid = !this.shouldDrawGrid;
    };
    Grid.prototype.drawGrid = function () {
        if (!this.shouldDrawGrid) {
            return;
        }
        var columnSize = this.columnSize();
        var rowSize = this.rowSize();
        num(1, this.rows).forEach(function (row) {
            line(0, row * rowSize, width, row * rowSize);
        });
        num(1, this.columns).forEach(function (column) {
            line(column * columnSize, 0, column * columnSize, height);
        });
    };
    Grid.prototype.drawBackGround = function () {
        rect(0, 0, width - 1, height - 1);
    };
    Grid.prototype.display = function () {
        this.drawBackGround();
        this.drawGrid();
    };
    return Grid;
}());
var GameOfLife = (function (_super) {
    __extends(GameOfLife, _super);
    function GameOfLife(columns, rows) {
        var _this = _super.call(this, columns, rows) || this;
        _this.lastDragXY = {
            x: -1,
            y: -1
        };
        _this.cellWidth = _super.prototype.columnSize.call(_this);
        _this.cellHeight = _super.prototype.rowSize.call(_this);
        _this.cells = num(0, columns).map(function (e) { return num(0, rows).map(function (isAlive) { return random() > 0.5; }); });
        return _this;
    }
    GameOfLife.prototype.flipCell = function (x, y) {
        if (this.isInBounds(x, y)) {
            this.cells[x][y] = !this.cells[x][y];
        }
    };
    GameOfLife.prototype.click = function (mouseX, mouseY) {
        var cellX = Math.floor(mouseX / this.cellWidth);
        var cellY = Math.floor(mouseY / this.cellHeight);
        if (this.lastDragXY.x === cellX && this.lastDragXY.y === cellY) {
            return;
        }
        this.flipCell(cellX, cellY);
    };
    GameOfLife.prototype.clickDrag = function (mouseX, mouseY) {
        var cellX = Math.floor(mouseX / this.cellWidth);
        var cellY = Math.floor(mouseY / this.cellHeight);
        if (this.lastDragXY.x === cellX && this.lastDragXY.y === cellY) {
            return;
        }
        this.lastDragXY.x = cellX;
        this.lastDragXY.y = cellY;
        this.flipCell(cellX, cellY);
    };
    GameOfLife.prototype.isCellAlive = function (x, y) {
        return this.isInBounds(x, y) ? (this.cells[x][y] ? 1 : 0) : 0;
    };
    GameOfLife.prototype.isInBounds = function (x, y) {
        return x > -1 && x < this.cells.length && y > -1 && y < this.cells[0].length;
    };
    GameOfLife.prototype.aliveNeighborCount = function (x, y) {
        return this.isCellAlive(x - 1, y - 1) + this.isCellAlive(x, y - 1) + this.isCellAlive(x + 1, y - 1) +
            this.isCellAlive(x - 1, y) + this.isCellAlive(x + 1, y) +
            this.isCellAlive(x - 1, y + 1) + this.isCellAlive(x, y + 1) + this.isCellAlive(x + 1, y + 1);
    };
    GameOfLife.prototype.step = function () {
        var _this = this;
        var nextState = this.cells.map(function (row, x) { return row.map(function (isAlive, y) {
            var numberOfNeighbors = _this.aliveNeighborCount(x, y);
            if (numberOfNeighbors < 2) {
                isAlive = false;
            }
            else if (numberOfNeighbors === 3) {
                isAlive = true;
            }
            else if (numberOfNeighbors > 3) {
                isAlive = false;
            }
            return isAlive;
        }); });
        this.cells = nextState;
    };
    GameOfLife.prototype.display = function () {
        var _this = this;
        this.drawBackGround();
        fill(100);
        noStroke();
        this.cells.forEach(function (row, w) { return row.forEach(function (isAlive, h) {
            if (isAlive) {
                rect(w * _this.cellWidth, h * _this.cellHeight, _this.cellWidth, _this.cellHeight);
            }
        }); });
        stroke(0);
        this.drawGrid();
        fill(255);
    };
    return GameOfLife;
}(Grid));
var GameWithWrapAround = (function (_super) {
    __extends(GameWithWrapAround, _super);
    function GameWithWrapAround(columns, rows) {
        var _this = _super.call(this, columns, rows) || this;
        _this.columns = columns;
        _this.rows = rows;
        return _this;
    }
    GameWithWrapAround.prototype.isCellAlive = function (x, y) {
        if (x < 0) {
            x = this.columns - 1;
        }
        else if (x >= this.columns) {
            x = 0;
        }
        if (y < 0) {
            y = this.rows - 1;
        }
        else if (y >= this.rows) {
            y = 0;
        }
        return this.cells[x][y] ? 1 : 0;
    };
    return GameWithWrapAround;
}(GameOfLife));
//# sourceMappingURL=sketch.js.map