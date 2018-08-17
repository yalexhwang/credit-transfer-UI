import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { RequestService } from './../../core/request.service';
import { TableViewService } from './../../core/table-view.service';
import { TableOptions } from './table-options';

export interface View {
  name: string,
  description: string,
  step: number,
  myTurn: boolean
}
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit, OnDestroy {

  constructor(
    private tableViewSvc: TableViewService,
    private reqSvc: RequestService,
  ) { }

  requestSbs: Subscription;
  requests: any[] = [];
  viewSbs: Subscription;
  views: View[];
  currentViewIndex: number;

  ngOnInit() {
    this.requestSbs = this.reqSvc.requestsReposit()
      .subscribe(data => {
        console.log(data);
        if (data !== null) {
          this.requests = data;
          this.tableViewSvc.setTableSource(this.requests);
        }
      });
    this.reqSvc.getRequest();

    this.viewSbs = this.tableViewSvc.viewReposit()
      .subscribe(data => {
        console.log(data);
        this.views = data;
        this.setCurrentView(this.currentViewIndex);
      });
    this.initializeViews();
    this.setTableOptions(new TableOptions());
  }

  initializeViews() {
    this.currentViewIndex = this.tableViewSvc.getTableViewIndex();
    if (!this.views) {
      return this.tableViewSvc.getViews(this.constructor.name)
        .subscribe(data => {
          console.log(data);
          this.tableViewSvc.processDepartmentViews(data);
        });
    }
    this.setCurrentView(this.currentViewIndex);
  }

  setCurrentView(index: number) {
    this.currentViewIndex = index;
    this.tableViewSvc.setTableViewIndex(index);
      this.setTableSource(this.views[index].myTurn);
    if (this.views) {

    }
  }

  setTableSource(myTurn: boolean) {
    let requests = this.requests;
    if (myTurn) {
      requests = this.requests.filter(request => {
        return request.myTurn;
      });
    }
    this.tableViewSvc.setTableSource(requests);
  }

  setTableOptions(options: any) {
    this.tableViewSvc.setTableOptions(options);
  }

  ngOnDestroy() {
    this.requestSbs.unsubscribe();
    this.viewSbs.unsubscribe();
  }


}
