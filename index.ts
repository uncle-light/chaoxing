const inquirer = require('inquirer');
import Cx from './core/index'
const figlet = require('figlet');

const bootstrap = async () => {
    const data = await getInfo()
    const user = new Cx(data.username, data.password,data.speed)
    const [isLogin, msg] = await user.login()
    if (!isLogin) {
        console.log('登录失败', msg)
        await bootstrap()
        return
    }
    const courses = await user.getAllCourses()
    const { filterCourses } = await inquirer.prompt([
        {
            name: 'filterCourses',
            message: '请选择课程(tips:按空格键选择)',
            type: 'checkbox',
            pageSize: 10,
            loop: false,
            choices: courses
        },
    ])
    await user.doWork(filterCourses)
    await bootstrap()
}

const desc = () => {
    return new Promise((r) => {
        console.log('感谢使用,本仓库地址:https://github.com/uncle-light/chaoxing')
        console.log('本代码仅用于学习讨论，禁止用于盈利')
        console.log('他人或组织使用本代码进行的任何违法行为与本人无关')
        console.log('觉得有帮助的朋友可以给个Star')
        figlet.text('uncle-light/chaoxing', {
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
        }, (err: any, data: any) => {
            if (err) {
                console.log(err)
            }
            console.log(data)
            r('')
        })
    })

}

const getInfo = async () => {
    return await inquirer.prompt([
        {
            name: 'username',
            message: '请输入账号(仅支持手机号码)',
            type: 'input',
            validate: (value: string) => {
                return /^1[3456789]\d{9}$/.test(value) ? true : '手机号码格式不正确';
            }
        },
        {
            name: 'password',
            message: '请输入密码',
            type: 'input',
            validate: (value: string) => {
                console.log(value)
                return value ? true : '密码不能为空';
            }
        },
        {
            name: 'speed',
            message: '请输入倍速(不建议修改默认1)',
            type: 'input',
            default: 1,
            validate: (value: number) => {
                return Number(value) <= 8 ? true : '倍速必须小于等于8';
            }
        },

    ])
}
(async () => {
    try {
        await desc()
        await bootstrap()
    } catch (error) {
        console.log('运行出错,请截图反馈,感谢配合!',error)
    }

})()