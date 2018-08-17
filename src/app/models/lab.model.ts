import { Type, Expose } from "class-transformer";
import { Course } from './course.model';

export class Lab {

  id: number;
  prefix: string;
  number: number;
  title: string;
  creditHours: number;
  courseID: number;
  fileSyllabus: string;
  fileDescription: string;

  @Expose()
  get name() {
    return this.prefix + this.number + " " + this.title;
  }

}
