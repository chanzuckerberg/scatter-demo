module.exports = function (regl) {
  return regl({
    vert: `
    precision mediump float;
    attribute vec2 position;
    attribute vec3 color;
    uniform float distance;
    uniform mat4 projection, view;
    varying vec3 fragColor;
    void main() {
      gl_PointSize = 30.0 / pow(distance, 2.5);
      gl_Position = projection * view * vec4(position.x, position.y, 0, 1);
      fragColor = vec3(position.x * 2.0, position.y * 2.0, 1);
    }`,

    frag: `
    precision mediump float;
    varying vec3 fragColor;
    void main() {
      if (length(gl_PointCoord.xy - 0.5) > 0.5) {
        discard;
      }
      gl_FragColor = vec4(fragColor, 1);
    }`,

    attributes: {
      position: regl.prop('position'),
      color: regl.prop('color')
    },

    uniforms: {
      distance: regl.prop('distance'),
      view: regl.prop('view'),
      projection: regl.prop('projection')
    },

    count: regl.prop('count'),

    primitive: 'points'
  })
}