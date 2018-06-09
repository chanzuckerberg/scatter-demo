module.exports = function (count) {
  return Array(count).fill().map(function () {
    return [
      (Math.random() * 10) - 5,
      (Math.random() * 10) - 5
    ]
  })
}