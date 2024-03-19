import { CX_API } from '../../api'
import type { Course } from '../../utils/decode'
import { ENV } from '../../config/env'
import { getEnc } from '../../utils/sign'
import { generateRandomInteger, sleep } from '../../utils/helper'
import { BasePoint } from './base.point'
import type { Job, JobInfo } from './../../utils/decode'

interface VideoData {
  length: number
  thumbnailsEnc: string
  screenshot: string
  cdn: Array<{
    indexorder: number
    label: string
    url: string
  }>
  dtoken: string
  duration: number
  mp3: string
  download: string
  filename: string
  crc: string
  http: string
  thumbnails: string
  objectid: string
  key: string
  status: string
}

export class VideoTaskPoint extends BasePoint {
  jobInfo: JobInfo
  currentJob!: Job

  constructor(currentCourse: Course, JobInfo: JobInfo, currentJob: Job) {
    super(currentCourse)
    this.jobInfo = JobInfo
    this.currentJob = currentJob
  }

  /**
   * @description 视频
   */
  async doPointVideo() {
    // 延迟
    await sleep(1000 * 3)
    this.request.setHeaders({
      isVideo: true,
    })
    // 获取视频信息
    const resultVideo = await this.request
      .get(`${CX_API.GET_VIDEO_POINT}${this.currentJob.objectid}`, {
        searchParams: {
          k: this.jobInfo.fid,
          flag: 'normal',
          _dc: Date.now(),
        },
        headers: ENV.VIDEO_HEADERS,
      })
      .json<VideoData>()
    if (resultVideo.status === 'success') {
      const { dtoken, duration } = resultVideo
      let isPassed = false
      let isFinished = false
      let playingTime = 0
      let wait_time = 0
      while (!isPassed) {
        if (isFinished) {
          playingTime = duration
          isPassed = await this.videoProgressLog(
            dtoken,
            duration,
            playingTime,
            this.currentJob.type,
          )
        }
        if (isPassed)
          break

        wait_time = generateRandomInteger(30, 90)
        if (playingTime + wait_time >= Number(duration)) {
          wait_time = Number(duration) - playingTime
          isFinished = true
        }
        playingTime += wait_time
        console.log(`等待${wait_time}秒后继续`)
        await sleep(wait_time * 1000)
      }
    }
  }

  /**
   * @description 上传视频进度
   * @param dtoken
   * @param duration
   * @param playingTime
   * @param type
   */
  async videoProgressLog(
    dtoken: string,
    duration: number,
    playingTime: number,
    type: string = 'Video',
  ) {
    const submitInfo: Record<string, string> = {}
    submitInfo.otherInfo = String(this.currentJob.otherinfo).substring(
      0,
      String(this.currentJob.otherinfo).lastIndexOf('&'),
    )
    submitInfo.courseId = this.currentCourse.courseId
    const videoProgress = await this.request
      .get(`${CX_API.VIDEO_PROGRESS_LOG}/${this.currentCourse.cpi}/${dtoken}`, {
        searchParams: {
          ...submitInfo,
          clazzId: this.currentCourse.clazzId,
          playingTime,
          duration,
          clipTime: `0_${duration}`,
          objectId: this.currentJob.objectid,

          jobid: this.currentJob.jobid,
          userid: this.currentCourse.uid,
          isdrag: '0',
          view: 'pc',
          enc: getEnc({
            clazzId: this.currentCourse.clazzId,
            userid: this.currentCourse.uid,
            jobid: this.currentJob.jobid,
            objectId: this.currentJob.objectid!,
            playingTime,
            duration: Number(duration),
          }),
          rt: this.currentJob.rt ?? '0.9',
          dtype: type === 'video' ? 'Video' : 'Audio',
          _t: Date.now(),
        },
        headers: type === 'video' ? ENV.VIDEO_HEADERS : ENV.AUDIO_HEADERS,
      })
      .json<{ isPassed: boolean }>()

    return videoProgress.isPassed
  }
}
