const css = require('dom-css')
const mat4 = require('gl-mat4')
const fit = require('canvas-fit')

// setup canvas and camera
const canvas = document.body.appendChild(document.createElement('canvas'))
css(canvas, {zIndex: -1000})
const regl = require('regl')(canvas)
const camera = require('./camera.js')(canvas, {scale: true, rotate: false})
window.addEventListener('resize', fit(canvas), false)

// create a state variable
var state = 'rendering'

// add button
const button = document.createElement('button')
button.innerHTML = 'start/stop'
css(button, {'font-family': 'monospace', 'text-align': 'left', 'font-size': '32px',
  'background': 'white', 'border': '2px solid'})
document.body.appendChild(button)

// add state
const div = document.createElement('div')
div.innerHTML = 'state: ' + state
css(div, {'font-family': 'monospace', 'text-align': 'left', 'font-size': '32px', 
  'background': 'white', 'width': 'fit-content', 'border': '2px solid', 'padding': '3px', 'margin-top': '5px', 'padding-left': '6px', 'padding-right': '6px'})
document.body.appendChild(div)

// import draw functions
const drawPoints = require('./draw/points')(regl)

// import data generators
const generatePoints = require('./data/points')
const generateColors = require('./data/colors')

// set constants
const count = 9e3

// preallocate buffers
const pointBuffer = regl.buffer(count)(generatePoints(count))
const colorBuffer = regl.buffer(count)(generateColors(count))
  
// update data on spacebar
document.body.onkeyup = function(e){
  if (e.keyCode == 32){
    pointBuffer(generatePoints(count))
    colorBuffer(generateColors(count))
  }
  // make sure we redraw even if rendering is paused
  if (state == 'paused') {
    regl._refresh()  
    draw()
  }
}

// define a draw function to wrap clearing and drawing
function draw () {

  regl.clear({
    depth: 1,
    color: [1, 1, 1, 1]
  })

  drawPoints({
    distance: camera.distance, 
    color: colorBuffer,
    position: pointBuffer,
    count: count,
    view: camera.view(),
    projection: mat4.perspective([],
      Math.PI / 2,
      1440 / 552,
      0.01, 1000),
  }) 
}

// start rendering
var render = regl.frame(({viewportWidth, viewportHeight, time, tick}) => {
  camera.tick()
  draw()
})

// handle starting and stopping on button click
button.onclick = function () {
  if (state == 'rendering') {
    render.cancel()
    regl._refresh()  
    draw()
    state = 'paused'
  } else if (state == 'paused') {
    render = regl.frame(({viewportWidth, viewportHeight, time, tick}) => {
      camera.tick()
      draw()
    })
    state = 'rendering'
  }
  div.innerHTML = 'state: ' + state
}