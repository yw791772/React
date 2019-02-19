import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    var cls = 'square';
    if (props.winner) cls += ' square-win';
    return (
      <button
      	className={cls}
      	onClick={props.onClick}
      >
        { props.value }
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i, winner) {
    return (
      <Square
    	value={this.props.squares[i]}
    	onClick={() => this.props.onClick(i)}
      winner={winner}
      />
    );
  }

  render() {
  	let rows = [];
  	for (var i=0; i<3; i++) {
  		let squares = []
  		for(var j=0; j<3; j++) {
        let winner = this.props.winner && this.props.winner.indexOf(i*3+j) !== -1;
  			squares.push(this.renderSquare(i*3+j, winner));
  		}
  		rows.push(<div className="board-row">{squares}</div>)
  	}
    return (
      <div>{rows}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		history: [{
  			squares: Array(9).fill(null),
  			last: null,
  		}],
  		xIsNext: true,
  		stepNumber: 0,
  		ascending: true,

  	}
  }

  handleClick(i) {
  	const history = this.state.history.slice(0, this.state.stepNumber + 1);
  	const current = history[history.length - 1];
  	const squares = current.squares.slice();
  	if (calculateWinner(squares) || squares[i]) {
  		return;
  	}
  	squares[i] = this.state.xIsNext ? 'X' : 'O';
  	this.setState({
  		history: history.concat([{
  			squares: squares,
  			last: i,
  		}]),
  		xIsNext: !this.state.xIsNext,
  		stepNumber: history.length,
  	});
  }

  jumpTo(step) {
  	this.setState({
  		stepNumber: step,
  		xIsNext: (step % 2) === 0,
  	});
  }

  sortHandleCLick() {
  	this.setState({
  		ascending: !this.state.ascending,
  	});
  }

  render() {
  	const history = this.state.history;
  	const current = history[this.state.stepNumber];
  	const winner = calculateWinner(current.squares);
  	const ascending = this.state.ascending;

  	const moves = history.map((step, move) => {
  		var row = Math.floor(step.last/3)+1;
  		var col = Math.floor(step.last%3)+1;
  		const desc = move ?
  			'Go to move #' + move + ': (' + row + ', ' + col + ')' :
  			'Go to game start';
  		return (
  			<li key={move}>
  				<button
  					className={(this.state.stepNumber === move ? 'active' : 'inactive')}
  					onClick={() => this.jumpTo(move)}
  				>
  					{desc}
  				</button>
  			</li>
  		);
  	});
  	let status;
  	if (winner) {
      //for (let i=0; i < winner.length; i++){
        //current.squares[winner[i]].winner = true;
      //}
  		status = 'Winner: ' + current.squares[winner[0]];
  	} else if (this.state.stepNumber === current.squares.length) {
      status = 'Draw';
    } else {
  		status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
          	squares={current.squares}
          	onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ ascending ? moves : moves.reverse() }</ol>
          <button onClick={()=> this.sortHandleCLick()}>Sort</button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
	const lines = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return lines[i];
		}
	}
	return false;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

