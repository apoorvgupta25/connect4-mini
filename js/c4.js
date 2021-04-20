function Game() {
    this.rows = 6; // Height
    this.columns = 7; // Width
    this.status = 0; // 0: running, 1: won, 2: lost, 3: tie
    this.depth = 4; // Search depth
    this.score = 100000, // Win/loss score
    this.round = 0; // 0: Human, 1: Computer
    this.winning_array = []; // Winning (chips) array
    this.iterations = 0; // Iteration count
    
    that = this;

    that.init();
}

Game.prototype.init = function() {
    // Generate 'real' board
    // Create 2-dimensional array
    var game_board = new Array(that.rows);
    for (var i = 0; i < game_board.length; i++) {
        game_board[i] = new Array(that.columns);

        for (var j = 0; j < game_board[i].length; j++) {
            game_board[i][j] = null;
        }
    }

    // Create from board object (see board.js)
    this.board = new Board(this, game_board, 0);

    // Generate visual board
    var game_board = "";
    for (var i = 0; i < that.rows; i++) {
        game_board += "<tr>";
        for (var j = 0; j < that.columns; j++) {
            game_board += "<td class='empty'></td>";
        }
        game_board += "</tr>";
    }

    document.getElementById('game_board').innerHTML = game_board;

    // Action listeners
    var td = document.getElementById('game_board').getElementsByTagName("td");

    for (var i = 0; i < td.length; i++) {
        if (td[i].addEventListener) {
            td[i].addEventListener('click', that.act, false);
        } else if (td[i].attachEvent) {
            td[i].attachEvent('click', that.act)
        }
    }
}

/**
 * On-click event
 */
Game.prototype.act = function(e) {
    var element = e.target || window.event.srcElement;

    that.place(element.cellIndex);
    
}

Game.prototype.place = function(column) {
    // If not finished
    if (that.board.score() != that.score && that.board.score() != -that.score && !that.board.isFull()) {
        for (var y = that.rows - 1; y >= 0; y--) {
            if (document.getElementById('game_board').rows[y].cells[column].className == 'empty') {
                if (that.round == 1) {
                    document.getElementById('game_board').rows[y].cells[column].className = 'coin cpu-coin';
                } else {
                    document.getElementById('game_board').rows[y].cells[column].className = 'coin human-coin';
                }
                break;
            }
        }

        if (!that.board.place(column)) {
            return alert("Invalid move!");
        }

        that.round = that.switchRound(that.round);
        that.updateStatus();
    }
}

Game.prototype.switchRound = function(round) {
    // 0 Human, 1 Computer
    if (round == 0) {
        document.getElementById("infogame").style.color = "red";
        document.getElementById("infogame").innerHTML = "Player 2 turn";
        return 1;
    } else {
        document.getElementById("infogame").style.color = "black";
        document.getElementById("infogame").innerHTML = "Player 1 turn";
        return 0;
    }
}

Game.prototype.updateStatus = function() {
    // Human won
    if (that.board.score() == -that.score) {
        that.status = 1;
        that.markWin();
        document.getElementById("infogame").style.color = "black";
        document.getElementById("infogame").innerHTML = "Hurray! Player 1 Wins.&#128512;";

        // alert("You have won!");
    }

    // Computer won
    if (that.board.score() == that.score) {
        that.status = 2;
        that.markWin();
        document.getElementById("infogame").style.color = "red";
        document.getElementById("infogame").innerHTML = "Hurray! Player 2 Wins.&#128512;";
        // alert("Player 2 Won!");
    }

    // Tie
    if (that.board.isFull()) {
        that.status = 3;
        document.getElementById("infogame").style.color = "brown";
        document.getElementById("infogame").innerHTML = "Alas! The game got tied.&#128528;";
        // alert("Tie!");
    }
}

Game.prototype.markWin = function() {
    document.getElementById('game_board').className = "finished";
    for (var i = 0; i < that.winning_array.length; i++) {
        var name = document.getElementById('game_board').rows[that.winning_array[i][0]].cells[that.winning_array[i][1]].className;
        document.getElementById('game_board').rows[that.winning_array[i][0]].cells[that.winning_array[i][1]].className = name + " win";
    }
}

Game.prototype.restartGame = function() {
    if (confirm('Game is going to be restarted.\nAre you sure?')) {
        // Dropdown value
        var difficulty = document.getElementById('difficulty');
        var depth = difficulty.options[difficulty.selectedIndex].value;
        that.depth = depth;
        that.status = 0;
        that.round = 0;
        that.init();
        document.getElementById('ai-iterations').innerHTML = "?";
        document.getElementById('ai-time').innerHTML = "?";
        document.getElementById('ai-column').innerHTML = "Column: ?";
        document.getElementById('ai-score').innerHTML = "Score: ?";
        document.getElementById('game_board').className = "";
        that.updateStatus();
    }
}

/**
 * Start game
 */
function Start() {
    window.Game = new Game();
}

window.onload = function() {
    Start()
};
