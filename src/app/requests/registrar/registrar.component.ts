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
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent implements OnInit, OnDestroy {

  constructor(
    private tableViewSvc: TableViewService,
    private reqSvc: RequestService,
  ) { }

  requestSbs: Subscription;
  requests: Request[];
  viewSbs: Subscription;
  views: View[];
  currentViewIndex: number;

  ngOnInit() {
    this.requestSbs = this.reqSvc.requestsReposit()
      .subscribe(data => {
        if (data !== null) {
          this.requests = data;
          this.tableViewSvc.setTableSource(this.requests);
        }
      });

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
        .subscribe(data => this.tableViewSvc.addSteps(data))
    }
    this.setCurrentView(this.currentViewIndex);
  }

  setCurrentView(index: number) {
    this.currentViewIndex = index;
    this.tableViewSvc.setTableViewIndex(index);
    this.setTableSource(this.views[index].step);
  }

  setTableSource(step: number) {
    if (step === null) {
      this.reqSvc.getNewRequest();
    }
    if (step === 0) {
      this.reqSvc.getRequest({turn: 'registrarStaffID'});
    }
    if (step > 0) {
      this.reqSvc.getRequest({stepID: step});
    }
  }

  setTableOptions(options: any) {
    this.tableViewSvc.setTableOptions(options);
  }

  ngOnDestroy() {
    this.requestSbs.unsubscribe();
    this.viewSbs.unsubscribe();
  }

}
