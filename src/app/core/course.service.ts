import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { plainToClass } from 'class-transformer';
import { Course } from './../models/course.model';
import { GtCourse } from './../models/gtCourse.model';
import { ProdEnvService } from './prod-env.service';

@Injectable()
export class CourseService {

  constructor(
    private http: Http,
    private prodSvc: ProdEnvService
  ) {
    this.courseUrl = this.prodSvc.getUrl() + '/course';
    this.gtCourseUrl = this.prodSvc.getUrl() + '/gtcourse';
  }
  private courseUrl: string;
  private gtCourseUrl: string;

  getCourse(keyValuePair?): Observable<Course[]> {
     return this.http.get(this.courseUrl, {params: keyValuePair})
       .map((res: Response) => plainToClass(Course, res.json()));
  }

  getGtCourse(keyValuePair?): Observable<GtCourse[]> {
    return this.http.get(this.gtCourseUrl, {params: keyValuePair})
      .map((res: Response) => plainToClass(GtCourse, res.json()))
      .map(data => data.sort((a, b) => a.level - b.level));
 }

  addCourse(course): Observable<Course> {
    return this.http.post(this.courseUrl, course)
    .map((res: Response) => res.json())
    .map((data: Course) => plainToClass(Course, data));
  }

  addGtCourse(course): Observable<GtCourse[]> {
    return this.http.post(this.gtCourseUrl, course)
      .map((res: Response) => plainToClass(GtCourse, res.json()));
  }

  editCourse(course, id): Observable<Course> {
    return this.http.put(this.courseUrl, course, {params: {'id': id}})
      .map((res: Response) => res.json())
      .map((data: Course) => plainToClass(Course, data));
  }

  editGtCourse(courseData, courseID): Observable<GtCourse[]> {
    return this.http.put(this.gtCourseUrl, courseData, {params: {'id': courseID}})
      .map((res: Response) => plainToClass(GtCourse, res.json()));
  }

  deleteCourse(id): Observable<any> {
    return this.http.delete(this.courseUrl, {params: {'id': id}})
      .map((res: Response) => plainToClass(Course, res.json()));
  }

  deleteGtCourse(id): Observable<any> {
    return this.http.delete(this.gtCourseUrl, {params: {'id': id}})
      .map((res: Response) => plainToClass(Course, res.json()));
  }

  addDocument(doc, courseID: number): Observable<any> {
    return this.http.post(this.courseUrl + '/upload', doc, {params: {id: courseID}})
      .map((res: Response) => res.json());
  }

  //change to match addDocument method
  deleteDocument(typeIDs: string, courseID: number): Observable<any> {
    return this.http.delete(this.courseUrl + '/upload', {params: {id: courseID, type: typeIDs}})
      .map((res: Response) => res.json());
  }

}
