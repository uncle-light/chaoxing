import {
    encryptByDES,
    get_enc_time,
    getQuestionType,
    getQuestionTypeBySubmit,
    sleep, submitQuestion,
    substrex,
    substrR
} from '../utils'
import {nanoid} from "nanoid";
import {stringify} from 'qs'
import * as CryptoJS from 'crypto-js'
import * as cliProgress from 'cli-progress'
import {to} from 'await-to-js'
import cheerio from 'cheerio'
import Question from './question'

import {CheerioAPI} from "cheerio/lib/load";
import axios, {AxiosInstance} from "axios-https-proxy-fix";
import { CookieJar} from 'tough-cookie';
import {wrapper} from 'axios-cookiejar-support';


declare module 'axios-https-proxy-fix' {
    interface AxiosRequestConfig {
        jar?: CookieJar;
    }
}
export default class CX {
    courseName = '';
    username: string; // 
    password: string; //
    courses: any[] = [];
    isDoWork=false;
    filterCourse: any
    isCollection = true;
    retry = 5;
    mission: any[] = []; // 当前课程详细
    speed = 1 // 默认速度为1
    submitTime = 60 //默认提交速度
    LOGIN_URL = "https://passport2.chaoxing.com/fanyalogin"; // 登录 
    ALL_COURSES_URL = 'https://mooc1.chaoxing.com/mycourse/backclazzdata?view=json&mcode=' // 获取课程
    COURSES_DETAIL = 'https://mooc1.chaoxing.com/gas/clazz'
    jar: CookieJar; // cookie
    axios: AxiosInstance; // axios实例
    cookies = ''
    constructor(username: string, password: string, speed: number) {
        this.username = username;
        this.password = password;
        this.speed = speed
        this.jar = new CookieJar();

        const axiosInstance = axios.create({

            jar: this.jar,
            headers: {
                'User-Agent': `Dalvik/2.1.0 (Linux; U; Android ${Math.floor(Math.random() * (9 - 12 + 1) + 9)}; MI${Math.floor(Math.random() * (10 - 12 + 1) + 10)} Build/SKQ1.210216.001) (device:MI${Math.floor(Math.random() * (10 - 12 + 1) + 10)}) Language/zh_CN com.chaoxing.mobile/ChaoXingStudy_3_5.1.4_android_phone_614_74 (@Kalimdor)_${nanoid(16)}`,
                'X-Requested-With': 'com.chaoxing.mobile'
            }
        })
        axiosInstance.interceptors.response.use((res) => {
            return res
        }, error => {
            console.log(error)
            return error
        })
        // @ts-ignore
        this.axios = wrapper(axiosInstance as AxiosInstance)
    }

    /**
     * 登录
     */
    async login() {
        const data = stringify({
            fid: -1,
            uname: this.username,
            password: encryptByDES(this.password),
            t: true,
            forbidotherlogin: "0",
            refer: 'http%3A%2F%2Fi.chaoxing.com',
            doubleFactorLogin: "0",
            validate: ""
        })
        const res = await this.axios.post(this.LOGIN_URL, data)
        if (res.data.status) {
            return [true, '登录成功']
        } else {
            return [false, res.data.msg2]
        }
    }

    /**
     * 获取课程
     * @returns 获取课程
     */
    async getAllCourses() {
        const courses = await this.axios.get(this.ALL_COURSES_URL,)
        if (courses.data.result === 1) {
            this.courses = courses.data.channelList.filter((item: any) => !!item.content.course)
            return this.courses.map(item => {
                return item.content.course.data.map((items: { name: string; }) => items.name)
            }).flat()

            // if (this.filterCourse.length === 0) {
            //     console.error('没有找到课程')
            // }
            return
        }
        throw Error('无法获取相关课程数据')
    }

