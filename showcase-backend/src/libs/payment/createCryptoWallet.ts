import bip39 from 'bip39'
// todo: is ok to import dev depenency here like this?
// import '@machinomy/types-ethereumjs-wallet'
// import hdkey from 'ethereumjs-wallet/hdkey'
import crypto from 'crypto'
import { User } from '@generated/type-graphql'
import { CreateCryptoWalletInput } from './types/createCryptoWallet.type'
import prisma from '../../services/prisma'

//creates crypto wallet for nft storage
export const createCryptoWallet = async (input: CreateCryptoWalletInput, user: User) => {
  // todo: maybe not a good idea to send password without hashing
  const { password, hint } = input

  // // check auth
  // // check for wallet existing
  // // if not wallet continue
  // //console.log("CREATING WALLET", req.user);

  // const mnemonic = bip39.generateMnemonic()
  // const seed = bip39.mnemonicToSeedSync(mnemonic)
  // const hdwallet = hdkey.fromMasterSeed(seed)
  // const wallet_hdpath = "m/44'/60'/0'/0/"
  // const newwallet = hdwallet.derivePath(wallet_hdpath + 0).getWallet()
  // const addr = newwallet.getAddressString() //wallet.getAddress().toString('hex');
  // const pubKey = newwallet.getPublicKeyString()
  // const privKey = newwallet.getPrivateKeyString()
  // const privKeyString = newwallet.getPrivateKeyString()
  // const wallet = {
  //   address: addr,
  //   publicKey: pubKey,
  //   privateKey: privKey,
  //   mnemonic: mnemonic,
  // }

  // //console.log("TYPES", typeof privKey, typeof mnemonic)

  // const algorithm = 'aes256' //'aes-256-cbc';

  // const ivPrivateKey = crypto.randomBytes(128).toString('hex').slice(0, 16)
  // const ivMnemonic = crypto.randomBytes(128).toString('hex').slice(0, 16)

  // const encryptionKeyHash = crypto.createHash('sha256').update(password).digest()

  // //console.log("Key", encryptionKeyHash.toString('hex'))

  // const cipherPrivateKey = crypto.createCipheriv(algorithm, encryptionKeyHash, ivPrivateKey)
  // const cipherMnemonic = crypto.createCipheriv(algorithm, encryptionKeyHash, ivMnemonic)

  // const encryptedPrivateKey =
  //   cipherPrivateKey.update(privKey, 'utf8', 'hex') + cipherPrivateKey.final('hex')
  // const encryptedMnemonic =
  //   cipherMnemonic.update(mnemonic, 'utf8', 'hex') + cipherMnemonic.final('hex')

  // console.log('encrypted', encryptedMnemonic, encryptedPrivateKey)

  // console.log('USER', user)

  // await prisma.crypto.create({
  //   data: {
  //     id: user.id,
  //     address: addr,
  //     publicKey: pubKey,
  //     encryptedPrivateKey: encryptedPrivateKey,
  //     encryptedMnemonic: encryptedMnemonic,
  //     ivPrivateKey: ivPrivateKey,
  //     ivMnemonic: ivMnemonic,
  //     passwordHint: hint,
  //   },
  // })

  // todo: remove this once implemented
  return 'This function is not implemented yet'
}
