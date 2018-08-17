import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ProdEnvService } from './prod-env.service';
import { UiContentsService } from './ui-contents.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { plainToClass } from 'class-transformer';
import { School } from './../models/school.model';

@Injectable()
export class SchoolService extends UiContentsService {
  constructor(
    http: Http,
    prodSvc: ProdEnvService) {
    super(http, prodSvc);
    this.schoolUrl = this.baseUrl + '/school';
  }

  private schoolUrl;

  private optionSub = new Subject<any>();

  private schoolSub = new Subject<any>();

  private selectedSchoolSub = new BehaviorSubject<any>(null);

  optionReposit() {
    return this.optionSub.asObservable();
  }

  schoolReposit() {
    return this.schoolSub.asObservable();
  }

  selectedSchoolReposit() {
    return this.selectedSchoolSub.asObservable();
  }

  sendSelectedSchool(school: any) {
    this.selectedSchoolSub.next(school);
  }

  getOptions(component: string) {
    return this.getComponentContents(component)
      .subscribe(data => this.addInterntionalGroupItems(data));
  }

  addInterntionalGroupItems(
    options: {
      state: string[],
      country: string[]
    }) {
    console.log(options);
    this.retrieveCountry().subscribe((data) => {
      options.country = data;
      this.optionSub.next(options);
    });
  }

  getSchool(keyValuePair) {
    return this.http.get(this.schoolUrl, {params: keyValuePair})
      .map((res: Response) => plainToClass(School, res.json()))
      .subscribe(data => this.schoolSub.next(data));
  }

  addSchool(schoolData: any): Observable<any> {
    const {countryNotListed, ...school} = schoolData;
    return this.http.post(this.schoolUrl, school)
      .map((res: Response) => plainToClass(School, res.json()));
  }


  editSchool(schoolData, id): Observable<any> {
    console.log('editing school: ' + id);
    return this.http.put(this.baseUrl, schoolData, {params: {id: id}})
      .map((res: Response) => plainToClass(School, res.json()));
  }

  deleteSchool(id): Observable<any> {
    return this.http.delete(this.baseUrl, {params: {id: id}}).map((res) => res.json());
  }



}
