import JSEncrypt from 'JSEncrypt'

// rsa 加密公钥
const RSA_PUBLIC_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCAmXKvdTfej/RK4WyLk3xE2VxeRo74nEmnH4e8+Swy/mgQ7kK1raIMdcfL0AH7CnbqH29PMGgu2gnvnROe13vNI4oUlXOGyx1lJeFpPdgiw9yrwf7QxJ14Me+84VVLNSpkETINKyePILXAxzc2TbE6G1Ii4zJk43rufbILHWR7BQIDAQAB'

const encryptor = new JSEncrypt()

encryptor.setPublicKey(RSA_PUBLIC_KEY)

export const JSEncryptEncrypt = str => encryptor.encrypt(str)
