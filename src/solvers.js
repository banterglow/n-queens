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



window.findNRooksSolution = function(n) {
  var solution = new Board( { n: n } );
  var boardArrays = solution.rows();
  solution.togglePiece(0, 0);
  
  var flag = false;
  var outerRecursion = function() {
    flag = false;
    
    for (var a = 0; a < n; a++) {
      for (var b = 0; b < n; b++) {
        if (boardArrays[a][b] === 0) {
          if (!solution.hasRowConflictAtUsed(a) && !solution.hasColConflictAtUsed(b)) {
            solution.togglePiece(a, b);
            flag = true;
            a = n;
            b = n;
          } else {
            boardArrays[a][b] = null;
          }
        }
      } 
    }
    
    if (flag) {
      return outerRecursion();
    }
    return null;
  };
    
  outerRecursion();
  
  // change nulls back to 0
  for (var c = 0; c < boardArrays.length; c++) {
    for (var d = 0; d < boardArrays[c].length; d++) {
      if (_.isNull(boardArrays[c][d])) {
        boardArrays[c][d] = 0;
      }
    }
  }
  
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other

// start by toggling a random index? then check if the arrays are equal, if not, count++
window.countNRooksSolutions = function(n) {
  var solutionCount = undefined; //fixme

  // console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  // return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  // console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  // return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  // console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  // return solutionCount;
};
