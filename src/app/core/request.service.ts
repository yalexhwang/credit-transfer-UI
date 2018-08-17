import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { plainToClass } from 'class-transformer';
import { Request } from './../models/request.model';
import { ProdEnvService } from './../core/prod-env.service';

@Injectable()
export class RequestService {

  constructor(
    private http: Http,
    private prodSvc: ProdEnvService) {
    this.baseUrl = this.prodSvc.getUrl() + '/request';
    this.submitUrl = this.prodSvc.getUrl() + '/action/80';
  }

  private baseUrl;
  private submitUrl;
  private requestsSub = new BehaviorSubject<any>(null);
  private viewRequestSub = new BehaviorSubject<any>(null);

  requestsReposit() {
    return this.requestsSub.asObservable();
  }

  viewRequestReposit() {
    return this.viewRequestSub.asObservable();
  }

  sendRequest(requests: Request[]) {
    this.requestsSub.next(requests);
  }

  sendViewRequest(request: Request) {
    console.log(request);
    this.viewRequestSub.next(request);
  }

  getRequest(keyValuePair?): void {
    this.http.get(this.baseUrl, {params: keyValuePair})
      .map((res: Response) => plainToClass(Request, res.json()))
      .subscribe((data) => this.requestsSub.next(data));
      // .catch((err: any) => Observable.throw(err.json().error || 'Server Error'))
  }

  getNewRequest() {
    this.http.get(this.baseUrl + '/new')
      .map((res: Response) => plainToClass(Request, res.json()))
      .subscribe((data) => this.requestsSub.next(data));
  }

  getViewRequest(id: number) {
    return this.http.get(this.baseUrl + '/view/' + id)
      .map((res: Response) => plainToClass(Request, res.json()))
      .subscribe(data => this.viewRequestSub.next(data));
  }

  addRequest(data: any): Observable<Request> {
    return this.http.post(this.submitUrl, data)
      .map((res: Response) => res.json())
      .map((data: Request) => plainToClass(Request, data));
  }

  addDocuments(files: FormData, courseID: number): Observable<any> {
    return this.http.post(
      this.baseUrl + '/upload',
      files,
      {params: {id: courseID}}
    ).map((res: Response) => res.json());
  }

  editRequest(requestData: any, id: number): Observable<any> {
    return this.http.put(this.baseUrl, requestData, {params: {'id': id}})
      .map((res: Response) => plainToClass(Request, res.json()));
  }

  deleteRequest(requestID: number, note?: string): Observable<any> {
    const data = note ? {id: requestID, note: note} : {id: requestID};
    return this.http.delete(this.baseUrl, {params: data})
      .map((res: Response) => plainToClass(Request, res.json()));
  }

}
