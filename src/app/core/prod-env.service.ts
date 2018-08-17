import { Injectable } from '@angular/core';

@Injectable()
export class ProdEnvService {

  constructor() { }

  devUrl = "http://slim-0.localhost.gatech.edu/api";
  prodUrl = "http://dev-test.registrar.gatech.edu/api";
  prod1Url = "http:///innovation.registrar.gatech.edu/tc-test/api";

  getUrl() {
    // return this.devUrl;
    return this.prod1Url;

  }




}
