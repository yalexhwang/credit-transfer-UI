import { Component, OnInit, Input } from '@angular/core';
import { UiContentsService } from './../../core/ui-contents.service';

export interface LogBox {
  id: number,
  name: string,
  key: string,
  logs: any[]
}

@Component({
  selector: 'app-log-display',
  templateUrl: './log-display.component.html',
  styleUrls: ['./log-display.component.scss']
})
export class LogDisplayComponent implements OnInit {

  constructor(
    private contSvc: UiContentsService
  ) { }

  @Input() set request(request) {
    this._request = request;
    this.createDisplays(this.steps);
  }
  get request() {
    return this._request;
  }
  private _request;
  @Input() layout: string;
  steps: any[] = [];

  displays: LogBox[] = [];

  ngOnInit() {
    this.steps = this.contSvc.steps;
    this.createDisplays(this.steps);
    console.log(this.steps);
    if (this.steps.length === 0) {
      this.contSvc.retrieveContentsItem('step')
        .subscribe(
          (data) => {
            this.steps = data;
            this.createDisplays(data);
          }
        );
    }
  }

  createDisplays(steps: any[]) {
    this.displays = [];
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].id <= this.request.stepID) {
        this.displays.push({
          id: steps[i].id,
          name: steps[i].name,
          key: steps[i].key,
          logs: this.request.logs.filter(log => {
            return log.stepID === steps[i].id
          })
        });
      }
    }
  }

}