    /**
     * 获取课程详细信息
     * @param courseKey 课程key
     */
    async getCourseData(courseKey: string) {
        const params = {
            'id': courseKey,
            'fields': 'id,bbsid,classscore,isstart,allowdownload,chatid,name,state,isthirdaq,isfiled,information,discuss,visiblescore,begindate,coursesetting.fields(id,courseid,hiddencoursecover,hiddenwrongset,coursefacecheck),course.fields(id,name,infocontent,objectid,app,bulletformat,mappingcourseid,imageurl,teacherfactor,knowledge.fields(id,name,indexOrder,parentnodeid,status,layer,label,begintime,endtime,attachment.fields(id,type,objectid,extension).type(video)))',
            'view': 'json'
        }
        const res = await this.axios.get(this.COURSES_DETAIL, {
            params
        })
        // 自然排序
        return res.data.data[0].course.data[0].knowledge.data.sort((a: any, b: any) => {
            const labelA = Number(String(a.label).split('.')[0])
            const labelB = Number(String(b.label).split('.')[0])
            if (labelA === labelB) {
                if (a.indexorder < b.indexorder) {
                    return -1
                } else {
                    return 1
                }
            } else {
                if (labelA < labelB) {
                    return -1
                } else {
                    return 1
                }
            }
        })

    }

    /**
     * 读取章节信息
     */
    async get_mission(id: string, courseid: string) {
        const url = 'https://mooc1.chaoxing.com/gas/knowledge'
        const {m_time, m_inf_enc} = get_enc_time()
        const params = {
            id,
            courseid,
            'fields': 'id,parentnodeid,indexorder,label,layer,name,begintime,createtime,lastmodifytime,status,jobUnfinishedCount,clickcount,openlock,card.fields(id,knowledgeid,title,knowledgeTitile,description,cardorder).contentcard(all)',
            'view': 'json',
            'token': "4faa8662c59590c6f43ae9fe5b002b42",
            '_time': m_time,
            'inf_enc': m_inf_enc
        }
        const res = await this.axios.get(url, {
            params
        })
        return res.data.data
    }

    async get_knowledge(clazzid: string, courseid: string, knowledgeid: string, num: string) {
        const url = 'https://mooc1.chaoxing.com/knowledge/cards'
        const params = {
            clazzid,
            courseid,
            knowledgeid,
            num,
            'isPhone': 1,
            'control': true,
        }
        const {data} = await this.axios.get(url, {params})
        return [url + '?' + stringify(params), data]
    }

    /**
     * 读取学习记录
     * @param courseid
     * @param clazzid
     * @param vc
     * @param cpi
     */
    async record({
                     courseid,
                     clazzid,
                     vc,
                     cpi,
                 }: any) {
        const {data} = await this.axios.get('https://mooc1-1.chaoxing.com/visit/stucoursemiddle', {
            params: {
                courseid,
                clazzid,
                vc,
                cpi,
            }
        })
    }

    async get_video(objectid: string, fid: string,) {
        const url = `https://mooc1.chaoxing.com/ananas/status/${objectid}`
        const params = {
            'k': fid,
            'flag': 'normal',
            '_dc': Date.now()
        }
        const {data} = await this.axios.get(url, {params})
        return data
    }

    async main_pass_video({
                              cpi,
                              dtoken,
                              otherInfo,
                              playingTime,
                              clazzId,
                              duration,
                              jobid,
                              objectId,
                              userid,
                              rt,
                              clipTime,
                              isdrag,
                              _tsp
                          }: any) {
        const url = `https://mooc1.chaoxing.com/multimedia/log/a/${cpi}/${dtoken}`
        const params = {
            'otherInfo': otherInfo,
            'playingTime': playingTime,
            'duration': duration,
            'jobid': jobid,
            'clipTime': clipTime,
            'clazzId': clazzId,
            'objectId': objectId,
            'userid': userid,
            'isdrag': isdrag,
            'enc': this.get_enc({clazzId, jobid, objectId, playingTime, duration, userid}),
            'rt': '0.9', //
            // 'rt': rt,
            'dtype': 'Video',
            'view': 'pc',
            '_t': Date.now()
        }
        const [err, data] = await to(this.axios.get(url, {
            params
        }))
        if (err) {
            console.log(err)
            throw new Error('执行出错')
        }
        return data as any
    }

