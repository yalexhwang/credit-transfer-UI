import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ProdEnvService } from './../core/prod-env.service';
import { UiContentsService } from './ui-contents.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { plainToClass } from 'class-transformer';
import { Action } from './../models/action.model';
import { Request } from './../models/request.model';

@Injectable()
export class ActionService extends UiContentsService {

  constructor(
    http: Http,
    prodSvc: ProdEnvService
  ) {
    super(http, prodSvc);
    this.actionUrl = this.baseUrl + '/action';
  }

  private actionUrl: string;
  private request: Request;
  private actions: {
    all: Action[],
    static: Action[],
    active: Action[]
  } = {
    all: [],
    static: [],
    active: []
  };
  private completionSub = new Subject<any>();

  completionReposit() {
    return this.completionSub.asObservable();
  }

  setRequest(request: Request) {
    this.request = request;
    this.filterActions(request.stepID);
  }

  getActions() {
    return this.actions;
  }

  retrieveActions(): Observable<any> {
    return this.http.get(this.actionUrl)
      .map((res: Response) => plainToClass(Action, res.json()));
  }

  filterActiveActions(stepID: number) {
    let active = [];
    this.actions.all.map(option => {
      if (option.stepID === stepID) {
        return active.push(option);
      }
    });
    this.actions.active = active;
  }

  filterActions(stepID: number) {
    let _static = [];
    let active = [];
    this.actions.all.map(option => {
      if (option.stepID === 0) {
        return _static.push(option);
      }
      if (option.stepID === stepID) {
        return active.push(option);
      }
    });
    this.actions.active = active;
    this.actions.static = _static;
  }
  //
  // filterActions(stepID: number) {
  //   let active = [];
  //   this.actions.all.map(option => {
  //     if (option.stepID === stepID || option.stepID === 0) {
  //       return active.push(option);
  //     }
  //   });
  //   this.actions.active = active;
  // }

  retrieveSelectorOptions(item: string, query?: object) {
    return this.retrieveContentsItem(item, query);
  }

  takeAction(
    action: Action,
    data: {values: any, standing: any},
    items: any,
    note: string
  ) {
    data.standing = this.getNextStandingData(action);
    console.log(data);

    this.http.post(
      this.actionUrl + '/' + action.id,
      data,
      {params: {requestID: this.request.id}}
    )
    .map((res: Response) => res.json())
    .subscribe(data => {
      console.log('takeAction: returned from back');
      console.log(data);
      let logData = {
        note: note,
        items: items
      };
      if (data === null) {
        console.log('data null');
        this.completionSub.next();
      }
      if (data) {
        if (action.id === 13 || action.id === 32 || action.id === 63 || action.id === 64) {
          this.updateEvaluation(action.id, data.request.id, data.awards.evaluationItems);
          logData.items = this.extractLogItems(action.id, data.awards.logItems);
        }
        console.log('logData');
        console.log(logData);
        return this.logAction(action.logTemplateID, logData, data.request.id, data.request.stepID);
      }
    });
  }

  getNextStandingData(action: Action) {
    let data = {};
    if (action.nextStepID) {
      data = Object.assign({stepID: action.nextStepID}, data);
    }
    if (action.nextStatusID) {
      data = Object.assign({statusID: action.nextStatusID}, data);
    }
    if (action.nextTurn !== null) {
      data = Object.assign({turn: action.nextTurn}, data);
    }
    return data;
  }

  updateEvaluation(actionID: number, requestID: number, evaluationItems: number[]) {
    const data = this.extractEvaluationData(actionID, evaluationItems);
    console.log('updateEvaluation');
    console.log(data);
    this.http.put(
      this.actionUrl + '/evaluation/' + requestID,
      data
    ).subscribe(data => {
      console.log('updateEvaluation?');
      console.log(data);
    });
  }

  extractEvaluationData(actionID: number, evaluationItems: number[]) {
    if (actionID === 13 || actionID === 32) {
      return {
        finalAwardIDs: evaluationItems
      };
    }
    if (actionID === 63 || actionID === 64) {
      return {
        proposedAwardIDs: evaluationItems
      };
    }
  }

  extractLogItems(actionID: number, awards: any[]) {
    let arr = [];
    if (actionID === 13 || actionID === 32) {
      for (let i = 0; i < awards.length; i++) {
        arr.push([awards[i].awardID, this.getAwardItemStatusForLog(awards[i].actionID)]);
      }
    }
    if (actionID === 63 || actionID === 64) {
      for (let i = 0; i < awards.length; i++) {
        arr.push([awards[i].awardID]);
      }
    }
    console.log('extractLogItems');
    console.log(arr);
    return arr;
  }

  getAwardItemStatusForLog(actionID: number) {
    if (actionID === 35) {
      return 'added';
    }
    if (actionID === 34) {
      return 'edited';
    }
    if (actionID === 33) {
      return 'removed';
    }
  }

  logAction(logTemplateID: number, logData: any, requestID: number, stepID: number) {
    this.http.put(this.actionUrl + '/log/' + logTemplateID, logData, {params: {requestID: requestID, stepID: stepID}})
      .map((res: Response) => res.json())
      .subscribe(data => this.completionSub.next(data));
  }

  triggerTurnUpdate(requestID: number) {
    this.http.get(
      this.baseUrl + '/mail/turn',
      {params: {requestID: requestID}}
    ).subscribe(data => {
      console.log('triggerTurnUpdated?:');
      console.log(data);
    });
  }

  triggerStatusUpdate(actionID: number, requestID: number) {
    const statusUpdating = [2, 12, 13, 41, 42, 43, 44, 45, 46, 80];
    if (statusUpdating.includes(actionID)) {
      this.http.get(
        this.baseUrl + '/mail/status',
        {params: {requestID: requestID}}
      ).subscribe(data => {
        console.log('triggerStatusUpdated?:');
        console.log(data);
      });
    }
  }

}
