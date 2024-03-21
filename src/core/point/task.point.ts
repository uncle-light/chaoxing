import {
  type Course,
  type Job,
  type JobInfo,
  decodeCoursePoint,
  decodeJobList,
  decodePointInfo,
} from '../../utils/decode'
import { CX_API } from '../../api'
import { sleep } from '../../utils/helper'
import { ENV } from '../../config/env'
import { encSign } from '../../utils/sign'
import { BasePoint } from './base.point'
import { VideoTaskPoint } from './video.point'
import { DocumentTaskPoint } from './document.point'
import { WorkPoint } from './work.point'

export class TaskPoint extends BasePoint {
  constructor(currentCourse: Course) {
    super(currentCourse)
  }

  /**
   * @description 获取课程章节
   * @param courseId
   * @param clazzId
   * @param cpi
   */
  async getCoursePoint(courseId: string, clazzId: string, cpi: string) {
    const coursePointRaw = await this.request
      .get(CX_API.GET_COURSE_POINT, {
        searchParams: {
          courseid: courseId,
          clazzid: clazzId,
          cpi,
        },
      })
      .text()
    return decodeCoursePoint(coursePointRaw)
  }

  /**
   * @description 处理章节任务点
   * @param pointId
   * @param tabIndex
   */
  async doPoint(pointId: string, tabIndex: number) {
    const resultPointRaw = await this.request
      .get(CX_API.GET_JOB_LIST, {
        searchParams: {
          clazzid: this.currentCourse.clazzId,
          courseid: this.currentCourse.courseId,
          knowledgeid: pointId,
          num: tabIndex,
          isPhone: 1,
          control: true,
          cpi: this.currentCourse.cpi,
        },
      })
      .text()
    const { jobList, jobInfo } = decodeJobList(resultPointRaw)
    for (const job of jobList) {
      await sleep(ENV.TASK_WAIT_TIME * 1000)
      switch (job.type) {
        case 'video':
          await this.doPointVideo(job, jobInfo as JobInfo)
          break
        case 'document':
          await this.doPointDocument(job, jobInfo as JobInfo)
          break
        case 'workid':
          // await this.doPointWork(pointId, job, jobInfo as JobInfo)
          break
        default:
          break
      }
    }
  }

  /**
   * @description 处理章节任务
   * @param pointId
   */
  async doPointTask(pointId: string) {
    const { data: tabPoint } = await this.getPoints(pointId)

    for (const point of tabPoint) {
      for (const pointIndex in point.card.data) {
        // 过滤
        if (!point.card.data[pointIndex]?.description)
          continue
         // 获取章节信息
        const { data, module } = decodePointInfo(
          point.card.data[pointIndex]?.description,
        )
        if (module) {
          await this.doPoint(
            point.id as unknown as string,
            Number.parseInt(pointIndex),
          )
        }
      }
    }
  }

  /**
   * @description 获取章节tab
   * @param id
   */
  async getPoints(id: string) {
    return await this.request
      .get(CX_API.GET_CHAPTER_CARDS, {
        searchParams: {
          id,
          courseid: this.currentCourse.courseId,
          view: 'json',
          _time: Date.now(),
          token: '4faa8662c59590c6f43ae9fe5b002b42',
          fields:
            'id,parentnodeid,indexorder,label,layer,name,begintime,createtime,lastmodifytime,status,jobUnfinishedCount,clickcount,openlock,card.fields(id,knowledgeid,title,knowledgeTitile,description,cardorder).contentcard(all)',
          ...encSign(),
        },
      })
      .json<{
        data: Array<{
          clickcount: number
          createtime: number
          openlock: number
          indexorder: number
          name: string
          lastmodifytime: number
          id: number
          label: string
          layer: number
          card: {
            data: Array<{
              knowledgeid: number
              description: string
              id: number
              cardorder: number
              title: string
            }>
          }
          parentnodeid: number
          status: string
        }>
      }>()
  }

  /**
   * @description 处理文档
   * @param job
   * @param jobInfo
   */
  async doPointDocument(job: Job, jobInfo: JobInfo) {
    const documentPointTask = new DocumentTaskPoint(
      this.currentCourse,
      jobInfo,
      job,
    )
    await documentPointTask.doPointDocument()
  }

  async doPointAudio() {}

  async doPointTest() {}

  /**
   * @description 处理视频
   * @param job
   * @param jobInfo
   */
  async doPointVideo(job: Job, jobInfo: JobInfo) {
    const videoPointTask = new VideoTaskPoint(this.currentCourse, jobInfo, job)
    try {
      await videoPointTask.doPointVideo()
    }
    catch (e) {
      // 重试一次 使用音频模式
      videoPointTask.currentJob.type = 'audio' as any
      await videoPointTask.doPointVideo()
    }
  }

  /**
   * @description 处理作业测试
   */
  async doPointWork(pointId: string, job: Job, jobInfo: JobInfo) {
    const workPointTask = new WorkPoint(
      this.currentCourse,
      jobInfo,
      job,
      pointId,
    )
    await workPointTask.fetchALlWork()
  }
}
