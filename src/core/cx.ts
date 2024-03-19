import { DES, enc, mode, pad } from 'crypto-js'
import { CX_API } from '../api'
import Request from '../utils/request'
import { ENV } from '../config/env'
import { type Course, decodeCourseList } from '../utils/decode'

export class Cx {
  /**
   * @description 用户名
   */
  private readonly username!: string
  /**
   * @description 密码
   */
  private readonly password!: string
  /**
   * @description 速度
   */
  private readonly logger = console
  private readonly request!: typeof Request
  private readonly speed: number = 1
  private readonly fid: string = ''
  public currentCourse!: Course
  constructor({
    username,
		password,
		speed,
  }: {
    username: string
    password: string
    speed?: number
  }) {
    this.username = username
    this.password = password
    if (this.speed < 1)
      this.speed = speed!

    this.request = Request
  }

  /**
   * 加密算法
   * @param message
   * @returns
   */
  encryptByDESModeEBC(message: string) {
    const keyHex = enc.Utf8.parse(ENV.AESKey)
    const encrypted = DES.encrypt(message, keyHex, {
      mode: mode.ECB,
      padding: pad.Pkcs7,
    })
    return encrypted.ciphertext.toString()
  }

  /**
   * @description 登录
   */
  async login() {
    const loginResult = await this.request
      .post(CX_API.LOGIN, {
        form: {
          uname: this.encryptByDESModeEBC(this.username),
          password: this.encryptByDESModeEBC(this.password),
          refer: 'https%3A%2F%2Fi.chaoxing.com',
          t: true,
          forbidotherlogin: 0,
          validate: '',
          doubleFactorLogin: 0,
          independentId: 0,
        },
      })
      .json<{ status: boolean, msg2: string }>()
    if (loginResult.status) {
      this.logger.log('登录成功')
      return {
        status: true,
        msg: '登录成功',
      }
    }
    else {
      this.logger.error('登录失败: ', loginResult.msg2)
      return {
        status: false,
        msg: loginResult.msg2,
      }
    }
  }

  /**
   * @description 获取课程列表
   */
  async getCourseById(courseFolderId = 0) {
    const courseListRaw = await this.request
      .post(CX_API.GET_COURSE_LIST, {
        form: {
          courseType: 1,
          courseFolderId,
          query: '',
          superstarClass: 0,
        },
      })
      .text()
    return decodeCourseList(courseListRaw)
  }

  /**
   * @description 获取课程列表
   */
  async getCourseList() {
    // 获取课程列表
    const courseList = await this.getCourseById()
    // 获取文件夹课程
    const folderLIstRaw = await this.request
      .get(CX_API.GET_COURSE_LIST_FOLDER, {})
      .text()
    const folderList = decodeCourseList(folderLIstRaw)
    for (const folder of folderList) {
      const courseItem = await this.getCourseById(Number.parseInt(folder.id))
      courseList.push(...courseItem)
    }
    return courseList
  }

  getUid() {
    return this.request.jar
      .serializeSync()
      .cookies.find(i => i.key === '_uid')?.value
  }
}
