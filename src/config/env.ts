// 全局环境
const randomUserAgent = `Dalvik/2.1.0 (Linux; U; Android ${Math.round(
	Math.random() * (11 - 8) + 8,
)}; MI${Math.round(
	Math.random() * (12 - 10) + 10,
)} Build/SKQ1.210216.001) (device:MI${Math.round(
	Math.random() * (12 - 10) + 10,
)}) Language/zh_CN com.chaoxing.mobile/ChaoXingStudy_3_5.1.4_android_phone_614_74`
export const ENV = {
  AESKey: 'u2oh6Vu^HWe4_AES',
  HEADERS: {
    'User-Agent': randomUserAgent,
    'Sec-Ch-Ua':
      '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
  },
  COOKIES_PATH: 'cookies.txt',
  VIDEO_HEADERS: {
    'User-Agent': randomUserAgent,
    'Referer':
      'https://mooc1.chaoxing.com/ananas/modules/video/index.html?v=2023-1110-1610',
    'Host': 'mooc1.chaoxing.com',
  },
  AUDIO_HEADERS: {
    'User-Agent': randomUserAgent,
    'Referer':
      'https://mooc1.chaoxing.com/ananas/modules/audio/index_new.html?v=2023-0428-1705',
    'Host': 'mooc1.chaoxing.com',
  },
  THRESHOLD: 3,
  TASK_WAIT_TIME: 15,
  USER: '',
  PASSWORD: '',
}
