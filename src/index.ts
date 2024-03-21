import * as p from '@clack/prompts'
import { Listr } from 'listr2'
import { Cx } from './core/cx'
import { TaskPoint } from './core/point/task.point'

async function main() {
  const username = await p.text({
    message: '请输入用户名',

  }) as string
  const password = await p.password({
    message: '请输入密码',
  }) as string
  if (p.isCancel(username) || p.isCancel(password)) {
    p.cancel('取消登录')
    // eslint-disable-next-line node/prefer-global/process
    process.exit(1)
  }
  const spinner = p.spinner()
  spinner.start('登录中...')
  try {
    const cx = new Cx({
      username,
      password,
    })
    const { status, msg } = await cx.login()
    if (!status) {
      p.log.error(msg)
      spinner.stop()
      // eslint-disable-next-line node/prefer-global/process
      process.exit(1)
    }
    spinner.stop()
    p.log.success('登录成功')
    const result = await cx.getCourseList()
    p.log.success('获取课程列表成功')
    const checkedCourse = await p.multiselect({
      message: '请选择课程',
      options: result.map(course => ({
        label: course.title,
        value: course,
      })),
    })
    for (const course of checkedCourse as any[]) {
      p.log.info(`开始处理课程：${course.title}`)
      cx.currentCourse = course
      const basePoint = new TaskPoint({
        ...cx.currentCourse,
        uid: cx.getUid(),
      })
      const pointTask = await basePoint.getCoursePoint(
        cx.currentCourse.courseId,
        cx.currentCourse.clazzId,
        cx.currentCourse.cpi,
      )
      const tasks = new Listr([
        {
          title: '处理章节任务',
          task: async (ctx, task) => {
            for (const pointItem of pointTask){
              task.output=pointItem.title
              await basePoint.doPointTask(pointItem.id)
            }
            p.log.success('处理章节任务完成')
          },
        },
      ], { concurrent: false })
      await tasks.run()
    }
  }
  catch (e: unknown) {
    spinner.stop()
    p.log.error((e as Error).message)
    // eslint-disable-next-line node/prefer-global/process
    process.exit(1)
  }
}

void main()
