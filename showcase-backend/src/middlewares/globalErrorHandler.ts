import Boom from 'boom'

const handleBoomError = (error: Boom, res: any) => {
  const { data } = error
  const { statusCode, error: boomError, message } = error.output.payload
  console.log('handleBoomError')
  if (boomError === 'Not Found' || statusCode === 404) {
    res.status(statusCode).send(data)
  } else {
    res.send(error)
  }
}

export const globalErrorHandler = (error: any, req: any, res: any, next: any) => {
  console.error('ERROR LOG', error.stack)
  if (req && req.path) {
    console.error('ERROR LOG CONT.', req.path)
  }
  if (req && req.body) {
    console.error('ERROR LOG CONT.', req.body)
  }
  if (req) {
    console.error('ERROR LOG CONT.', req)
  }
  if (error.status === 502 || error.status === 504) {
    res.status(500)
    return res.send('Error Connecting to server. Please try again.')
  } else if (error.isBoom) {
    handleBoomError(error, res)
  } else {
    res.status(error.status || 500)
    return res.send(error.stack) // for now, in development
  }
}