    // 执行
    async pass_video({
                         duration,
                         cpi,
                         dtoken,
                         otherInfo,
                         clazzId,
                         jobid,
                         objectId,
                         userid,
                         name,
                         speed,
                         rt,
                         reportTimeInterval,
                         _tsp
                     }: any) {
        let playingTime = 0
        console.log("当前播放速率：" + (this.speed) + "倍速")
        const b1 = new cliProgress.SingleBar({
            fps: 5,
            stream: process.stdout,
        }, cliProgress.Presets.shades_classic);
        b1.start(duration, playingTime)
        let sec = reportTimeInterval
        let isdrag = 0
        while (true) {
            if (sec >= reportTimeInterval || isdrag === 4) {
                sec = 0
                const res = await this.main_pass_video(
                    {
                        cpi,
                        dtoken,
                        otherInfo,
                        playingTime,
                        clazzId,
                        jobid,
                        objectId,
                        userid,
                        rt,
                        _tsp,
                        clipTime: `0_${duration}`,
                        duration,
                    }
                )
                if (res.data.isPassed) {
                    if (isdrag === 4) {
                        b1.stop()
                        break
                    }
                    isdrag = 4
                    playingTime = duration
                } else if ("error" in res.data) {
                    b1.stop()
                    throw new Error("视频播放失败");
                }
                continue
            }
            if(playingTime < duration){
                playingTime += this.speed
            }else{
                playingTime = duration
            }

            b1.update(playingTime)
            sec += this.speed
            await sleep(1000)

        }
    }

    async doDocument({jobid, knowledgeid, courseid, clazzid, jtoken}: any) {
        const url = 'https://mooc1-2.chaoxing.com/ananas/job/document'
        const params = {
            jobid,
            knowledgeid,
            courseid,
            clazzid,
            jtoken,
            _dc: Date.now(),
        }
        return this.axios.get(url, {params})
    }

    // 加密数据
    get_enc({clazzId, userid, jobid, objectId, playingTime, duration}: any) {
        return CryptoJS.MD5(`[${clazzId}][${userid}][${jobid}][${objectId}][${playingTime * 1000}][d_yHJ!$pdA~5][${duration * 1000}][0_${duration}]`).toString()
    }

    async get_workInfo({
                           workid, jobid, knowledgeid, cpi, clazzid, ktoken, type,
                           enc, utenc, courseid, workUrl
                       }: any) {
        const url = 'https://mooc1-2.chaoxing.com/api/work'
        const params = {
            workId: workid,
            jobid,
            clazzid,
            api: 1,
            ut: 's',
            courseid,
            needRedirect: true,
            knowledgeid,
            ktoken,
            type,
            cpi,
            utenc,
            enc
        }
        await this.axios.get(url, {params})
        const url2 = 'https://mooc1.chaoxing.com/workHandle/handle'
        const params2 = {
            workId: workid,
            jobid,
            classId: clazzid,
            api: 1,
            ut: 's',
            courseid,
            userid: '',
            submit: false,
            isphone: false,
            mooc2: 0,
            needRedirect: true,
            knowledgeid,
            ktoken,
            type,
            cpi,
            utenc,
            enc
        }

        const [err, data] = await to(this.axios.get(url2, {params: params2}))
        if (err) {
            console.log(err)
            throw new Error('执行出错')
        }
        await this.acquisitionProblem(data.data, workUrl, workid)
    }

