import type { Course } from '../../utils/decode'
import Request from '../../utils/request'
/**
 * @description 基础点
 * @export
 */
export class BasePoint {
  request: typeof Request
  currentCourse!: Course
  constructor(currentCourse: Course) {
    this.currentCourse = currentCourse
    this.request = Request
  }
}
