import axios, { AxiosInstance } from "axios";
import { encryptByDES, get_enc_time, sleep } from '../utils/index'
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { nanoid } from "nanoid";
import { stringify } from 'qs'
import * as CryptoJS from 'crypto-js'
import * as cliProgress from 'cli-progress'
import { to } from 'await-to-js'
import cheerio from 'cheerio'
import { CheerioAPI } from "cheerio/lib/load";

declare module 'axios' {
    interface AxiosRequestConfig {
        jar?: CookieJar;
    }
}

export default class CX {
    courseName: string[] | undefined
    username: string; // 
    password: string; //
    courses: any[] = [];
    filterCourse: any
    mission: any[] = []; // 当前课程详细
    speed = 1 // 默认速度为1
    submitTime = 60 //默认提交速度
    LOGIN_URL = "https://passport2.chaoxing.com/fanyalogin"; // 登录 
    ALL_COURSES_URL = 'https://mooc1-api.chaoxing.com/mycourse/backclazzdata?view=json&mcode=' // 获取课程
    COURSES_DETAIL = 'https://mooc1-api.chaoxing.com/gas/clazz'
    jar: CookieJar; // cookie
    axios: AxiosInstance; // axios实例

    constructor(username: string, password: string,speed:number) {
        this.username = username;
        this.password = password;
        this.speed=speed
        this.jar = new CookieJar();
        this.axios = wrapper(axios.create({
            jar: this.jar,
            headers: {
                'User-Agent': `Dalvik/2.1.0 (Linux; U; Android ${Math.floor(Math.random() * (9 - 12 + 1) + 9)}; MI${Math.floor(Math.random() * (10 - 12 + 1) + 10)} Build/SKQ1.210216.001) (device:MI${Math.floor(Math.random() * (10 - 12 + 1) + 10)}) Language/zh_CN com.chaoxing.mobile/ChaoXingStudy_3_5.1.4_android_phone_614_74 (@Kalimdor)_${nanoid(16)}`,
                'X-Requested-With': 'com.chaoxing.mobile'
            }
        }))
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
        console.error("无法获取相关课程数据")
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
        const url = 'https://mooc1-api.chaoxing.com/gas/knowledge'
        const { m_time, m_inf_enc } = get_enc_time()
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
        const url = 'https://mooc1-api.chaoxing.com/knowledge/cards'
        const params = {
            clazzid,
            courseid,
            knowledgeid,
            num,
            'isPhone': 1,
            'control': true,
        }
        const { data } = await this.axios.get(url, { params })
        return data
    }

