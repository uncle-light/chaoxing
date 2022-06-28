import * as CryptoJS from 'crypto-js'

/**
 * 加密
 * @param message 
 * @returns 
 */
export const encryptByDES = (message: string) => {
    let keyHex = CryptoJS.enc.Utf8.parse('u2oh6Vu^HWe40fj');
    let encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString();
}

export const get_enc_time = () => {
    const m_time = String(Date.now())
    const m_token = '4faa8662c59590c6f43ae9fe5b002b42'
    const m_encrypt_str = 'token=' + m_token + '&_time=' + m_time + '&DESKey=Z(AfY@XS'
    const m_inf_enc = CryptoJS.MD5(m_encrypt_str).toString()
    return { m_time, m_inf_enc }
}

export const sleep = (_time = 1000*2) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('')
        }, _time)
    })
}


       