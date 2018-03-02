const css = require('dom-css')
const mat4 = require('gl-mat4')
const fit = require('canvas-fit')

// setup canvas and camera
const canvas = document.body.appendChild(document.createElement('canvas'))
const regl = require('regl')(canvas)
const camera = require('./camera.js')(canvas, {scale: true, rotate: false})
window.addEventListener('resize', fit(canvas), false)

// import draw functions
const drawPoints = require('./draw/points')(regl)

// import data generators
const generatePoints = require('./data/points')
const generateColors = require('./data/colors')

// set constants
const count = 1e5

// preallocate buffers
const pointBuffer = regl.buffer(count)(generatePoints(count))
const colorBuffer = regl.buffer(count)(generateColors(count))
  
// update on spacebar
document.body.onkeyup = function(e){
  if (e.keyCode == 32){
    pointBuffer(generatePoints(count))
    colorBuffer(generateColors(count))
  }
}

regl.frame(({viewportWidth, viewportHeight, time}) => {

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
    scale: viewportHeight/viewportWidth
  })
  
  camera.tick()
})
