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
var num = function (st, en) {
    var ar = [];
    while (st < en)
        ar.push(st++);
    return ar;
};
function setup() {
    createCanvas(600, 600);
    world = new GOLWrapAround(60, 60);
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
}
function mouseClicked() {
    world.click(mouseX, mouseY);
    return false;
}
var Grid = (function () {
    function Grid(width, height) {
        this.w = width;
        this.h = height;
    }
    Grid.prototype.display = function () {
        var wSteps = width / this.w;
        var hSteps = height / this.h;
        rect(0, 0, width - 1, height - 1);
        num(1, this.h).forEach(function (e) {
            line(0, e * hSteps, width, e * hSteps);
        });
        num(1, this.w).forEach(function (e) {
            line(e * wSteps, 0, e * wSteps, height);
        });
    };
    return Grid;
}());
var GOL = (function (_super) {
    __extends(GOL, _super);
    function GOL(w, h) {
        var _this = _super.call(this, w, h) || this;
        _this.cellW = width / w;
        _this.cellH = height / h;
        _this.cells = num(0, w).map(function (e) { return num(0, h).map(function (isAlive) { return random() > 0.5; }); });
        return _this;
    }
    GOL.prototype.flipCell = function (x, y) {
        if (this.isInBounds(x, y)) {
            this.cells[x][y] = !this.cells[x][y];
        }
    };
    GOL.prototype.click = function (mouseX, mouseY) {
        this.flipCell(Math.floor(mouseX / this.cellW), Math.floor(mouseY / this.cellH));
    };
    GOL.prototype.isCellAlive = function (x, y) {
        return this.isInBounds(x, y) ? (this.cells[x][y] ? 1 : 0) : 0;
    };
    GOL.prototype.isInBounds = function (x, y) {
        return x > -1 && x < this.cells.length && y > -1 && y < this.cells[0].length;
    };
    GOL.prototype.aliveNeighborCount = function (x, y) {
        return this.isCellAlive(x - 1, y - 1) + this.isCellAlive(x, y - 1) + this.isCellAlive(x + 1, y - 1) +
            this.isCellAlive(x - 1, y) + this.isCellAlive(x + 1, y) +
            this.isCellAlive(x - 1, y + 1) + this.isCellAlive(x, y + 1) + this.isCellAlive(x + 1, y + 1);
    };
    GOL.prototype.step = function () {
        var _this = this;
        var nextState = this.cells.map(function (row, w) { return row.map(function (isAlive, h) {
            var numberOfNeighbors = _this.aliveNeighborCount(w, h);
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
    GOL.prototype.display = function () {
        var _this = this;
        _super.prototype.display.call(this);
        fill(100);
        this.cells.forEach(function (row, w) { return row.forEach(function (isAlive, h) {
            if (isAlive) {
                rect(w * _this.cellW, h * _this.cellH, _this.cellW, _this.cellH);
            }
        }); });
        fill(255);
    };
    return GOL;
}(Grid));
var GOLWrapAround = (function (_super) {
    __extends(GOLWrapAround, _super);
    function GOLWrapAround(w, h) {
        var _this = _super.call(this, w, h) || this;
        _this.w = w;
        _this.h = h;
        return _this;
    }
    GOLWrapAround.prototype.isCellAlive = function (x, y) {
        if (x < 0) {
            x = this.w - 1;
        }
        else if (x >= this.w) {
            x = 0;
        }
        if (y < 0) {
            y = this.h - 1;
        }
        else if (y >= this.h) {
            y = 0;
        }
        return _super.prototype.isCellAlive.call(this, x, y);
    };
    return GOLWrapAround;
}(GOL));
//# sourceMappingURL=sketch.js.map