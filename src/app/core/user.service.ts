import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { plainToClass } from 'class-transformer';
import { User } from './../models/user.model';
import { ProdEnvService } from './prod-env.service';

@Injectable()
export class UserService {
  constructor(
    private http: Http,
    private prodSvc: ProdEnvService) {
    this.baseUrl = this.prodSvc.getUrl() + '/self';
  }

  private baseUrl;
  private selfSub = new BehaviorSubject<any>(null);

  selfReposit() {
    return this.selfSub.asObservable();
  }

  getSelf() {
    this.http.get(this.baseUrl)
      .map((res: Response) => res.json())
      .subscribe(data => this.selfSub.next(plainToClass(User, data)));
  }

  getUser(keyValuePair): Observable<any> {
    return this.http.get(this.baseUrl, {params: keyValuePair})
      .map((res: Response) =>plainToClass(User, res.json()));
  }

  addUser(userData): Observable<any> {
    return this.http.post(this.baseUrl, userData)
      .map((res: Response) => plainToClass(User, res.json()));
  }

  editUser(userData, userID): Observable<any> {
    return this.http.put(this.baseUrl, userData, {params: {'id': userID}})
      .map((res: Response) => plainToClass(User, res.json()));
  }

  deleteUser(userID): Observable<any> {
    return this.http.delete(this.baseUrl, {params: {'id': userID}})
      .map((res: Response) => plainToClass(User, res.json()));
  }

}
