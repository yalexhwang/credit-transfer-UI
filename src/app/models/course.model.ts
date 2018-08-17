import { Type, Expose, Exclude } from "class-transformer";
import { Lab } from './lab.model';
import { School } from './school.model';

export class Course {

  id: number;
  requestID: number;
  statusID: number;
  status: any;
  prefix: string;
  number: number;
  title: string;
  labID: number;
  studentID: number;
  year: number;
  season: string;
  term: string;
  creditHours: number;
  fileSyllabus: string;
  fileDescription: string;
  schoolID: number;
  preferredSubjectID: number;
  subject: any;

  @Type(() => Lab)
  lab: Lab;
  @Type(() => School)
  school: School;

  @Expose()
  get name() {
    // if (this.labID == 0) {
    //   return this.prefix + this.number + " " + this.title;
    // }
    // return this.prefix + this.number + " " + this.title + ' with lab';
    return this.prefix + this.number + " " + this.title;
  }

  @Expose()
  get taken() {
    return this.season + " " + this.term + " " + this.year;
  }

  @Expose()
  get documents() {
    let docs = [];
    if (this.fileSyllabus) {
      docs.push(this.fileSyllabus);
    }
    if (this.fileDescription) {
      docs.push(this.fileDescription);
    }
    if (this.lab) {
      if (this.lab.fileSyllabus) {
        docs.push(this.lab.fileSyllabus);
      }
      if (this.lab.fileDescription) {
        docs.push(this.lab.fileDescription);
      }
    }
    return docs;
  }

  get totalCreditHours() {
    return this.lab ? this.creditHours + this.lab.creditHours : this.creditHours;
  }

}
