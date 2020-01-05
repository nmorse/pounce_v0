(function () {
  'use strict';

  const cb_words = {
    'cb-init': {
      expects: [{ desc: 'canvas tag id', ofType: 'string' }],
      effects: [0], desc: 'init the graphics context for a canvas element',
      definition: function (s, pl, ws) {
        const canvasId = s.pop();
        var canvas = document.getElementById(canvasId);
        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.images = [];
        if (!ws[0].ctx) {
          ws[0].ctx = {};
        }
        ws[0].ctx[canvasId] = ctx;
        ws[0].ctx_default = canvasId;
        return [s, pl, ws];
      }
    },
    'cb-begin-path': {
      desc: 'start a path at x y',
      definition: function (s, pl, ws) {
        const y1 = s.pop();
        const x1 = s.pop();
        const ctx = ws[0].ctx[ws[0].ctx_default];
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        return [s];
      }
    },
    'cb-line-to': {
      desc: 'continue a path to x y',
      definition: function (s, pl, ws) {
        const y2 = s.pop();
        const x2 = s.pop();
        const ctx = ws[0].ctx[ws[0].ctx_default];
        ctx.lineTo(x2, y2);
        return [s];
      }
    },
    'cb-end-path': {
      desc: 'ends a path',
      definition: function (s, pl, ws) {
        const ctx = ws[0].ctx[ws[0].ctx_default];
        ctx.stroke();
        return [s];
      }
    },
    'cb-line': {
      desc: 'draw a line from x1 y1 to x2 y2',
      definition: function (s, pl, ws) {
        const y2 = s.pop();
        const x2 = s.pop();
        const y1 = s.pop();
        const x1 = s.pop();
        const ctx = ws[0].ctx[ws[0].ctx_default];
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return [s];
      }
    },
    'cb-box': {
      sig: { args: [{ 'x': 'number', 'y': 'number' }, { d: 'record' }] },
      desc: 'demo 50 x 50 filled box',
      definition: function (s, pl, ws) {
        const d = s.pop();
        if (pounce.isNumber(d)) {
          const y = d
          const x = s.pop();
          const ctx = ws[0].ctx[ws[0].ctx_default];
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(x, y, 50, 50);
        }
        else {
          const ctx = ws[0].ctx[ws[0].ctx_default];
          if (d.color) {
            ctx.fillStyle = 'rgba(' + d.color.r + ', ' + d.color.g + ', ' + d.color.b + ', ' + d.color.a + ')';
          }
          if (!d.w || !d.h) {
            d.w = 10;
            d.h = 10;
          }
          ctx.fillRect(d.x, d.y, d.w, d.h);
        }
        return [s];
      }
    },
    'cb-clear': {
      desc: 'clear the full canvas',
      definition: function(s, pl, ws) {
        const ctx = ws[0].ctx[ws[0].ctx_default];
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        ctx.clearRect(0, 0, w, h); // clear canvas
        return [s];
      }
    },
    'cb-load-image': {
      desc: 'given a src load an image (async)',
      definition: function(s, pl, ws) {
        const src = s.pop();
        const ctx = ws[0].ctx[ws[0].ctx_default];
        if (!ctx.images) {
          ctx.images = [];
        }
        var image = new Image();
        image.onload = drawImageActualSize; // draw when image has loaded
        image.src = src;

        function drawImageActualSize() {
          ctx.drawImage(this, 0, 0);
          ctx.images.push(this);
        }
        return [s];
      }
    },
    'cb-nth-image': {
      desc: 'show the nth loaded image (see: cb-load-image)',
      definition: function(s, pl, ws) {
        const n = s.pop();
        const ctx = ws[0].ctx[ws[0].ctx_default];
        ctx.drawImage(ctx.images[n], 0, 0);
        return [s];
      }
    },
    'cb-color-at': {
      desc: 'get the pixel color at an x y location',
      definition: function(s, pl, ws) {
        const canvasId = s.pop();
        const pt = s.pop();
        const ctx = ws[0].ctx[canvasId];
        var pixel = ctx.getImageData(pt.x, pt.y, 1, 1);
        var data = pixel.data;
        var rgba = { r: data[0], g: data[1], b: data[2], a: (data[3] / 255)};
        s.push(rgba);
        return [s];
      }
    },

    // # usage example for cb-transform-invoke and cb-transform-restore
    // canvas_basic_module import
    // canvas cb-init cb-clear
    // [
    //   {xsc:1 ysc:1 xsk:0 ysk:-0.5 xtr:-30 ytr:10} cb-transform
    //   {color:{r:127 g:127 b:127 a:0.5} x:50  y:50  w:100 h:70} cb-box
    //   {color:{r:127 g:127 b:127 a:0.5} x:100 y:100 w:100 h:70} cb-box
    //   {color:{r:127 g:127 b:127 a:0.5} x:150 y:150 w:100 h:70} cb-box
    //   cb-transform-restore
    // ] [draw-with-skew] def
    // draw-with-skew
    'cb-transform-invoke': {
      desc: 'transform it {xsc:1 ysc:1 xsk:0 ysk:0 xtr:0 ytr:0} (sc)ale (sk)ew (tr)anslate',
      definition: function(s, pl, ws) {
        const tf = s.pop();
        const ctx = ws[0].ctx[ws[0].ctx_default];
        ctx.save();
        ctx.transform(tf.xsc, tf.ysk, tf.xsk, tf.ysc, tf.xtr, tf.ytr);
        return [s];
      }
    },
    'cb-transform-restore': {
      desc: 'transform it {xsc:1 xsk:0 ysk:0 ysc:1 xtr:0 ytr:0} (sc)ale (sk)ew (tr)anslate',
      definition: function(s, pl, ws) {
        const ctx = ws[0].ctx[ws[0].ctx_default];
        ctx.restore();
        return [s];
      }
    },
    // # usage example for cb-transform
    // canvas_basic_module import
    // canvas cb-init cb-clear
    // [
    //   {color:{r:127 g:127 b:127 a:0.5} x:10  y:30  w:100 h:70} cb-box
    //   {color:{r:127 g:127 b:127 a:0.5} x:70 y:60 w:100 h:70} cb-box
    //   {color:{r:127 g:127 b:127 a:0.5} x:130 y:90 w:100 h:70} cb-box
    // ] {xsc:1 ysc:1 xsk:0 ysk:-0.2 xtr:0 ytr:0} cb-transform
    
    'cb-transform': {
      expects: [{ desc: 'phrase', ofType: 'list' }, { desc: 'a scale skew translate record', ofType: 'record' }], effects: [-2], tests: [], desc: 'apply a transform on a phrase',
      definition: function (s, pl, ws) {
        const tf = s.pop();
        const block = s.pop();
        const ctx = ws[0].ctx[ws[0].ctx_default];
        ctx.save();
        ctx.transform(tf.xsc, tf.ysk, tf.xsk, tf.ysc, tf.xtr, tf.ytr);
        pl = ['cb-transform-restore'].concat(pl);
        if (pounce.isArray(block)) {
          pl = block.concat(pl);
        }
        else {
          pl.unshift(block);
        }
        return [s, pl];
      }
    }
  };

  var exported = { words: cb_words };

  if (typeof require === 'function' && typeof exports === 'object') {
    extend(exports, exported);
  } else {
    var namespace = typeof this !== 'undefined' ? this : window;
    namespace.canvas_basic_module = exported;
  }
})();
