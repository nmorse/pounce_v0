(function () {
  'use strict';

  const module_words = {
    'chroma-scale': {
      expects: [
        { desc: '[colors]', ofType: 'array' },
        { desc: 'mode', ofType: 'string' },
        { desc: 'how many', ofType: 'integer' }
      ],
      effects: [-2], tests: [], desc: `get a scale of colors. usage: chroma_module import
      ['#f00' '#ff0' '#0f0' '#0ff' '#00f' '#f0f' '#f00']
      [str-dequote] map
      lch
      16
      chroma-scale
      `,
      definition: function (s) {
        const howMany = s.pop(); // 16
        const modeStr = s.pop(); // 'lch'
        const colors = s.pop(); // ['#f00','#ff0','#0f0', '#0ff', '#00f', '#f0f', '#f00']
        const range = chroma.scale(colors).mode(modeStr).colors(howMany);
        s.push(range);
        return [s];
      }
    },
    'chroma-color': {
      expects: [
        { desc: 'hex colors', ofType: 'array' }
      ],
      effects: [0], tests: [], desc: `color format from hex to {r:? g:?, b:?} record`,
      definition: function (s) {
        const hexColor = s.pop(); // '#0000ff'
        const rgb = chroma(hexColor).get('rgb');
        s.push({r:rgb[0], g:rgb[1], b:rgb[2], a:1});
        return [s];
      }
    }
  };

  const example = `
  canvas_basic_module import
  list_module import
  rec_module import
  chroma_module import
  ['#f00' '#ff0' '#0f0' '#0ff' '#00f' '#f0f' '#f00']
  [str-dequote] map
  lch
  16
  chroma-scale
  pop chroma-color swap
  pop chroma-color swap
  pop chroma-color swap
  pop chroma-color swap
  pop chroma-color swap
  pop chroma-color swap
  pop chroma-color swap
  pop chroma-color swap
  pop chroma-color swap
  pop chroma-color swap
  pop chroma-color swap
  pop chroma-color swap
  pop chroma-color swap
  pop chroma-color swap
  pop chroma-color swap
  pop chroma-color swap
  drop
    canvas cb-init cb-clear
  #  {color:{r:64 g:0 b:255 a:0.5} x:30 y:40 w:60 h:40} cb-box
  {} swap color set 10 x set 20 y set 10 w set 10 h set cb-box
  {} swap color set 20 x set 20 y set 10 w set 10 h set cb-box
  [{} swap color set 30 x set 20 y set 10 w set 10 h set cb-box] [boxit] def
  boxit 
  `;

  var exported = { words: module_words };

  if (typeof require === 'function' && typeof exports === 'object') {
    extend(exports, exported);
  } else {
    var namespace = typeof this !== 'undefined' ? this : window;
    namespace.chroma_module = exported;
  }
})();