    async acquisitionProblem(data: string, workUrl: string, workid: string
    ) {
        const text = data
        const $ = cheerio.load(data);
        const collection = $('#RightCon > .radiusBG > .CeYan > .ZyTop > h3 span').html() as string
        if (!collection) {
            return
        }
        if (collection.includes('待做')) {
            const questionId = $('#workLibraryId').attr('value') || $('#oldWorkId').attr('value') as string
            const questionList = this.extractQuestion($)
            if (questionList.length === 0) return
            let isTemp = false // 是否题库不足 临时保存
            const answer: any[] = await Question.getAnswer({
                refer: workUrl,
                id: questionId,
                info: questionId
            }, questionList.map(item => item.topic), questionList.map(item => item.questionType as number))
            const answerwqbid = questionList.map(item => item.answerId).join(',')
            const formUrl = $('#form1').attr('action') as string
            const totalQuestionNum = $('#totalQuestionNum').attr('value')
            const classId = $('#classId').attr('value')
            const courseid = $('#courseId').attr('value')
            const token = $('#enc_work').attr('value')
            const fullScore = $('#fullScore').attr('value')
            const pyFlag = $('#pyFlag').attr('value')
            const api = $('#api').attr('value')
            const oldWorkId = $('#oldWorkId').attr('value')
            const jobid = $('#jobid').attr('value')
            const workRelationId = $('#workRelationId').attr('value')
            const userId = $('#userId').attr('value')
            const cpi = $('#cpi').attr('value')
            const enc = $('#enc').attr('value')
            const workTimesEnc = $('#workTimesEnc').attr('value')
            const oldSchoolId = $('#oldSchoolId').attr('value')
            const workAnswerId = $('#workAnswerId').attr('value')
            const knowledgeid = $('#knowledgeid').attr('value')
            const enc_wor = $('#enc_work').attr('value')
            const formData = new URLSearchParams()
            const formKey = {
                pyFlag,
                courseId: courseid,
                classId,
                totalQuestionNum,
                enc_work: token,
                answerwqbid,
                fullScore,
                api,
                oldWorkId,
                jobid,
                workRelationId,
                userId,
                cpi,
                workAnswerId,
                knowledgeid,
                enc_wor,
                enc,
                workTimesEnc,
                oldSchoolId
            }
            Object.entries(formKey).forEach(([key, value]) => {
                formData.append(key, value as string);
            })
            questionList.forEach((cur, index) => {
                formData.append(cur.answerTypeName as string, cur.answerType as any)
                if (answer[index].result.length === 0) {
                    formData.append(`answer${cur.answerId}`, '')
                    isTemp = true
                } else {
                    if (answer[index].result[0].correct.length > 1) {
                        formData.append(`answer${cur.answerId}`, answer[index].result[0].correct.map((item: any) => {
                            const selectItem = cur.answer.find(el => el.value === item.option)
                            if (selectItem) {
                                formData.append(selectItem.name, item.option)
                            }
                            return item.option
                        }).join(''))
                    } else {
                        formData.append(`answer${cur.answerId}`, answer[index].result[0].correct[0].option)
                    }

                }
            },)
            if (isTemp) {
                formData.set('pyFlag', '1')
                await this.temporary(formData.toString(), {
                    _classId: classId,
                    courseid,
                    token,
                    totalQuestionNum: totalQuestionNum
                })
                return
            }
            formData.set('pyFlag', '')
            await this.validate({classId,courseId:courseid,cpi})
            await this.submitAnswer(formUrl, formData.toString())
            return;
        }
        await this.collectionQuestion($, workid)

    }

    async collectionQuestion($: CheerioAPI, workid: string) {
        const data: any[] = []
        $('#ZyBottom .TiMu').each((index, item) => {
            const question = substrR($(item).find('.Zy_TItle.clearfix > .clearfix > div').text().trim(), '】')
            const questionType = substrex($(item).find('.Zy_TItle.clearfix > .clearfix > div').text().trim(), '【', '】')
            let successAnswer: any[] = []
            let answer: any[] = []
            if (questionType === '判断题') {
                answer = [
                    {answer: '√', answerValue: true},
                    {answer: '×', answerValue: false},
                ]
            } else {
                answer = $(item).find('form .Zy_ulTop li').map(function (i, el) {
                    return {
                        answer: $(el).find('i').text().trim().replace('、', ''),
                        answerValue: $(el).find('a').text().trim()
                    }
                }).get()
            }

            if (questionType === '判断题') {
                successAnswer = $(item).find('.Py_answer > span .font20').text().trim().split('')
            } else {
                successAnswer = $(item).find('.Py_answer > span').first().text().replace('我的答案：', '').trim().split('')
            }
            const filterAnswer = answer.filter(item => {
                return Object.keys(successAnswer.find(items => items === item.answer) ?? {}).length > 0
            })
            if ($(item).find('.Py_answer > .fr .dui')) {
                data.push({
                    questionName: question,
                    channel: 'test',
                    questionId: workid,
                    answer: filterAnswer,
                    courseName: this.courseName,
                    questionType: getQuestionTypeBySubmit(questionType),
                    platform: 'cx'
                })
            }
        }).get()
        await submitQuestion({question: data})
    }

