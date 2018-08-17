import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ProdEnvService } from './../core/prod-env.service';

@Injectable()
export class UiContentsService {
  constructor(
    protected http: Http,
    private prodSvc: ProdEnvService,
  ) {
    this.baseUrl = this.prodSvc.getUrl();
    this.contentsUrl = this.prodSvc.getUrl() + '/contents';
  }

  steps: any[] = [];
  private sub = new Subject<any>();
  private contentsUrl: string;
  protected baseUrl: string;

  contentsReposit() {
    return this.sub.asObservable();
  }

  getComponentContents(component: string): Observable<any> {
    console.log(`component: ${ component }`);
    return this.http
      .get(this.contentsUrl, {params: {component: component}})
      .map((res: Response) => {
        this.sub.next(res.json());
        return res.json();
      });
  }

  retrieveDepartment(id?: number): Observable<any> {
    const query = id ? {id: id} : null;
    return this.http.get(this.contentsUrl + '/department', {params: query})
      .map((res: Response) => res.json());
  }

  retrieveDeptStaff(deptID: number): Observable<any> {
    return this.http.get(this.contentsUrl + '/department', {params: {id: deptID, value: 'members'}})
      .map((res: Response) => res.json());
  }

  retrieveRequestStatus(): Observable<any> {
    return this.http.get(this.contentsUrl + '/request/status').map(
      (res: Response) => res.json()
    );
  }

  retrieveSubjectCode(): Observable<any> {
    return this.http.get(this.contentsUrl + '/subject')
      .map((res: Response) => res.json());
  }

  retrieveCountry(): Observable<any> {
    return this.http.get(this.contentsUrl + '/country')
      .map((res: Response) => res.json());
  }

  retrieveContentsItem(item: string, query?: any): Observable<any> {
    return this.http.get(this.contentsUrl + '/' + item, {params: query})
      .map((res: Response) => res.json())
      .map(data => {
        if (item === 'step') {
          this.steps = data;
        }
        return data;
      });
  }

}
