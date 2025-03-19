const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {

    test('Logic handles a valid puzzle string of 81 characters', function() {
        solver = new Solver();
        const puzzle = '123456789123456789123456789123456789123456789123456789123456789123456789123456789';
        assert.isTrue(solver.validate(puzzle).chars && solver.validate(puzzle).length);
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
        solver = new Solver();
        const puzzle = '12345678912345678912345678912345678912345678912345678912345678912345678912345678x';
        assert.isFalse(solver.validate(puzzle).chars);
    });

    test('Logic handles a puzzle string that is not 81 characters in length', function() {
        solver = new Solver();
        const puzzle = '12345678912345678912345678912345678912345678912345678912345678912345678912345678';
        assert.isFalse(solver.validate(puzzle).length);
    });

    test('Logic handles a valid row placement', function() {
        solver = new Solver();
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        assert.isTrue(solver.checkRowPlacement(puzzle, 'A', 1, 7).validity);
    });

    test('Logic handles an invalid row placement', function() {
        solver = new Solver();
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        assert.isFalse(solver.checkRowPlacement(puzzle, 'A', 1, 9).validity);
    });

    test('Logic handles a valid column placement', function() {
        solver = new Solver();
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        assert.isTrue(solver.checkColPlacement(puzzle, 'A', 1, 7).validity);
    });

    test('Logic handles an invalid column placement', function() {
        solver = new Solver();
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        assert.isFalse(solver.checkColPlacement(puzzle, 'A', 1, 8).validity);
    });

    test('Logic handles a valid region (3x3 grid) placement', function() {
        solver = new Solver();
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        assert.isTrue(solver.checkRegionPlacement(puzzle, 'A', 1, 7).validity);
    });

    test('Logic handles an invalid region (3x3 grid) placement', function() {
        solver = new Solver();
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        assert.isFalse(solver.checkRegionPlacement(puzzle, 'D', 5, 9).validity);
    });

    test('Valid puzzle strings pass the solver', function() {
        solver = new Solver();
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        assert.isTrue(solver.solve(puzzle).solved);
    });

    test('Invalid puzzle strings fail the solver', function() {
        solver = new Solver();
        const puzzle = '769235418851496372432178956174569283395842761628713549283657194516924837947381622';
        assert.isFalse(solver.solve(puzzle).solved);
    });

    test('Solver returns the the expected solution for an incomplete puzzle', function() {
        solver = new Solver();
        const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
        assert.equal(solver.solve(puzzle).solution, solution);
    });
});
