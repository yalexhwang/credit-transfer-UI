import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ProdEnvService } from './prod-env.service';
import { UiContentsService } from './ui-contents.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ActionService } from './action.service';
import { RequestService } from './request.service';

@Injectable()
export class RequestEditorService extends UiContentsService {
  constructor(
    http: Http,
    prodSvc: ProdEnvService,
    private actionSvc: ActionService,
    private reqSvc: RequestService
  ) {
    super(http, prodSvc);
  }

  private actionID: number = 80;
  private optionSub = new Subject<any>();
  private uploadSub = new Subject<any>();
  startingYear: number = 1950;

  optionReposit() {
    return this.optionSub.asObservable();
  }

  uploadReposit() {
    return this.uploadSub.asObservable();
  }

  getOptions(component: string) {
    this.getComponentContents(component)
      .subscribe(data => this.addSubjectCode(data));
  }

  addSubjectCode(
    options: {
      season: string[],
      term: string[],
      subject: any[],
      year: any[]
    }) {
    this.retrieveSubjectCode().subscribe(
      (data) => {
        options.subject = data;
        this.addYears(options);
      }
    );
  }

  addYears(
    options: {
      season: string[],
      term: string[],
      subject: any[],
      year: any[]
    }) {
    let arr = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= this.startingYear; i--) {
      arr.push(i);
    }
    options.year = arr;
    this.optionSub.next(options);
  }

  addRequest(courseData: any, labData: any, files: any, studentID: number) {
    const data = {
      values: this.processRequestData(courseData, labData, studentID),
      standing: {
        turn: 'registrar'
      }
    };
    console.log(data);
    this.reqSvc.addRequest(data)
      .subscribe(data => {
        if (data) {
          console.log(data);
          this.actionSvc.logAction(this.actionID, null, data.id, 1);
          this.actionSvc.triggerStatusUpdate(this.actionID, data.id);
          this.uploadFiles(files, data.courseID);
      }
    });
  }

  uploadFiles(files: any, courseID: number)  {
    return this.reqSvc.addDocuments(
      this.processFileData(files),
      courseID
    ).subscribe(data => {
      this.reqSvc.getRequest();
      this.uploadSub.next(data);
    });
  }

  processRequestData(course: any, lab: any, studentID: number) {
    let labData = null;
    if (course.hasLab) {
      labData = {
        prefix: lab.prefix,
        number: lab.number,
        title: lab.title,
        creditHours: lab.credit
      };
    }
    const courseData = {
      labID: labData,
      prefix: course.prefix,
      number: course.number,
      title: course.title,
      season: course.season,
      term: course.term,
      year: course.year,
      creditHours: course.credit,
      schoolID: course.schoolID
    };
    return {
      courseID: courseData,
      studentID: studentID,
      admissionRequired: Number(course.admission),
      equivSoughtSubjectID: course.equivSubjectID,
      equivSoughtNumber: course.equivNumber
    }
  }

  processFileData(fileData: any[]) {
    console.log(fileData);
    let formData = new FormData;
    fileData.map(file => {
      formData.append(String(file.typeID), file.file)
    });
    return formData;
  }

}
