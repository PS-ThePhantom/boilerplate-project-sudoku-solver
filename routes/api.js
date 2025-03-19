'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      let coordinate = req.body.coordinate;
      let value = req.body.value;
      
      if (!puzzle || !coordinate || (value === undefined || value === null)) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (!solver.validate(puzzle).chars) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      if (coordinate.length !== 2) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!coordinate.match(/^[A-I][1-9]$/)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (isNaN(value) || value < 1 || value > 9) {
        return res.json({ error: 'Invalid value' });
      }

      const row = coordinate[0].toUpperCase();
      const column = parseInt(coordinate[1]);

      const checkRow = solver.checkRowPlacement(puzzle, row, column, parseInt(value));
      const checkCol = solver.checkColPlacement(puzzle, row, column, parseInt(value));
      const checkRegion = solver.checkRegionPlacement(puzzle, row, column, parseInt(value));

      if (checkRow.validity && checkCol.validity && checkRegion.validity) {
        return res.json({ valid: true });
      }

      let conflicts = [];

      if (!checkRow.validity) {
        conflicts.push('row');
      }

      if (!checkCol.validity) {
        conflicts.push('column');
      }

      if (!checkRegion.validity) {
        conflicts.push('region');
      }

      res.json({ valid: false, conflict: conflicts });

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      if (! solver.validate(puzzle).chars) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      const solution = solver.solve(puzzle);

      if(!solution.solved) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      res.json({ solution: solution.solution });
    });
};