    async get_video(objectid: string, fid: string,) {
        const url = `https://mooc1-api.chaoxing.com/ananas/status/${objectid}`
        const params = {
            'k': fid,
            'flag': 'normal',
            '_dc': Date.now()
        }
        const { data } = await this.axios.get(url, { params })
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
        _tsp
    }: any) {
        const url = `https://mooc1-api.chaoxing.com/multimedia/log/a/${cpi}/${dtoken}`
        const params = {
            'otherInfo': otherInfo,
            'playingTime': playingTime,
            'duration': duration,
            'jobid': jobid,
            'clipTime': `0_${duration}`,
            'clazzId': clazzId,
            'objectId': objectId,
            'userid': userid,
            'isdrag': 0,
            'enc': this.get_enc({ clazzId, jobid, objectId, playingTime, duration, userid }),
            // 'rt': '0.9', //
            'rt': rt,
            'dtype': 'Video',
            'view': 'pc',
            '_t': Date.now()
        }
        const [err, data] = await to(this.axios.get(url, {
            params
        }))
        if (err) {
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
        _tsp
    }: any) {
        let playingTime = 0
        console.log("当前播放速率：" + (this.speed) + "倍速")
        const b1 = new cliProgress.SingleBar({
            fps: 5,
            stream: process.stdout,
        }, cliProgress.Presets.shades_classic);
        b1.start(duration, playingTime)
        while (true) {
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
                    duration,
                }
            )
            if (res.data.isPassed) {
                b1.stop()
                break
            } else if ("error" in res.data) {
                b1.stop()
                throw new Error("视频播放失败");
            }
            playingTime += this.submitTime * this.speed
            b1.update(playingTime)
            await sleep(1000 * this.submitTime) 
        }
    }

    async doDocument({ jobid, knowledgeid, courseid, clazzid, jtoken }: any) {
        const url = 'https://mooc1-2.chaoxing.com/ananas/job/document'
        const params = {
            jobid,
            knowledgeid,
            courseid,
            clazzid,
            jtoken,
            _dc: Date.now(),
        }
        return await this.axios.get(url, { params })
    }

    // 加密数据
    get_enc({ clazzId, userid, jobid, objectId, playingTime, duration }: any) {
        return CryptoJS.MD5(`[${clazzId}][${userid}][${jobid}][${objectId}][${playingTime * 1000}][d_yHJ!$pdA~5][${duration * 1000}][0_${duration}]`).toString()
    }

    async get_workInfo({
        workid, jobid, knowledgeid, cpi, clazzid, ktoken, type,
        enc, utenc, courseid
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
        await this.axios.get(url, { params })
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
        const [err, data] = await to(this.axios.get(url2, { params: params2 }))
        if (err) {
            throw new Error('执行出错')
        }
        // this.acquisitionProblem(data.data)
    }

    acquisitionProblem(data: string) {
        const $ = cheerio.load(data);
        const collection = $('#RightCon > .radiusBG > .CeYan > .ZyTop > h3 span').html() as string
        if (collection.includes('待做')) {
            this.extractQuestion($)
            return
        }
        return
        const Fraction = $('#RightCon > .radiusBG > .CeYan > .ZyTop > h3 ').html() as string
        console.log(Fraction)
        if (!Fraction.includes('100')) {
            console.log(Fraction, `未达到采集要求`)
            return
        }

        console.log(Fraction, `已达到采集要求`)
        const questionId = $('#workLibraryId').text() || $('#oldWorkId').text()
        console.log(questionId)
        $('#ZyBottom .TiMu').each((index, item) => {
            const question = $(item).find('.Zy_TItle.clearfix > .fl').text().trim() + $(item).find('.Zy_TItle.clearfix > .clearfix > div').text().trim()
            const answer: any[] = [];
            let successAnswer = ''
            $(item).find('form .Zy_ulTop li').each(function () {
                answer.push($(this).text().trim())
            })
            if (question.includes('判断题')) {
                successAnswer = $(item).find('.Py_answer > span').children().first().text().trim()
            } else {
                successAnswer = $(item).find('.Py_answer > span').first().text().replace('我的答案：', '').trim()
            }
            console.log('问题', question, '答案', answer, '正确答案', successAnswer)
        })
    }

    extractQuestion($: CheerioAPI) {
        const questionId = $('#workLibraryId').text() || $('#oldWorkId').text()
        const element = $('.TiMu')
        const allQuestion = element.map(function () {
            const title = $(this).find('.Zy_TItle > div').text().trim()
            let question: any[] = []
            if (title.includes('判断题')) {
                question = $(this).find('.Zy_ulBottom > li').map(function (index, item) {
                    const el = $(item).find('label > input')
                    return {
                        id: el.attr('name'),
                        value: el.attr('value'),
                    }
                }).get()
            } else {
                question = $(this).find('.Zy_ulTop > li').map(function (index, item) {
                    const el = $(item).find('label > input')
                    return {
                        id: el.attr('name'),
                        value: el.attr('value'),
                        text: $(item).find('a').text()
                    }
                }).get()

            }
            return {
                title, question
            }
        }).get()
        console.log(allQuestion)
    }

    async doWork(courseName: string[]) {
        this.filterCourse = this.courses.filter(item => {
            return item.content.course.data.some((items: { name: string; }) => courseName.includes(items.name))
        })
        const uid = this.jar.serializeSync().cookies.filter(item => item.key === '_uid')[0].value
        for (let course of this.filterCourse) {
            console.log('开始处理', course.content.course.data[0].name)
            const mission = await this.getCourseData(course.key)
            for (let item of mission) {
                const knowledge_raw = await this.get_mission(item.id, course.key)
                for (let cardIndex in knowledge_raw[0].card.data) {
                    const $ = cheerio.load(knowledge_raw[0].card.data[cardIndex].description)
                    const { rt: tagInfoRt } = JSON.parse($('iframe').attr('data') as string || '{}')
                    await sleep()
                    console.log('开始读取标签信息')
                    const data = await this.get_knowledge(course.key, course.content.course.data[0].id, item.id, cardIndex)
                    // 匹配章节信息
                    // console.log(data)
                    const tagInfo = (String(data).match('\window.AttachmentSetting =({\"attachments\":.*})') as any[])
                    if(!tagInfo){ 
                        console.log('没有标签信息','可能是章节未解锁')
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
                        // await sleep(1000)
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

                        if (attachmentItem.type == 'workid') {
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
                            })
                            continue
                        }

                        if (attachmentItem.isPassed) {
                            console.log(`${attachmentItem.property.name}已完成跳过`)
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
                                _tsp: Date.now()
                            })
                            console.log(`${attachmentItem.property.name}视频任务完成`)
                        }

                    }
                }

            }
            console.log(course.content.course.data[0].name, '任务完成')
        }

    }
}




