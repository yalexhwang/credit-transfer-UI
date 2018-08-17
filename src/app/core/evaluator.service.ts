import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ProdEnvService } from './../core/prod-env.service';
import { UiContentsService } from './ui-contents.service';
import { CourseService } from './course.service';

@Injectable()
export class EvaluatorService extends UiContentsService {

  constructor(
    http: Http,
    prodSvc: ProdEnvService,
    private courseSvc: CourseService
  ) {
    super(http, prodSvc);
    this.retrieveContentsItem('subject')
      .subscribe(data => {
        console.log(data);
        this.courseFinder.subject.list = data
      });
  }

  private courseFinder = {
    subject: {
      list: [],
      index: null
    },
    course: {
      list: [],
      index: null
    }
  };

  initializeCourseFinder() {
    this.courseFinder.subject.index = null;
    this.courseFinder.course.list = [];
    this.courseFinder.course.index = null;
  }

  getCourseFinder() {
    return this.courseFinder;
  }

  setSubjectIndex(index: number) {
    this.courseFinder.subject.index = index;
    const subject = this.courseFinder.subject.list[index];
    console.log(subject);
  }

  retrieveCourses(index?: number) {
    let subject;
    if (index !== null) {
      subject = this.courseFinder.subject.list[index];
    } else {
      subject = this.courseFinder.subject.list[this.courseFinder.subject.index];
    }
    console.log(subject);
    this.courseSvc.getGtCourse({prefix: subject.code})
      .subscribe(data => this.courseFinder.course.list = data);
  }



}
