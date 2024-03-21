import { JSDOM } from 'jsdom'

export interface Course {
  id: string
  info: string
  roleid: string
  clazzId: string
  courseId: string
  cpi: string
  title: string
  desc: string
  teacher: string
  uid: string
}

export interface Job {
  type: 'video' | 'document' | 'workid'
  jobid: string
  name?: string
  otherinfo: any
  mid?: string
  objectid?: string
  aid?: string
  jtoken?: string
  enc?: string
  rt: string
  workId?: string
}

export interface JobInfo {
  ktoken: string
  mtEnc: string
  reportTimeInterval: number
  defenc: string
  cardid: string
  cpi: string
  fid: string
  qnenc: string
}

/**
 * 解码课程列表
 * @param text
 */
export function decodeCourseList(text: string) {
  const html = JSDOM.fragment(text)
  const courseListHtml = html.querySelectorAll('div .course')
  const courseList: Course[] = []
  courseListHtml.forEach((course: Element) => {
    if (!course.querySelector('.not-open-tip')) {
      const course_detail: Record<string, any> = {}
      course_detail.id = course.getAttribute('id')
      course_detail.info = course.getAttribute('info')
      course_detail.roleid = course.getAttribute('roleId')
      course_detail.clazzId = course
        .querySelector('.clazzId')
        ?.getAttribute('value')
      course_detail.courseId = course
        .querySelector('.courseId')
        ?.getAttribute('value')
      course_detail.cpi = course
        .querySelector('.curPersonId')
        ?.getAttribute('value')
      course_detail.title = course
        .querySelector('.course-name')
        ?.getAttribute('title')
      course_detail.desc = course
        .querySelector('.margint10')
        ?.getAttribute('title')
      course_detail.teacher = course
        .querySelector('.color3')
        ?.getAttribute('title')
      courseList.push(course_detail as any)
    }
  })
  return courseList
}

/**
 * 解码课程列表文件夹
 */
export function decodeCourseListFolder(text: string) {
  const html = JSDOM.fragment(text)
  const courseListHtml = html.querySelectorAll('.file-list li')
  const courseList: Array<{ id: string, rename: string }> = []
  courseListHtml.forEach((course: Element) => {
    if (course.getAttribute('fileid')) {
      const courseRaw: Record<string, string> = {}
      courseRaw.id = course.getAttribute('fileid')!
      courseRaw.rename = course
        .querySelector('.rename-input')
        ?.getAttribute('value') as string
      courseList.push(courseRaw as any)
    }
  })
  return courseList
}

/*
 * 解码课程章节
 */
export function decodeCoursePoint(text: string) {
  const html = JSDOM.fragment(text)
  const coursePointHtml = html.querySelectorAll('.chapter_item')
  const coursePoint: Array<{ id: string, title: string, jobCount: number }>
    = []
  coursePointHtml.forEach((course: Element) => {
    if (course.getAttribute('id') || course.getAttribute('title')) {
      const courseRaw: Record<string, any> = {}
      const _pointId = course.getAttribute('id')!
      const match = /^cur(\d{1,20})$/.exec(_pointId)
      const result = match ? match[1] : null
      courseRaw.id = result
      courseRaw.title
        = course.querySelector('.catalog_sbar')?.textContent!.trim() as string
        + course.getAttribute('title') as string
      courseRaw.jobCount = 0
      if (course.querySelector('.knowledgeJobCount')) {
        courseRaw.jobCount = Number.parseInt(
          course.querySelector('.knowledgeJobCount')?.getAttribute('value') as string,
        )
      }
      coursePoint.push(courseRaw as any)
    }
  })
  return coursePoint
}

export function decodeJobList(text: string) {
  const _temp = text.match(/window.AttachmentSetting.*?};/g)
  if (!_temp) {
    return {
      jobList: [],
      jobInfo: {},
    }
  }
  const _cards = JSON.parse(
    _temp[0].replace(/window.AttachmentSetting =/g, '').replace(';', ''),
  )
  const _job_info: JobInfo = {
    ktoken: _cards.defaults.ktoken,
    mtEnc: _cards.defaults.mtEnc,
    reportTimeInterval: _cards.defaults.reportTimeInterval,
    defenc: _cards.defaults.defenc,
    cardid: _cards.defaults.cardid,
    fid: _cards.defaults.fid,
    cpi: _cards.defaults.cpi,
    qnenc: _cards.defaults.qnenc,

  }
  const _job_list: Job[] = []
  for (const _card of _cards.attachments) {
    // 过滤掉已经完成的任务和非开放任务
    // TODO 未完成的任务
    if (_card.isPassed === true || _card.job === false) {
      continue;
    }
    const _job: Job = {
      type: _card.type,
      jobid: _card.jobid,
      otherinfo: _card.otherInfo,
      rt: _card.rt,
    }
    if (_card.type === 'video') {
      _job.name = _card.property.name
      if (!_card.mid)
        continue

      _job.mid = _card.mid
      _job.objectid = _card.objectId
      _job.aid = _card.aid
    }
    else if (_card.type === 'document') {
      _job.jtoken = _card.jtoken
      _job.mid = _card.mid
      _job.enc = _card.enc
      _job.aid = _card.aid
      _job.objectid = _card.property.objectid
    }
    else if (_card.type === 'workid') {
      _job.workId = _card.property.workid
      _job.enc = _card.enc
    }
    _job_list.push(_job)
  }
  return {
    jobList: _job_list,
    jobInfo: _job_info,
  } as {
    jobList: Job[]
    jobInfo: JobInfo
  }
}

export function decodePointInfo(text: string) {
  const html = JSDOM.fragment(text)
  let data = html.querySelector('iframe')?.getAttribute('data')
  const module = html.querySelector('iframe')?.getAttribute('module')
  if (data)
    data = JSON.parse(data)

  return {
    module,
    data,
  }
}
