import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { RequestService } from './../../core/request.service';
import { RequestViewService } from './../../core/request-view.service';
import { UserService } from './../../core/user.service';
import { TableService } from './../../core/table.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalComponent } from './../shared/modal/modal.component';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit, OnDestroy {
  constructor(
    private reqSvc: RequestService,
    private viewSvc: RequestViewService,
    private userSvc: UserService,
    private tableSvc: TableService,
    private modalSvc: BsModalService
  ) { }

  selfSbs: Subscription;
  self;
  requestSbs: Subscription;
  request;

  layout: string = 'horizontal';
  nav;

  modalRef: BsModalRef;

  ngOnInit() {
    this.selfSbs = this.userSvc.selfReposit()
      .subscribe(data => {
        data ? this.self = data : null;
      });
    this.nav = this.viewSvc.getNavigationDisplay();

    // this.route.params.subscribe(
    //   (params) => this.reqSvc.getViewRequest(params.id)
    // );
    this.requestSbs = this.viewSvc.viewRequestReposit()
      .subscribe(data => {
        data ? this.request = data : null;
      });
  }

  takeAction() {
    this.modalRef = this.modalSvc.show(ModalComponent);
    this.modalRef.content.self = this.self;
  }

  back() {
    this.viewSvc.goBack();
  }

  displayItem(...items: string[]) {
    if (items[0] === 'lab') {
      if (this.request.course.lab) {
        return this.request.course.lab.name;
      }
      return '-';
    }
    if (items[0] === 'admission') {
      if (this.request.admissionRequired) {
        return 'Required';
      }
      return 'N/A';
    }
    if (this.request[items[0]]) {
      return this.request[items[0]][items[1]];
    }
    return 'TBA';
  }

  isFinalized() {
    return this.request.stepID === 5 ? true : false;
  }

  isApproved() {
    return this.request.statusID === 6 ? true : false;
  }

  isConditionallyApproved() {
    const status = [7, 8, 9];
    return status.indexOf(this.request.statusID) !== -1 ? true : false;
  }

  isDisapproved() {
    return this.request.statusID === 5 ? true : false;
  }

  isRegistrarEvaluated() {
    return this.request.stepID >= 4 ? true : false;
  }

  ngOnDestroy() {
    this.selfSbs.unsubscribe();
    this.requestSbs.unsubscribe();
  }
}
