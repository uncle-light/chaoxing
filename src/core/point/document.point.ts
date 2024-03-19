import type { Course, Job, JobInfo } from '../../utils/decode'
import { CX_API } from '../../api'
import { BasePoint } from './base.point'

export class DocumentTaskPoint extends BasePoint {
  jobInfo: JobInfo
  currentJob!: Job

  constructor(currentCourse: Course, JobInfo: JobInfo, currentJob: Job) {
    super(currentCourse)
    this.jobInfo = JobInfo
    this.currentJob = currentJob
  }

  /**
   * @description 文档
   */
  async doPointDocument() {
    this.request.setHeaders({})
    const regex = /nodeId_(.*?)-/
    const match = this.currentJob.otherinfo.match(regex)
    const resultNodeId_ = match ? match[1] : null
    await this.request
      .get(`${CX_API.DOCUMENT_PROGRESS_LOG}`, {
        searchParams: {
          jobid: this.currentJob.jobid,
          fid: this.jobInfo.fid,
          knowledgeid: resultNodeId_,
          courseid: this.currentCourse.courseId,
          clazzid: this.currentCourse.clazzId,
          jtoken: this.currentJob.jtoken,
          _dc: Date.now(),
        },
      })
      .json()
  }
}
