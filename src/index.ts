import { ENV } from './config/env'
import { Cx } from './core/cx'
import { TaskPoint } from './core/point/task.point';

(async () => {
  const cx = new Cx({
    username: ENV.USER,
    password: ENV.PASSWORD,
  })
  await cx.login()
  const result = await cx.getCourseList()
  cx.currentCourse = result[0]
  const basePoint = new TaskPoint({
    ...cx.currentCourse,
    uid: cx.getUid(),
  })
  const pointTask = await basePoint.getCoursePoint(
    cx.currentCourse.courseId,
    cx.currentCourse.clazzId,
    cx.currentCourse.cpi,
  )
  for (const point of pointTask)
    await basePoint.doPointTask(point.id)
})()
