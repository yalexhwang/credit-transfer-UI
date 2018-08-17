import { Type, Expose, Exclude } from "class-transformer";
import { User } from './user.model';

export class GtCourse {

  id: number;
  isLab: boolean;
  prefix: string;
  level: number;
  isElective: boolean;
  levelNumber: string;
  number: string;
  title: string;
  minCredit: number;
  maxCredit: number;

  @Expose()
  get name() {
    return this.prefix + this.number + " " + this.title;
  }

  @Expose()
  get type() {
    return this.isLab ? 'Lab' : 'Course';
  }

  @Expose()
  get creditHours() {
    if (this.maxCredit == null) {
      return this.minCredit
    }
    return this.minCredit + ' - ' + this.maxCredit;
  }

  @Expose()
  get creditOptions() {
    let arr = [];
    for (let i = this.minCredit; i <= this.maxCredit; i++) {
      arr.push(i);
    }
    return arr;
  }


}
