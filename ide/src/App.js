import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Pounce IDE
          </p>
        </header>
        <Phrase />
      </div>
    );
  }
}

// a Pounce Phrase
class Phrase extends Component {
  state = { };
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      words: [['+', 'dup2'], '[fib]', 'def', '0', '1', ['fib'], '6', 'repeat']
    };
  }

  getColor(i) {
    const w = this.state.words[i];
    if (Array.isArray(w)) {
      return 'rgb(100,200,200,0.4)';
    }
    return (w === 'def' || w === 'repeat')? 'rgb(200,200,100,0.4)': 'rgb(200,100,200,0.4)';
  }

  getWord(i) {
    const w = this.state.words[i];
    if (Array.isArray(w)) {
      return '[' + w.join(' ') + ']';
    }
    else {
      return w;
    }
  }

  renderWordRow() {
    let dynamic_words = [];
    const start_index = 0;
    const end_index = this.state.words.length;
    for (let word_index = start_index; word_index < end_index; word_index++) {
      dynamic_words.push(<Word key={word_index} color={this.getColor(word_index)} word={this.getWord(word_index)} />);
    }
    return (
      <div className="pounce-phrase-row row-container">
        {dynamic_words}
      </div>
    );
  }

  render() {
    return (
      <div >
        {this.renderWordRow()}
      </div>
    );
  }
}

// A graphic representation of a Pounce word
function Word(props) {
  return (
    <div className="pounce-word"
      style={{ backgroundColor: props.color }}>
      {props.word}
    </div>
  );
}

export default App;