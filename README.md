# [freeCodeCamp Quality Assurance certification](https://www.freecodecamp.org/learn/quality-assurance/)

## [Sudoku Solver](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/sudoku-solver)

Working example: http://app-sudoku-solverr.webdev.priv.pl/

My git repo: https://github.com/Raff1010X/01.Roadmap

```javascript
class SudokuSolver {
  puzzleArray
  copyArray
  coordinate
  value
// Initialize
  constructor(...args) {
    this.puzzleToArray(args[0].puzzle)
    this.copyArray = (this.puzzleArray) ? [...this.puzzleArray] : []
    this.coordinate = args[0].coordinate
    this.value = args[0].value
  }
// Validate and return coordinates
  getCoordinate() {
    if (!this.coordinate)
      return {error: 'Required field(s) missing'}
    const ret = (parseInt(this.coordinate.charAt(0), 36) - 10) * 9 + Number(this.coordinate.charAt(1))
    if (!(ret >= 1 && ret <= 81 && this.coordinate.length === 2))
      return {error: 'Invalid coordinate'}
    return ret - 1 
  }
// Validate and return value
  getValue() {
    if (!this.value)
      return {error: 'Required field(s) missing'}
    if (!/\b[1-9]\b/.test(this.value))
      return { error: 'Invalid value' }
    return Number(this.value)
  }
// Validate puzzle and return true
  checkPuzzle(s = '(s)') {
    if (!this.puzzleArray)
      return { error: `Required field${s} missing` }
    if (this.puzzleArray.length !== 81 )
      return { error: 'Expected puzzle to be 81 characters long' }
    if (!/^[0-9]+$/.test(this.puzzleArray.join('')))
      return { error: 'Invalid characters in puzzle' }
    return true
  }
// Set puzzleArray from string
  puzzleToArray = (puzzle) => (puzzle) ? this.puzzleArray = puzzle.toString().split('').map(el => Number(0 + el)) : []
// Return array with row values
  row = (row) => this.puzzleArray.filter((el, ind) => (ind >= row * 9 && ind < row * 9 + 9) ? el : 0)
// Return array with column values
  column = (column) => this.puzzleArray.filter((el, ind) => ((ind - column) % 9 === 0 ) ? el : 0)
// Return array with region values
  region(region) {
    const row = Math.ceil((region + 1) / 3)
    const column = region - ((row - 1) * 3) + 1
    const start = row * 27 - 27 + column * 3 - 3
    return this.puzzleArray.filter((el, ind) => {
      for (let i=start; i<=start+18; i += 9) 
        if (ind >= i && ind < i + 3) return el
    })
  }
// Find row based on index in puzzleArray
  findRow = (i) => Math.ceil((i + 1) / 9) - 1
// Find column based on index in puzzleArray
  findColumn = (i) =>  i - this.findRow(i) * 9
// Find region based on index in puzzleArray
  findRegion = (i) => (Math.ceil((this.findRow(i) + 1) / 3) - 1) * 3 + Math.ceil((this.findColumn(i) + 1) / 3) - 1
// Check if row, column, region array - return true if valid
  checkOne = (arr) => arr.length === Array.from(new Set(arr)).length
// Check conflicts in puzzle, return 'false' if valid or object if not valid
  checkConflict = (details = false) => {
    let conflict = []
    for (let i=0; i<=8; i++) {
      if (!this.checkOne(this.row(i))) conflict.push('row')
      if (!this.checkOne(this.column(i))) conflict.push('column')
      if (!this.checkOne(this.region(i))) conflict.push('region')
    }
    if (conflict.length > 0) 
      return (details) ? { valid: false, conflict } : { error: 'Puzzle cannot be solved' }
    return false
  }
// Check if solver new value placement is valid
  checkNew = (i) => {
    if (!this.checkOne(this.row(this.findRow(i)))) return false
    if (!this.checkOne(this.column(this.findColumn(i)))) return false
    if (!this.checkOne(this.region(this.findRegion(i)))) return false
    return true
  }
// Sudoku solver - brute force metod
  solver() {
    let i = 0
    let b = false
    let p = this.puzzleArray
    do {
      if (this.copyArray[i] === 0) {
        p[i]++    
        if (p[i] <= 9)
          if (this.checkNew(i)) {
            b = false
            i++
          }
        if (p[i] > 9) {
          p[i] = 0
          b = true
          i--
        }  
      }
      else
        if (b) i--
          else i++
    } while (i < 81)
    return p.join('')
  }
// Validate puzzle
  validate() {    
    const coordinate = this.getCoordinate()
    const value = this.getValue()
    const puzzle = this.checkPuzzle()
    if (puzzle !== true)
      return puzzle
    if (typeof(coordinate) !== 'number')
      return coordinate
    if (typeof(value) !== 'number')
      return value
    this.puzzleArray[coordinate] = value
    const conflicts = this.checkConflict(true)
    if (conflicts !== false)
      return conflicts
    return {valid: true}
  }
// Solve puzzle
  solve() {
    const puzzle = this.checkPuzzle('')
    if (puzzle !== true) 
      return puzzle
    const conflict = this.checkConflict()
    if (conflict !== false)
      return conflict
    return {solution: this.solver()}
  }
}
module.exports = SudokuSolver;
```