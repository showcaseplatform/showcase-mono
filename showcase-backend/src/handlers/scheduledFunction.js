const updateCurrencyRates = async (db, rates) => {
  try {
    await db.collection('currencyrates').doc('rates').set(rates)
    console.log('Updated currency rates data')
    return true
  } catch (error) {
    console.log('ERR UPDATING CURRENCY', error)
    return true
  }
}

exports.scheduledFunctionHandler = async (client, db, context) => {
  console.log('CALLED SCHEDULED FUNCTION')
  try {
    const response = await client.get(
      'https://openexchangerates.org/api/latest.json?app_id=c5e771e507934e40a423df403e54d0ae'
    )
    if (response.data.rates) {
        await updateCurrencyRates(db, response.data.rates)
    } else {
      console.error('ERROR cannot get currency prices')
      return true
    }
  } catch (error) {
    console.error('ERROR cannot get currency prices 1', error)
    return true
  }
}

// FUNCTION BEFORE REFACTORING:

// exports.scheduledFunctionHandler = async (client, db, context) => {
//   console.log('CALLED SCHEDULED FUNCTION')
//   return client
//     .get('https://openexchangerates.org/api/latest.json?app_id=c5e771e507934e40a423df403e54d0ae')
//     .then((res) => {
//       if (res.data.rates) {
//         return db
//           .collection('currencyrates')
//           .doc('rates')
//           .set(res.data.rates)
//           .then((docRef) => {
//             console.log('Updated currency rates data')
//             return Promise.resolve(true)
//           })
//           .catch((err) => {
//             console.log('ERR UPDATING CURRENCY', err)
//             return Promise.resolve(true)
//           })
//       } else {
//         console.error('ERROR cannot get currency prices')
//         return true
//       }
//     })
//     .catch((e) => {
//       console.error('ERROR cannot get currency prices 1', e)
//       return true
//     })
// }
