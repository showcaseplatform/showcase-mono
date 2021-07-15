// import { gql } from 'apollo-server-express'
// import { mockUser } from '../../test/testHelpers'

// const ADD_PAYMENT_INFO = gql`
//   mutation addPaymentInfo($idToken: String!, $lastFourCardDigit: String!) {
//     addPaymentInfo(idToken: $idToken, lastFourCardDigit: $lastFourCardDigit) {
//       id
//       type
//     }
//   }
// `

// const createMockBasicUser = async () => {

// }


// describe('Create user test cases', () => {
//     it.only('findOrCreateUser should create a new user if user doesnt exists', async () => {
//       const dummyPhone = '+36709788821'
  
//       mockUser(dummyPhone)
  
//       const user = await AuthLib.createNewUser(dummyPhone, '36')
//       expect(user.phone).toEqual(dummyPhone)
//     })
//   })
  