import got, { type Got, type OptionsOfTextResponseBody } from 'got'
import { CookieJar } from 'tough-cookie'
import { ENV } from '../config/env'

class Request {
  got: Got
  jar: CookieJar
  constructor(proxy = true) {
    this.jar = new CookieJar()
    this.got = got.extend({
      cookieJar: this.jar,
      timeout: 30000,
      https: {
        rejectUnauthorized: false,
      },
      retry: {
        limit: 3,
        statusCodes: [503, 502, 401, 406],
        errorCodes: ['ETIMEDOUT', 'ECONNRESET'],
        calculateDelay: ({ computedValue }) => computedValue,
      },
      headers: ENV.HEADERS,

      hooks: {
        beforeRequest: [
          (options) => {
            // if (process.env.NODE_ENV === 'production') {
            options.agent = proxy
              ? {
                  // https: new ProxyAgent(PROXY_URL),
                }
              : {}
            // }
          },
        ],
        beforeError: [
          (error) => {
            if (error.response?.statusCode === 403) {
              // 401 错误
              console.log(error)
            }
            return error
          },
        ],
      },
    })
    this.setHeaders({})
  }

  get<T>(url: string, options: OptionsOfTextResponseBody) {
    return this.got.get<T>(url, options as any)
  }

  post<T>(url: string, options: OptionsOfTextResponseBody) {
    return this.got.post<T>(url, options as any)
  }

  setHeaders({
		isVideo,
		isAudio,
	}: { isVideo?: boolean, isAudio?: boolean } = {}) {
    if (isVideo) {
      this.got.mergeOptions({
        headers: ENV.VIDEO_HEADERS,
      })
    }
    else if (isAudio) {
      this.got.mergeOptions({
        headers: ENV.AUDIO_HEADERS,
      })
    }
    this.got.mergeOptions({
      headers: ENV.HEADERS,
    })
  }
}
export default new Request()
