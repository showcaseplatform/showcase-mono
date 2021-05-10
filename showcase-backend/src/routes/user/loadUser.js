module.exports = (req, res) => {
  console.log('SENDING USER!!!', req.user)
  return res.send({ user: req.user })
}
