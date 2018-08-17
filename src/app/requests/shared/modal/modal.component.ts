import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Subscription } from 'rxjs/Subscription';
import { ActionService } from './../../../core/action.service';
import { EvaluatorService } from './../../../core/evaluator.service';
import { RequestService } from './../../../core/request.service';
import { RequestViewService } from './../../../core/request-view.service';

export interface ActionData {
  values: any,
  standing: any
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  constructor(
    public modalRef: BsModalRef,
    private router: Router,
    private actionSvc: ActionService,
    private reqSvc: RequestService,
    private viewSvc: RequestViewService
  ) { }

  requestSbs: Subscription;
  request;
  self;

  options = {
    all: [],
    static: [],
    active: []
  };
  action = null;
  display: string;
  selector1 = {
    label: null,
    items: []
  };
  selector2 = {
    label: null,
    items: []
  };
  actionData: ActionData;
  logItems: any[];
  note: string = null;
  submitReady: boolean = false;
  completionSbs: Subscription;

  ngOnInit() {
    this.options = this.actionSvc.getActions();
    this.resetActionData();
    console.log(this.options);
    this.requestSbs = this.viewSvc.viewRequestReposit()
      .subscribe(data => {
        if (data) {
          this.request = data;
          this.initializeActionService(this.request);
        }
      });
  }

  resetActionData() {
    this.actionData = {
      values: null,
      standing: null
    };
  }

  initializeActionService(request: any) {
    if (this.options.all.length === 0) {
      return this.actionSvc.retrieveActions()
        .subscribe(data => {
          console.log(data);
          this.options.all = data;
          this.actionSvc.setRequest(request);
          // return this.filterOptions(request);
        });
    }
    this.actionSvc.setRequest(request);
    // this.filterOptions(request);
  }

  disableOption(optionID: number) {
    if (optionID === 41) {
      return this.request.creditAwarded === 0 ? true : false;
    }
    if (optionID === 42) {
      return !this.request.admissionRequired || this.request.creditAwarded === 0;
    }
  }

  selectAction(action) {
    console.log(action);
    this.action = action;
    this.resetActionData();
    this.setDisplay(action);
  }

  setDisplay(action) {
    this.display = action === null ? null : action.UIdisplay;
    if (this.display === 'selector') {
      this.retrieveSelectorItems();
    }
    if (this.display === 'evaluator') {
      this.actionData.values = [];
    }
    this.checkIfSubmitReady(this.actionData);
  }

  retrieveSelectorItems() {
    if (this.self.isDept) {
      this.actionSvc.retrieveSelectorOptions(
        'staff',
        {deptID: this.self.deptID}
      ).subscribe(data => {
        this.selector2 = {
          label: 'Staff',
          items: data
        };
      });
    }
    if (this.self.isRegistrar) {
      this.actionSvc.retrieveSelectorOptions(
        'department',
      ).subscribe(data => {
        this.selector1 = {
          label: 'Department',
          items: data
        };
        this.selector2.label = 'Staff';
      })
    }
  }

  setSelector2Items(index: any) {
    const value = this.selector1.items[index];
    this.selector2 = {
      label: 'Staff',
      items: value.members
    };
    this.setActionDataFromSelector1(value);
  }

  setActionDataFromSelector1(value: any) {
    this.actionData.values = {
      deptID: value.id,
      deptStaffID: null
    };
    this.logItems = [value.name];
    this.checkIfSubmitReady(this.actionData);
  }

  setActionDataFromSelector2(index: any) {
    if (index == 'Select') {
      if (this.self.isDept) {
        this.actionData.values = null;
        this.logItems = null;
      }
      if (this.self.isRegistrar) {
        this.actionData.values.deptStaffID = null;
        if (this.logItems.length === 2) {
          this.logItems.pop();
        }
      }
      return this.checkIfSubmitReady(this.actionData);
    }
    const value = this.selector2.items[index];
    if (this.self.isDept) {
      this.actionData.values = {
        deptStaffID: value.id
      };
      this.logItems = [value.name];
    }
    if (this.self.isRegistrar) {
      this.actionData.values.deptStaffID = value.id;
      this.logItems.push(value.name);
    }
    this.checkIfSubmitReady(this.actionData);
  }

  checkIfSubmitReady(actionData: ActionData) {
    this.submitReady = false;
    if (this.action === null) {
      return this.submitReady = false;
    }
    if (this.display === null) {
      return this.submitReady = true;
    }
    if (this.display === 'textbox' && this.note) {
      return this.submitReady = true;
    }
    if (this.display === 'selector') {
      return this.submitReady = this.checkActionDataForSelector();
    }
    if (this.display === 'evaluator') {
      if (this.action.id === 13) {
        return this.submitReady = true;
      }
      this.submitReady = this.actionData.values.length > 0 ? true : false;
    }
    if (this.display === 'sub-options') {
      this.submitReady = false;
    }
  }

  checkActionDataForSelector() {
    let arr = ['deptStaffID'];
    if (this.self.isRegistrar) {
      arr.push('deptID');
    }
    return this.checkActionDataKey(arr) ? this.checkActionDataValue(arr) : false;
  }

  checkActionDataKey(keys: string[]) {
    const has = Object.prototype.hasOwnProperty;
    for (let i = 0; i < keys.length; i++) {
      if (!has.call(this.actionData.values, keys[i])) {
        return false;
      }
    }
    return true;
  }

  checkActionDataValue(keys: string[]) {
    for (let i = 0; i < keys.length; i++) {
      if (this.actionData.values[keys[i]] === null) {
        return false;
      }
    }
    return true;
  }

  receiveAwardData(data: any[]) {
    console.log(data);
    this.actionData.values = data;
    this.checkIfSubmitReady(this.actionData);
  }

  submitWithSubOption(subOption) {
    this.completionSbs = this.actionSvc.completionReposit()
      .subscribe(data => this.actionComplete());
    this.actionSvc.takeAction(
      subOption,
      this.actionData,
      this.logItems,
      this.note
    );
  }

  submit() {
    this.completionSbs = this.actionSvc.completionReposit()
      .subscribe(data => {
        console.log(data);
        this.actionComplete();
      });
    this.actionSvc.takeAction(
      this.action,
      this.actionData,
      this.logItems,
      this.note
    );
  }

  actionComplete() {
    this.modalRef.hide();
    if (this.action.id === 3 || this.action.id === 84) {
      return this.router.navigate(['/home']);
    }
    if (
      this.action.nextTurn === 'deptStaffID'
      || this.action.nextTurn === 'studentID'
    ) {
      this.actionSvc.triggerTurnUpdate(this.request.id);
    }
    this.actionSvc.triggerStatusUpdate(this.action.id, this.request.id);
    this.viewSvc.getViewRequest(this.request.id);
    if (this.self.isStudent) {
      this.reqSvc.getRequest();
    }
  }

  ngOnDestroy() {
    this.requestSbs.unsubscribe();
    if (this.completionSbs) {
      this.completionSbs.unsubscribe();
    }
  }
}