    extractQuestion($: CheerioAPI,) {
        const element = $('.TiMu')
        let unknownAnswer = false
        let topic = []
        let type = []
        const allQuestion = element.map(function (index) {
            const title = $(this).find('.Zy_TItle > div').text().trim()
            let answer: any[] = []
            const inputInfoElement = $(this).find('input[name^=answertype]')
            const answerTypeName = inputInfoElement.attr('name') as string
            const answerType = inputInfoElement.attr('value')
            const answerId: string = answerTypeName.replace('answertype', '')
            if (title.includes('判断题')) {
                answer = $(this).find('.Zy_ulBottom> li').map(function (index, item) {
                    const el = $(item).find('label > input')
                    return {
                        name: el.attr('name'),
                        value: JSON.parse(el.attr('value') as string),
                    }
                }).get()
            } else {
                answer = $(this).find('.Zy_ulTop > li').map(function (index, item) {
                    const el = $(item).find('label > input')
                    return {
                        id: el.attr('id'),
                        name: el.attr('name'),
                        value: el.attr('value'),
                        text: $(item).find('a').text()
                    }

                }).get()
            }
            const questionType = getQuestionType(substrex(title, '【', '】'))
            if (questionType === null) unknownAnswer = true
            topic.push(title)
            type.push(questionType)
            return {
                title, answer, questionType, index, answerId, answerTypeName,
                answerType,
                topic: substrR(title, '】')
            }
        }).get()
        if (unknownAnswer) {
            console.log('含有不支持的题型 跳过')
            return []
        }
        return allQuestion
    }


    async temporary(data: any, params: any) {
        await this.axios.post('https://mooc1.chaoxing.com/work/addStudentWorkNew', data, {
            params: {
                ...params,
                ua: 'app',
                formType: 'post',
                version: '1',
                saveStatus: '1',
            }
        }).then(({data}) => {
            if (data.status) {
                console.log('测试保存请自行提交')
            } else {
                console.log(data)
                console.log('测试保存失败')
            }
        })
    }

    /**
     * 提交验证
     */
    async validate({
                       classId,
                       courseId,
                       cpi
                   }:any) {
       const {data}= await  this.axios.get(' https://mooc1.chaoxing.com/work/validate', {
            params: {
                classId,
                courseId,
                cpi,
                _: Date.now()
            }
        })
    }

    async submitAnswer(url: string, data: any) {

        await this.axios.post(`https://mooc1.chaoxing.com/work/${url}`, data, {
            params: {
                ua: 'app',
                formType: 'post',
                version: '1',
                saveStatus: '1',
                pos: ''
            }
        }).then(({data}) => {
            if (data.status) {
                console.log('测试提交成功')
            } else {
                console.log(data)
                console.log('测试提交失败')
            }
        })
    }

