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
    
    return {validity: !rowToCheck.includes(value) || Number(rowToCheck[column - 1]) === value,
            rows: rows};
  }

  checkColPlacement(puzzleString, row, column, value) {
    column--;
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

    const columns = ["", "", "", "", "", "", "", "", ""];
    for (let i = 0; i < 9; i++) {
      columns[i] += puzzleString.match(/.{9}/g).map(row => row[i]);
      columns[i] = columns[i].replace(/,/g, "");
    }
    const colToCheck = columns[column];
    
    return {validity: !colToCheck.includes(value) || Number(colToCheck[row]) === value,
            columns: columns};
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regions = ["", "", "", "", "", "", "", "", ""];

    for(let i = 0; i < 81; i++) {
      const region = Math.floor(i / 27) * 3 + Math.floor(i % 9 / 3);
      regions[region] += puzzleString[i];
    }

    let region;
    row = row.toUpperCase();
    column--;

    if(row <= 'C' && column < 3) region = 0;
    else if(row <= 'C' && column < 6) region = 1;
    else if(row <= 'C' && column < 9) region = 2;
    else if(row <= 'F' && column < 3) region = 3;
    else if(row <= 'F' && column < 6) region = 4;
    else if(row <= 'F' && column < 9) region = 5;
    else if(row <= 'I' && column < 3) region = 6;
    else if(row <= 'I' && column < 6) region = 7;
    else if(row <= 'I' && column < 9) region = 8;

    return {validity: !regions[region].includes(value) || Number(puzzleString[(row.charCodeAt(0) - 65) * 9 + column]) === value,
            regions: regions};
  }

  solve(puzzleString) {
    if(!this.validate(puzzleString).chars || !this.validate(puzzleString).length) {
      return {solved: false, solution: puzzleString, error: "Invalid characters in puzzle"};
    }

    let solved = false;
    let lastRemainingSpots = puzzleString.split("").filter(char => char === ".").length;
    let regions = ["", "", "", "", "", "", "", "", ""];

    for(let i = 0; i < 81; i++) {
      const region = Math.floor(i / 27) * 3 + Math.floor(i % 9 / 3);
      regions[region] += puzzleString[i];
    }

    while(!solved) {
      let remainingSpots = lastRemainingSpots;

      for(let i = 0; i < 81; i++) {
        if(puzzleString[i] === ".") {
          const rowIndex = Math.floor(i / 9);
          const colIndex = i % 9;
          const region = Math.floor(i / 27) * 3 + Math.floor(i % 9 / 3);
          const row = puzzleString.match(/.{9}/g)[rowIndex];
          const column = puzzleString.match(/.{9}/g).map(row => row[colIndex]).join("");
          const regionString = regions[region];

          let possibleValues = "123456789".split("").filter(value => !row.includes(value) && !column.includes(value) && !regionString.includes(value));
          if(possibleValues.length === 1) {
            puzzleString = puzzleString.slice(0, i) + possibleValues[0] + puzzleString.slice(i + 1);
            remainingSpots--;
            regions = ["", "", "", "", "", "", "", "", ""];

            for(let i = 0; i < 81; i++) {
              const region = Math.floor(i / 27) * 3 + Math.floor(i % 9 / 3);
              regions[region] += puzzleString[i];
            }
          }
        }
      }

      if(remainingSpots === 0) {
        //check if all rows have unique values and values are from 1-9
        for(let i = 0; i < 9; i++) {
          if(puzzleString.match(/.{9}/g)[i].split("").sort().join("") !== "123456789") {
            return {solved: solved, solution: puzzleString, error: "Puzzle cannot be solved"};
          }
        }

        solved = true;
      }

      if(remainingSpots === lastRemainingSpots) {
        return {solved: solved, solution: puzzleString, error: "Puzzle cannot be solved"};
      }

      lastRemainingSpots = remainingSpots;
    }

    return {solved: solved, solution: puzzleString, error: null};
  }
}

module.exports = SudokuSolver;

