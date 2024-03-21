import { JSDOM } from 'jsdom'
import type { Course, Job, JobInfo } from '../../utils/decode'
import { CX_API } from '../../api'
import { BasePoint } from './base.point'

const QuestionType = {
  单选题: 0,
  多选题: 1,
  填空题: 2,
  判断题: 3,
  简答题: 4,
  名词解释: 5,
  论述题: 6,
  计算题: 7,
  其它: 8,
  分录题: 9,
  资料题: 10,
  连线题: 11,
  排序题: 13,
  完型填空: 14,
  阅读理解: 15,
  口语题: 18,
  听力题: 19,
  共用选项题: 20,
  测评题: 21,
}
export class WorkPoint extends BasePoint {
  jobInfo: JobInfo
  currentJob!: Job
  pointId: string
  constructor(
    currentCourse: Course,
    JobInfo: JobInfo,
    currentJob: Job,
    pointId: string,
  ) {
    super(currentCourse)
    this.jobInfo = JobInfo
    this.currentJob = currentJob
    this.pointId = pointId
  }

  async fetchALlWork() {
    const fetchALlWorkRawResult = await this.request
      .get(CX_API.GET_JOB_ALL_WORK, {
        searchParams: {
          courseid: this.currentCourse.courseId,
          workid: this.currentJob.workId,
          jobid: this.currentJob.jobid,
          needRedirect: 'true',
          knowledgeid: this.pointId,
          userid: this.currentCourse.uid,
          ut: 's',
          clazzId: this.currentCourse.clazzId,
          cpi: this.currentCourse.cpi,
          ktoken: this.jobInfo.ktoken,
          enc: this.currentJob.enc,
        },
      })
      .text()
    console.log(fetchALlWorkRawResult)
  }

  /**
   * 解析作业
   * @param text
   */
  decodeWork(text: string) { }
}

function decodeWork(text: string) {
  const html = JSDOM.fragment(text)
  const isBlank = html.querySelector('p .blankTips')
  if (isBlank) {
    console.log(isBlank.innerHTML)
    return
  }
  if (html.querySelector('head title')?.textContent!.includes('已批阅')) {
    console.log('已批阅')
    return
  }
  if (html.querySelector('form #form1'))
    console.log('作业未创建完成')

  const title = html.querySelector('h3.py-Title')?.textContent
    ?? html.querySelector('h3.chapter-title')?.textContent
  const work_answer_id = html
    .querySelector('input#workAnswerId')
    ?.getAttribute('value')
  const total_question_num = html
    .querySelector('input#totalQuestionNum')
    ?.getAttribute('value')
  const work_relation_id = html
    .querySelector('input#workRelationId')
    ?.getAttribute('value')
  const full_score = html
    .querySelector('input#fullScore')
    ?.getAttribute('value')
  const enc_work = html.querySelector('input#enc_work')?.getAttribute('value')

  //   const question_nodes = html.querySelectorAll(".Py-mian1");
  //   const questions = Array.from(question_nodes).map((node) => {});
}

function parseQuestion(dom: DocumentFragment) {
  const question = dom.querySelector('input[id^=\'answertype\']')
  const questionId = question?.getAttribute('id')
  const questionType = question?.getAttribute('value')

  const question_value_node = dom.querySelector('div .Py-m1-title')
  const question_value = (question_value_node)?.textContent
  switch (Number(questionType)) {
    case QuestionType.单选题 || QuestionType.多选题:
    //   const options = {}
      const answer = dom
        .querySelector('input .answerInput')?.getAttribute('value') as string
      dom.querySelectorAll('li .more-choose-item').forEach((node) => {
        // const option = (node as any).
        // const optionValue = node.querySelector('input')?.getAttribute('value')
        // options[optionValue] = option;
      })
  }
}

function parseAnsweredQuestion(dom: DocumentFragment) { }