    async doWork(courseName: string[]) {
        this.filterCourse = this.courses.filter(item => {
            return item.content.course.data.some((items: { name: string; }) => courseName.includes(items.name))
        })
        const uid = this.jar.serializeSync().cookies.find(item => item.key === '_uid')?.value
        for (let course of this.filterCourse) {
            this.courseName = course.content.course.data[0].name
            console.log('开始处理', course.content.course.data[0].name)
            const mission = await this.getCourseData(course.key)
            for (let item of mission) {
                await this.record({
                    cpi: course.cpi,
                    vc: 1,
                    courseid: course.content.course.data[0].id,
                    clazzid: course.key
                })
                const knowledge_raw = await this.get_mission(item.id, course.key)
                for (let cardIndex in knowledge_raw[0].card.data) {
                    const $ = cheerio.load(knowledge_raw[0].card.data[cardIndex].description)
                    const {rt: tagInfoRt} = JSON.parse($('iframe').attr('data') as string || '{}')
                    await sleep(2000)
                    console.log('开始读取标签信息')
                    const [url, data] = await this.get_knowledge(course.key, course.content.course.data[0].id, item.id, cardIndex)
                    // 匹配章节信息
                    let tagInfo = (String(data).match('\window.AttachmentSetting =({\"attachments\":.*})') as any[])
                    if (!tagInfo) {
                        tagInfo = (String(data).match('\mArg =({\"attachments\":.*})') as any[])
                        if (!tagInfo) {
                            await sleep(5000)
                            console.log('没有标签信息', '可能是章节未解锁')
                        }
                        continue
                    }
                    const attachments = JSON.parse(tagInfo[1])

                    if (!attachments) {
                        continue
                    }
                    if (!Object.prototype.hasOwnProperty.call(attachments, 'attachments')) {
                        continue
                    }
                    console.log(`当前章节：${item.label}:${item.name}`)
                    for (let attachmentItem of attachments['attachments']) {
                        let jobid = ''
                        if ("jobid" in attachments) {
                            jobid = attachments["jobid"]
                        } else {
                            if ("jobid" in attachmentItem['property']) {
                                jobid = attachmentItem['property']['jobid']
                            } else {
                                if ("_jobid" in attachmentItem['property'])
                                    jobid = attachmentItem['property']['_jobid']
                            }
                        }
                        if (!jobid) {
                            console.log("未找到jobid，已跳过当前任务点")
                            continue
                        }

                        if (attachmentItem.isPassed) {
                            console.log(`${attachmentItem.property.name}已完成跳过`)
                            continue
                        }
                        if (this.isCollection && attachmentItem.type !== 'workid') {
                            console.log(`${attachmentItem.property.name}不是作业，跳过`)
                            continue
                        }
                        if (attachmentItem.type == 'workid') {
                            if(!this.isDoWork){
                                continue
                            }
                            await this.get_workInfo({
                                clazzid: course.key,
                                workid: attachmentItem['property'].workid,
                                ktoken: attachments['defaults']['ktoken'],
                                knowledgeid: item.id,
                                jobid,
                                courseid: course.content.course.data[0].id,
                                utenc: attachments['defaults']['mtEnc'],
                                enc: attachmentItem.enc,
                                type: attachmentItem.worktype == 'workB' ? 'b' : '',
                                cpi: attachments['defaults']['cpi'],
                                workUrl: url,
                            })
                            continue
                        }


                        if (attachmentItem.type == 'document' && attachmentItem.job == true) {
                            const res = await this.doDocument({
                                jtoken: attachmentItem['jtoken'],
                                knowledgeid: item.id,
                                courseid: course.content.course.data[0].id,
                                clazzid: course.key,
                                jobid,
                            })
                            continue
                        }
                        if (attachmentItem.type == 'video') {
                            const detail = await this.get_video(attachmentItem.objectId, attachments.defaults.fid)
                            if (!detail) {
                                console.log('没有获取到章节信息 已跳过当前任务点')
                                continue
                            }
                            await this.pass_video({
                                duration: detail['duration'],
                                cpi: attachments['defaults']['cpi'],
                                dtoken: detail['dtoken'],
                                otherInfo: attachmentItem['otherInfo'],
                                clazzId: course.key,
                                jobid,
                                rt: tagInfoRt || 1,
                                objectId: detail['objectid'],
                                userid: uid,
                                name: attachmentItem['property']['name'],
                                speed: this.speed,
                                _tsp: Date.now(),
                                reportTimeInterval: attachments.defaults.reportTimeInterval
                            })
                            console.log(`${attachmentItem.property.name}视频任务完成`)
                        }

                    }
                }

            }
            await sleep(1000 * 60)
            console.log(course.content.course.data[0].name, '任务完成')
        }

    }
}




