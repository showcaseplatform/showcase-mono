module.exports = (req, res) => {
  console.log('SENDING USER!!!', req.user.data())
  return res.send({ user: req.user.data() })
}
