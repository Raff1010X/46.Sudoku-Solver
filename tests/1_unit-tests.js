const chai = require('chai');
const assert = chai.assert;
const puzzle = require('../controllers/puzzle-strings');

const Solver = require('../controllers/sudoku-solver.js');

suite('Unit Tests', () => {
  
    const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
    const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
  
    suite('Function validate()', function() {
        test('Logic handles a valid puzzle string of 81 characters', function(done) {
            let solver = new Solver({ puzzle: input, coordinate: 'A1', value: 1})
            assert.property(solver.validate(), 'valid',  true);
            done();
        });

        test('Logic handles a puzzle string with invalid characters (not 1-9 or .',function(done){
            let solver = new Solver({ puzzle: input.replace('5', 'A') , coordinate: 'A1', value: 1})
            assert.property(solver.validate(), 'error', 'Invalid characters in puzzle');
            done();
        });

        test('Logic handles a puzzle string that is not 81 characters in length',function(done){
            let solver = new Solver({ puzzle: input + '.1.',  coordinate: 'A1', value: 1})
            assert.property(solver.validate(), 'error', 'Expected puzzle to be 81 characters long');
            done();
        })
    })

    suite('Function solver.validate()', function() {
    
        test('Logic handles a valid row placement', function(done) {
          let solver = new Solver({ puzzle: input, coordinate: 'B2', value: 4})
          assert.property(solver.validate(), 'valid',  true);
          done();
        });

        test('Logic handles an invalid row placement', function(done) {
            let solver = new Solver({ puzzle: input, coordinate: 'B2', value: 7})
            const response = solver.validate()
            assert.property(response, 'valid',  false);
            assert.equal(response.conflict[0], 'row');
            done();
          });
     })

     suite('Function solver.validate()', function() {

          test('Logic handles a valid column placement', function(done) {
            let solver = new Solver({ puzzle: input, coordinate: 'B5', value: 7})
            assert.property(solver.validate(), 'valid',  true);
            done();
          });

          test('Logic handles an ivalid column placement', function(done) {
            let solver = new Solver({ puzzle: input, coordinate: 'B5', value: 4})
            const response = solver.validate()
            assert.property(response, 'valid',  false);
            assert.equal(response.conflict[0], 'column');
            done();
          });
      });

      suite('Function solver.validate()', function(){
        
        test('Logic handles a valid region(3x3 grid) placement', function(done){
            let solver = new Solver({ puzzle: input, coordinate: 'B8', value: 5})
            assert.property(solver.validate(), 'valid',  true);
            done();
        })

        test('Logic handles an invalid region(3x3 grid) placement', function(done){
            let solver = new Solver({ puzzle: input, coordinate: 'B8', value: 8})
            const response = solver.validate()
            assert.property(response, 'valid',  false);
            assert.equal(response.conflict[0], 'region');
            done();
        })

      })

      suite('Function solver.solve()',function(){
        test('Valid puzzle strings pass the solver',function(done){
            let solver = new Solver({ puzzle: input })
            let result = solver.solve();
            assert.equal(result.solution, solution);
            done();
        })

        test('InValid puzzle strings fail the solver',function(done){
            let solver = new Solver({ puzzle: input.replace('1', '5') })
            assert.equal(solver.solve().error, 'Puzzle cannot be solved');
            done();
        })

        test('Solver returns the expected solution for an incomplete puzzle',function(done){
            let solver = new Solver({ puzzle: input })
            assert.equal(solver.solve().solution, solution);
            done();
        })

      })
  
});
