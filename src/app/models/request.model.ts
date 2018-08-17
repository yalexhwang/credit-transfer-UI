import { Type, Expose, Exclude } from "class-transformer";
import { User } from './user.model';
import { Course } from './course.model';
import { Evaluation } from './evaluation.model';
import { Log } from './log.model';

export class Request {

  id: number;

  courseID: number;
  @Type(() => Course)
  course: Course;

  statusID: number;
  status: any;
  stepID: number;
  step: any;
  turn: string;
  myTurn: boolean;
  whoseTurn: string;

  studentID: number;
  @Type(() => User)
  student: User;

  registrarStaffID: number;
  @Type(() => User)
  registrar: User;

  deptID: number;
  department: any;
  deptStaffID: number;
  staff: any;

  admissionRequired: boolean;

  equivSoughtSubjectID: number;
  equivSoughtSubject: any;
  equivSoughtNumber: string;

  @Type(() => Log)
  logs: Log[];

  @Type(() => Evaluation)
  evaluation: Evaluation;

  created_at: string;
  updated_at: string;

  @Exclude()
  models: any;

  get name(): string {
    return 'Request ID ' + this.id;
  }

  get equivSought() {
    let equivSought = 'N/A';
    if (this.equivSoughtSubject) {
      equivSought = this.equivSoughtSubject.name;
    }
    if (this.equivSoughtNumber) {
      equivSought += ", " + this.equivSoughtSubject.code + " " + this.equivSoughtNumber;
    }
    return equivSought;
  }

  get inQueue(): string {
    if (this.stepID === 5) { return '-'; }
    const start = new Date(this.created_at.replace(/\s/, 'T')).getTime();
    const now = new Date().getTime();
    const queue = Math.round((now - start) / (1000 * 60 * 60 * 24));
    if (queue === 0 || queue === 1) {
      return String(queue) + ' day old';
    }
    return String(queue) + ' days old';
  }

  get markAlert() {
    return this.myTurn && this.statusID !== 3 ? true : false;
  }

  get activeAwards() {
    if (this.stepID < 3) {
      return null;
    }
    if (this.stepID === 3) {
      if (this.evaluation.proposed) {
        return processCredit(this.evaluation.proposed, 'deptCredit');
      }
    }
    if (this.stepID >= 4) {
      if (this.evaluation.final && this.statusID !== 5) {
        return processCredit(this.evaluation.final, 'registrarCredit');
      }
    }

    function processCredit(awards: any[], creditName: string) {
      return awards.map(award => {
        award.credit = award[creditName];
        return award;
      });
    }
    return [];
  }

  get creditAwarded() {
    if (this.stepID < 3) {
      return null;
    }
    return this.activeAwards.reduce((total, award) => {
      return total = total + award.credit;
    }, 0);
  }

}
