//  todo: remove this if really never gets triggered

export const globalErrorHandler = (error: any, req: any, res: any, next: any) => {
  if (error.status === 502 || error.status === 504) {
    res.status(500)
    return res.send('Error Connecting to server. Please try again.')
  } else {
    console.error({ error })
    res.status(error.status || 500)
    return res.send(error.stack || error) // for now, in development
  }
}
