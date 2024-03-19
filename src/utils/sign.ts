import { MD5 } from 'crypto-js'

export function getEnc({
  clazzId,
  userid,
  jobid,
  objectId,
  playingTime,
  duration,
}: any): string {
  const stringToHash = `[${clazzId}][${userid}][${jobid}][${objectId}][${playingTime * 1000}][d_yHJ!$pdA~5][${duration * 1000}][0_${duration}]`
  return MD5(stringToHash).toString()
}

export function encSign(): Record<string, any> {
  const m_time = Date.now()
  const m_token = '4faa8662c59590c6f43ae9fe5b002b42'
  const m_encrypt_str
    = `token=${m_token}&_time=${m_time}&DESKey=Z(AfY@XS`
  const m_inf_enc = MD5(m_encrypt_str).toString()
  return {
    _time: m_time,
    token: '4faa8662c59590c6f43ae9fe5b002b42',
    inf_enc: m_inf_enc,
  }
}
