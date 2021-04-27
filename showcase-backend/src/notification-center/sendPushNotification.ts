import { IPushNotifcationData } from '../types/notificaton'

import axios from 'axios'
import { expo as expoServerUrl } from '../config'

export const sendPushNotification = async (
  to: string,
  title: string,
  body: string,
  data: IPushNotifcationData
) => {
  const message = {
    to,
    sound: 'default',
    title,
    body,
    data,
    _displayInForeground: true,
  }

  try {
    const response = await axios({
      url: expoServerUrl,
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      data: message,
    })
    console.log('SENT NOTIFICATION', response)
    return true
  } catch (error) {
    console.log('ERR SENDING NOTIFICATION', error)
    return true
  }
}
