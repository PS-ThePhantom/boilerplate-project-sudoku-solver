class SudokuSolver {

  validate(puzzleString) {
    const validChars =/^[1-9.]+$/;
    
    return {
      length: puzzleString.length === 81,
      chars: validChars.test(puzzleString)
    };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      H: 7,
      I: 8
    };
    row = rowIndex[row.toUpperCase()];

    const rows = puzzleString.match(/.{9}/g);
    const rowToCheck = rows[row];
    return !rowToCheck.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    column--;

    const columns = ["", "", "", "", "", "", "", "", ""];
    for (let i = 0; i < 9; i++) {
      columns[i] += puzzleString.match(/.{9}/g).map(row => row[i]);
      columns[i] = columns[i].replace(/,/g, "");
    }
    const colToCheck = columns[column];
    return !colToCheck.includes(value);

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

