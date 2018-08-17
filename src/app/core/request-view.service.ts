import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ProdEnvService } from './prod-env.service';
import { RequestService } from './request.service';
import { Router } from '@angular/router';
import { Request } from './../models/request.model';

@Injectable()
export class RequestViewService extends RequestService {

  constructor(
    http: Http,
    prodSvc: ProdEnvService,
    private router: Router
  ) {
    super(http, prodSvc);
  }

  private navigation: {
    list: Request[],
    index: number
  } = {
    list: null,
    index: null
  };

  private display: {
    total: number,
    current: number
  };

  getNavigationDisplay() {
    return this.display;
  }

  setList(list: Request[]) {
    this.navigation.list = list;
    this.updateNavigationDisplay();
  }

  setIndex(index: number) {
    this.navigation.index = index;
    console.log(this.navigation.list[index]);
    this.updateNavigationDisplay();
  }

  updateNavigationDisplay() {
    this.display = {
      total: this.navigation.list.length,
      current: this.navigation.index + 1
    };
  }

  goToView(request: Request) {
    this.getViewRequest(request.id);
    this.router.navigate(['/request', request.id]);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

}
