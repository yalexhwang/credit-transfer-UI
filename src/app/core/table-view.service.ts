import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ProdEnvService } from './prod-env.service';
import { UiContentsService } from './ui-contents.service';
import { Subject } from 'rxjs/Subject';
import { TableService } from './table.service';

export interface View {
  name: string,
  description: string,
  step: number,
  myTurn: boolean
}

@Injectable()
export class TableViewService extends UiContentsService {

  constructor(
    http: Http,
    prodSvc: ProdEnvService,
    private tableSvc: TableService
  ) {
    super(http, prodSvc);
  }

  private viewSub = new Subject<View[]>();

  viewReposit() {
    return this.viewSub.asObservable();
  }

  getViews(component: string) {
    return this.getComponentContents(component);
  }

  processDepartmentViews(views: any[]) {
    views = views.map(view => {
      view = {
        name: view.name,
        description: view.description,
        step: null,
        myTurn: view.myTurn === '1' ? true : false
      };
      return view;
    });
    this.viewSub.next(views);
  }

  addSteps(views: any[]) {
    this.retrieveContentsItem('step').subscribe(
      (data) => {
        this.processRegistrarViews([...views, ...data]);
      }
    );
  }

  processRegistrarViews(views: any[]) {
    views = views.map(view => {
      view = {
        name: view.name,
        description: view.description,
        step: this.convertToStepNumber(view),
        myTurn: null
      };
      return view;
    });
    this.viewSub.next(views);
  }

  convertToStepNumber(view: any) {
    if (
      Object.prototype.hasOwnProperty.call(view, 'step')
    ) {
      return view.step === null ? null : Number(view.step);
    }
    return view.id;
  }

  setTableOptions(options: any) {
    console.log(options);
    this.tableSvc.setSearchOptions(options.search);
    this.tableSvc.setFilterOptions(options.filter);
    this.tableSvc.setSortOptions(options.sort);
  }

  setTableViewIndex(index: number) {
    this.tableSvc.setViewIndex(index);
  }

  getTableViewIndex() {
    return this.tableSvc.getViewIndex();
  }

  setTableSource(requests: any[]) {
    this.tableSvc.setSource(requests);
  }

}
