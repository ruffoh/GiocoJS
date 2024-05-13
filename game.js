class Cell {
    constructor(value, solution) {
        this.value = value;
        this.state = 'normal'; // normal, enabled, disabled
        this.solution = solution; // true, false
    }

    reset = () => this.state = 'normal';

    enable() {
        this.state = 'enabled';
    }

    disable() {
        this.state = 'disabled';
    }

    isDisabled() {
        return this.state === 'disabled';
    }

    isEnabled() {
        return this.state === 'enabled';
    }

    isNormal = () => this.state === 'normal';
}

class Board {
    constructor(dimension) {
        this.dimension = dimension;

        this.cells = [];

        this.generate();
    }

    getCell(row, col) {
        return this.cells[row * this.dimension + col];
    }

    setCell(row, col, value) {
        this.cells[row * this.dimension + col] = value;
    }

    getColSum(col) {
        let sum = 0;
        for (let row = 0; row < this.dimension; row++) {
            if (!this.getCell(row, col).isDisabled()) {
                sum += this.getCell(row, col).value;
            }
        }
        return sum;
    }

    getRowSum(row) {
        let sum = 0;
        for (let col = 0; col < this.dimension; col++) {
            if (!this.getCell(row, col).isDisabled()) {
                sum += this.getCell(row, col).value;
            }
        }
        return sum;
    }

    getSolutionRowSum(row) {
        let sum = 0;
        for (let col = 0; col < this.dimension; col++) {
            if (this.getCell(row, col).solution) {
                sum += this.getCell(row, col).value;
            }
        }
        return sum;
    }

    getSolutionColSum(col) {
        let sum = 0;
        for (let row = 0; row < this.dimension; row++) {
            if (this.getCell(row, col).solution) {
                sum += this.getCell(row, col).value;
            }
        }
        return sum;
    }

    generate() {
        for (let i = 0; i < this.dimension * this.dimension; i++) {
            let randValue = Math.floor(Math.random() * 9 + 1);
            let randSolution = Math.random() < 0.6;
            this.cells.push(new Cell(randValue, randSolution));
        }
    }

}


class Game {
    constructor(dimension) {
        this.board = new Board(dimension);
        this.table = this.tableGenerator(dimension);
        document.getElementById('game').innerHTML = '';
        document.getElementById('game').appendChild(this.table);
        console.log(this.board);
    }

    tableGenerator(dimension) {
        let table = document.createElement('table');
        table.classList.add('table');
        table.classList.add('is-bordered');


        for (let i = 0; i < dimension; i++) {
            let row = document.createElement('tr');
            for (let j = 0; j < dimension; j++) {
                let cell = document.createElement('td');
                cell.id = 'cell-' + i + '-' + j;
                cell.classList.add('cell');
                cell.classList.add('is-clickable');
                cell.onclick = () => this.toggleCell(i, j);
                // cell.onclick = "game.toggleCell(" + i + "," + j + ")";
                row.appendChild(cell);
            }
            let sumRow = document.createElement('td');
            sumRow.id = 'sum-row-' + i;
            sumRow.classList.add('cell');
            sumRow.classList.add('is-info');
            row.appendChild(sumRow);
            table.appendChild(row);
        }

        let row = document.createElement('tr');
        for (let i = 0; i < dimension; i++) {
            let sumCol = document.createElement('td');
            sumCol.id = 'sum-col-' + i;
            sumCol.classList.add('cell');
            sumCol.classList.add('is-info');
            row.appendChild(sumCol);
        }
        table.appendChild(row);

        return table;
    }

    start() {
        console.log('Game started');
        for (let i = 0; i < this.board.dimension; i++) {
            for (let j = 0; j < this.board.dimension; j++) {
                let cell = this.board.getCell(i, j);
                document.getElementById('cell-' + i + '-' + j).innerText = cell.value;
                console.log(this.board.getCell(i, j));
            }
        }
        for (let i = 0; i < this.board.dimension; i++) {
            document.getElementById('sum-row-' + i).innerText = this.board.getSolutionRowSum(i);
            document.getElementById('sum-col-' + i).innerText = this.board.getSolutionColSum(i);
        }
    }

    toggleCell(row, col) {
        let cell = this.board.getCell(row, col);
        let element = document.getElementById('cell-' + row + '-' + col)
        if (cell.isEnabled()) {
            cell.disable();
            element.classList.remove('is-success');
            element.classList.add('is-danger');
        } else if (cell.isDisabled()) {
            element.classList.remove('is-danger');
            cell.reset();
        } else if (cell.isNormal()) {
            cell.enable();
            element.classList.remove('is-danger');
            element.classList.add('is-success');
        }
    }

    check() {
        for (let i = 0; i < this.board.dimension; i++) {
            let sumRow = this.board.getRowSum(i);
            let sumCol = this.board.getColSum(i);
            if (sumRow == this.board.getSolutionRowSum(i)) {
                document.getElementById('sum-row-' + i).classList.add('is-success');
            } else {
                document.getElementById('sum-row-' + i).classList.remove('is-success');
            }
            if (sumCol == this.board.getSolutionColSum(i)) {
                document.getElementById('sum-col-' + i).classList.add('is-success');
            } else {
                document.getElementById('sum-col-' + i).classList.remove('is-success');
            }
        }

        let win = true;
        for (let i = 0; i < this.board.dimension; i++) {
            if (!document.getElementById('sum-row-' + i).classList.contains('is-success')
                || !document.getElementById('sum-col-' + i).classList.contains('is-success')) {
                win = false;
            }
        }

        if (win) {
            alert('You win!');
        }
    }
}