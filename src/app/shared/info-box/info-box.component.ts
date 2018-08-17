import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface InfoBox {
  title: string;
  detail: string;
  link: {
    name: string;
    url: string;
  }
}

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent implements OnInit {
  constructor() { }

  @Input() info: InfoBox
  @Output() confirmed = new EventEmitter<boolean>();

  ngOnInit() {
  }

  onOK() {
    this.confirmed.emit(true);
  }
}
