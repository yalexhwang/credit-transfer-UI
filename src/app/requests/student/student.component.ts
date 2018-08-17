import { Component, OnInit, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Subscription } from 'rxjs/Subscription';
import { RequestService } from './../../core/request.service';
import { RequestViewService } from './../../core/request-view.service';
import { ModalComponent } from './../shared/modal/modal.component';
import { ModalRequestEditorComponent } from './../shared/modal-request-editor/modal-request-editor.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  constructor(
    private reqSvc: RequestService,
    private viewSvc: RequestViewService,
    private modalSvc: BsModalService
  ) { }
  @Input() self;

  requestsSbs: Subscription;
  requests: any[] = [];
  modalRef: BsModalRef;

  ngOnInit() {
    this.requestsSbs = this.reqSvc.requestsReposit()
      .subscribe(data => {
        this.requests = data !== null ? data : [];
      });
    this.reqSvc.getRequest();
  }

  addRequest() {
    this.modalRef = this.modalSvc.show(ModalRequestEditorComponent);
    this.modalRef.content.self = this.self;
  }

  passRequestToModal(request) {
    this.viewSvc.sendViewRequest(request);
    this.modalRef = this.modalSvc.show(ModalComponent);
    this.modalRef.content.self = this.self;
  }

}
