import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { RequestViewService } from './../../../core/request-view.service';
import { TableService } from './../../../core/table.service';

@Component({
  selector: 'app-table-box',
  templateUrl: './table-box.component.html',
  styleUrls: ['./table-box.component.scss']
})
export class TableBoxComponent implements OnInit {

  constructor(
    private viewSvc: RequestViewService,
    private tableSvc: TableService
  ) { }

  resultSbs: Subscription;
  result: any;
  self: any;

  currentList: any[];
  currentPage: number;
  numOfItems: number = 10;
  maxPager: number = 10;

  ngOnInit() {
    this.resultSbs = this.tableSvc.resultReposit()
      .subscribe(data => {
        if (data !== null) {
          this.result = data;
          this.viewSvc.setList(this.result);
          this.initializeCurrentPage();
          this.setCurrentList(this.currentPage - 1);
        }
      });
  }

  initializeCurrentPage() {
    this.currentPage = Math.ceil(this.result.length / this.numOfItems);
  }

  setItemsPerPage(number: number) {
    this.numOfItems = number;
    this.setCurrentList(this.currentPage - 1);
  }

  setCurrentList(index: number) {
    this.currentList = this.result.slice(this.numOfItems * index, this.numOfItems * (index + 1));
  }

  goToPage(event) {
    this.setCurrentList(event.page - 1);
  }

  goToRequest(index: number) {
    this.viewSvc.setIndex(this.calculateResultIndex(index));
    this.viewSvc.goToView(this.currentList[index]);
  }

  calculateResultIndex(currentIndex: number) {
    return currentIndex + (this.numOfItems * (this.currentPage - 1));
  }

}
