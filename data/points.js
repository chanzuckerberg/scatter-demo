module.exports = function (count) {
  return Array(count).fill().map(function () {
    return [
      Math.random() - 0.5,
      Math.random() - 0.5
    ]
  })
}