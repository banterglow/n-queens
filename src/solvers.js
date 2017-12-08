/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

// shared by the countN Queens and Rooks functions
let compileMoves = function(depth, board, n, test) {
  let boardArray = board.rows();
  let options = [];
  for (let b = 0; b < boardArray.length; b++) {
    // n - depth limits selections to the next row that has no pieces placed
    if (boardArray[n - depth][b] === 0) {
      if ((test === 'Queens' && !board.hasRowConflictAtUsed(n - depth) && !board.hasColConflictAtUsed(b) && !board.hasRowConflictAtUsed(n - depth) && !board.hasColConflictAtUsed(b) && !board.hasMajorDiagonalConflictAtUsed(board._getFirstRowColumnIndexForMajorDiagonalOn(n - depth, b)) && !board.hasMinorDiagonalConflictAtUsed(board._getFirstRowColumnIndexForMinorDiagonalOn(n - depth, b))) || (test === 'Rooks' && !board.hasRowConflictAtUsed(n - depth) && !board.hasColConflictAtUsed(b))) {
        options.push([n - depth, b]);
      }
    }
  } 
  return options;
};

// shared by the countN Queens and Rooks functions
let populatePossibleBoards = function (count, board, n, validBoardObject, test, moveArray) {
  
  // moveArray only exists from the second recursive call onward, toggles valid piece found in previous call
  if (moveArray) {
    board.togglePiece(moveArray[0], moveArray[1]);
  }
  // if the recursion has been called n times, then we've modified a piece in the bottom row. No need to search further. 
  if (count === 0) {
    validBoardObject[JSON.stringify(board.rows())] = 1;
    board.togglePiece(moveArray[0], moveArray[1]);
    return;
  }
  // calls function that compiles possible next moves in an array
  let optionsArray = compileMoves(count, board, n, test);
  count--;
  
  // creates decision branch for each possible next move found above
  for (let i = 0; i < optionsArray.length; i++) {
    populatePossibleBoards(count, board, n, validBoardObject, test, optionsArray[i]);
  }
  
  // all branches on this level complete, toggle back the piece for the next options on the call stack
  if (moveArray) { 
    board.togglePiece(moveArray[0], moveArray[1]);
  }
  return;
};

window.findNRooksSolution = function(n) {
  let newBoard = new Board( { 'n': n } );
  let solution = newBoard.rows();
  newBoard.togglePiece(0, 0);
  
  let flag = false;
  let fillNextValidSpace = function() {
    flag = false;
    
    for (let a = 0; a < n; a++) {
      for (let b = 0; b < n; b++) {
        if (solution[a][b] === 0) {
          if (!newBoard.hasRowConflictAtUsed(a) && !newBoard.hasColConflictAtUsed(b)) {
            newBoard.togglePiece(a, b);
            flag = true;
            a = n;
            b = n;
          } else {
            solution[a][b] = null;
          }
        }
      } 
    }
    
    if (flag) {
      return fillNextValidSpace();
    }
    return null;
  };
    
  fillNextValidSpace();
  
  // change nulls back to 0
  for (let c = 0; c < solution.length; c++) {
    for (let d = 0; d < solution[c].length; d++) {
      if (_.isNull(solution[c][d])) {
        solution[c][d] = 0;
      }
    }
  }
  
  console.log(`Single solution for ${n} rooks:`, JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other

// start by toggling a random index? then check if the arrays are equal, if not, count++
window.countNRooksSolutions = function(n) {
  let board = new Board({ 'n': n});
  let counter = n;
  let validBoardObject = {};
  
  populatePossibleBoards(counter, board, counter, validBoardObject, 'Rooks');
  
  let solutionCount = Object.keys(validBoardObject).length;
  console.log(`Number of solutions for ${n} rooks:`, solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  let board = new Board({ 'n': n});
  let counter = n;
  let flag = false;
  
  let compileMoves = function(depth) {
    let boardArray = board.rows();
    let options = [];
    for (let a = 0; a < boardArray.length; a++) {
      for (let b = 0; b < boardArray.length; b++) {
        if (boardArray[a][b] === 0) {
          if (!board.hasRowConflictAtUsed(a) && !board.hasColConflictAtUsed(b) && !board.hasMajorDiagonalConflictAtUsed(board._getFirstRowColumnIndexForMajorDiagonalOn(a, b)) && !board.hasMinorDiagonalConflictAtUsed(board._getFirstRowColumnIndexForMinorDiagonalOn(a, b))) {
            options.push([a, b]);
            if (options.length === 3) {
              a = boardArray.length;
              b = boardArray.length;
            }
          }
        }
      } 
    }
    return options;
  };
  
  let populatePossibleBoards = function (count, moveArray) {
    if (moveArray) {
      board.togglePiece(moveArray[0], moveArray[1]);
    }
    if (count === 0) {
      flag = true;
      return board;
    }
    count--;
    
    let optionsArray = compileMoves(count);
    
    for (let i = 0; i < optionsArray.length; i++) {
      populatePossibleBoards(count, optionsArray[i]);
      if (flag === true) {
        return board;
      }
    }
    
    if (moveArray) { // change back to move array
      board.togglePiece(moveArray[0], moveArray[1]);

    }
    return board;
  };

  let solution = populatePossibleBoards(counter);

  console.log(`Single solution for ${n} queens:`, JSON.stringify(solution));
  return solution.rows();
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  let board = new Board({ 'n': n});
  let counter = n;
  let validBoardObject = {};
  
  if (n !== 0) {
    populatePossibleBoards(counter, board, counter, validBoardObject, 'Queens');
  } else {
    let solutionCount = 1;
    console.log(`Number of solutions for ${n} queens:`, solutionCount);
    return solutionCount;
  }
  
  let solutionCount = Object.keys(validBoardObject).length;
  console.log(`Number of solutions for ${n} queens:`, solutionCount);
  return solutionCount;
};
