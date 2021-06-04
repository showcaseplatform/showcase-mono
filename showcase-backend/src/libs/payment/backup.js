import { createHash, createDecipheriv } from 'crypto'

export const backupMnemonicPhrase = (req, res) => {
  const { user } = req

  const { password } = req.body

  const algorithm = 'aes256'

  const encryptionKeyHash = createHash('sha256').update(password).digest()

  //const decipherPrivateKey = crypto.createDecipheriv(algorithm, encryptionKeyHash, ivPrivateKey);
  const decipherMnemonic = createDecipheriv(
    algorithm,
    encryptionKeyHash,
    user.crypto.ivMnemonic
  )

  //var decryptedPrivateKey = decipherPrivateKey.update(encryptedPrivateKey, 'hex', 'utf8') + decipherPrivateKey.final('utf8');
  var decryptedMnemonic =
    decipherMnemonic.update(user.crypto.encryptedMnemonic, 'hex', 'utf8') +
    decipherMnemonic.final('utf8')
  //console.log("decrypted", decryptedMnemonic, decryptedPrivateKey);
  res.send({ mnemonic: decryptedMnemonic })
}
