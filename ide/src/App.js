import React, { useState } from "react";
// import { ReactDOM } from "react-dom";
import "./App.css";

function Word({ word, words, offset }) {
    const [state, setState] = useState({isExpanded:false, offset});
    const toggleExpand = e => {e.preventDefault(); setState({isExpanded: !state.isExpanded})};
    const getOffset = () => { 
        const tooltipNode = React.useRef(this);
        return [tooltipNode.offsetTop + offset[0],
        tooltipNode.offsetLeft + offset[1]];
    };
    // const style = {
    //     // zIndex: (state.opacity) ? 1000 : -1000,
    //     // opacity: +state.opacity,
    //     // position: 'relative',
    //     top: (getOffset()[0] || 0) + 70,
    //     left: (getOffset()[1] || 0) + 90
    //   };
return (
        <div className="pounce-word row-container"  onClick={toggleExpand} >
            {state.isExpanded && words[word] &&  words[word].map((w, i) => 
                <Word word={w} words={words} key={i} offset={[50,0]} />
            )}
            {word}
        </div>
    );
}


function App() {
    const words = {"is":["a", "is", "c"]};
    const [pl] = useState([
        "this", "is", "a"  // , ["list", "of", "words"]
    ]);

    return (
        <div className="app">
            <div className="pounce-phrase-row row-container">
                {pl.map((word, index) => (
                    <Word
                        key={index}
                        word={word}
                        words={words}
                        offset={[0,0]}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;
