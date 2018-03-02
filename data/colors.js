module.exports = function (count) {
  return Array(count).fill().map(function () {
    return [
      Math.random(), 
      Math.random(),
      Math.random()
    ]
  }) 
}