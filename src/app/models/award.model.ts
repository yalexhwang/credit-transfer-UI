import { Type, Expose } from "class-transformer";
import { GtCourse } from './gtCourse.model';

export class Award {

  id: number;
  requestID: number;
  gtCourseID: number;
  test: number;

  @Expose({name: 'gt_course'})
  @Type(() => GtCourse)
  gtCourse: GtCourse;

  credit: number;
  deptCredit: number;
  registrarCredit: number;
  policyRequested: boolean;
  policyMade: boolean;

}
