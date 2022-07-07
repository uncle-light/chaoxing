import * as CryptoJS from 'crypto-js'
import axios from "axios";
import {data} from "cheerio/lib/api/attributes";

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


export function getQuestionType(title: string):number|null{
    switch (title) {
        case "单选题": {
            return 1;
        }
        case "多选题": {
            return 2;
        }
        case "判断题": {
            return 3;
        }
        case "填空题": {
            return 4;
        }
        default: {
            return null;
        }
    }
}


export function getQuestionTypeBySubmit(title: string):number|null{
    switch (title) {
        case "单选题": {
            return 0;
        }
        case "多选题": {
            return 1;
        }
        case "判断题": {
            return 3;
        }
        case "填空题": {
            return 2;
        }
        default: {
            return null;
        }
    }
}

/**
 * 取中间文本
 * @param str
 * @param left
 * @param right
 */
export function substrex(str: string, left: string, right: string) {
    const leftPos = str.indexOf(left) + left.length;
    const rightPos = str.indexOf(right, leftPos);
    return str.substring(leftPos, rightPos);
}

export function substrR(str: string,findTxt:string ) {
    return  str.substring(str.indexOf(findTxt)+1,str.length) ;
}

export async function  submitQuestion(data:any){
    /**
     * 是否采集
     */
    return
    const result= await axios.post('xxxx',data)
    if(result.data.data===true){
        console.log('采集成功')
    }else {
        console.log('采集失败')
    }
}


       