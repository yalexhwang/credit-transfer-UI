import { Component, OnInit, Input,  Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Request } from './../../../models/request.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {

  constructor() { }

  @Input() set requests(requests: Request[]) {
    this._requests = requests;
    this.initializeCurrentPage();
    this.setCurrentList(this.currentPage - 1);
  }
  get requests() {
    return this._requests;
  }
  private _requests: Request[];
  @Output() requestSelected = new EventEmitter<Request>();

  openIndex: number;
  currentList: Request[];
  currentPage: number;
  numOfItems: number = 10;
  maxPager: number = 10;
  layout: string = 'vertical';

  ngOnInit() {
  }

  initializeCurrentPage() {
    this.currentPage = Math.ceil(this.requests.length / this.numOfItems);
  }

  toggleRequest(index: number) {
    this.openIndex = this.openIndex === index ? null : index;
  }

  isFinalized(request: Request) {
    return request.stepID === 5 ? true : false;
  }

  isApproved(request: Request) {
    return request.statusID === 6 ? true : false;
  }

  isConditionallyApproved(request: Request) {
    const status = [7, 8, 9];
    return status.indexOf(request.statusID) !== -1 ? true : false;
  }

  isDisapproved(request: Request) {
    return request.statusID === 5 ? true : false;
  }

  setCurrentPage() {
    this.currentPage = Math.ceil(this.requests.length / this.numOfItems);
  }

  setCurrentList(index: number) {
    this.currentList = this.requests.slice(this.numOfItems * index, this.numOfItems * (index + 1));
  }

  goToPage(event) {
    this.setCurrentList(event.page - 1);
  }

  passRequestUp(index: number) {
    this.requestSelected.emit(this.currentList[index]);
  }
}
