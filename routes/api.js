'use strict';
const Solver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  app.route('/api/check')
    .post((req, res) => res.json(new Solver({...req.body}).validate()));
  
  app.route('/api/solve')
    .post((req, res) => res.json(new Solver({...req.body}).solve()));
};
