export const globalErrorHandler = (err, req, res, next) => {
  console.error('ERROR LOG', err, new Error(err).stack)
  if (req && req.path) {
    console.error('ERROR LOG CONT.', req.path)
  }
  if (req && req.body) {
    console.error('ERROR LOG CONT.', req.body)
  }
  if (req) {
    console.error('ERROR LOG CONT.', req)
  }
  if (err.status === 502 || err.status === 504) {
    res.status(500)
    res.send('Error Connecting to server. Please try again.')
  } else {
    res.status(err.status || 500)
    res.send(new Error(err).stack) // for now, in development
  }
}
