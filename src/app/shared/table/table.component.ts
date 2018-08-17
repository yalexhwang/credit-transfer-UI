import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TableService } from './../../core/table.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  constructor(
    private tableSvc: TableService,
  ) {
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-default',
      showWeekNumbers: false
    });
  }
  sorters;
  filters;
  searchers;
  // display selected searcher (search value with X icon)
  isSearcherSet: boolean = false;
  // display selected filter (filter value with X icon) and subfilter options (dropdown list with 'By')
  isFilterSet: boolean = false;
  // display selected subfilter (subfilter value with X icon)
  isSubFilterSet: boolean = false;
  // display datepick
  isDatepickerSet: boolean = false;
  bsConfig: Object; // for datepicker theming
  resultSbs: Subscription;
  result: Request[] = [];

  ngOnInit() {
    this.initializeTableOptions();
  }

  initializeTableOptions() {
    this.searchers = this.tableSvc.getSearchers();
    this.filters = this.tableSvc.getFilters();
    this.sorters = this.tableSvc.getSorters();
    this.updateSearcherDisplay();
    this.updateFilterDisplay();
  }

  updateSearcherDisplay() {
    this.isSearcherSet = this.searchers.main.setToIndex == null ? false : true;
  }

  updateFilterDisplay() {
    this.isFilterSet = this.filters.main.setToIndex == null ? false : true;
    if (this.isFilterSet) {
      const currentFilter = this.filters.main.items[this.filters.main.setToIndex];
      this.isSubFilterSet = this.filters.sub.setToIndex !== null && currentFilter !== 'Date' ? true
        : false;
      this.isDatepickerSet = currentFilter.name === 'Date' ? true : false;
    } else {
      this.isSubFilterSet = false;
      this.isDatepickerSet = false;
    }

  }

  setSearcher(index: number) {
    this.tableSvc.setSearcher(index, null);
    this.updateSearcherDisplay();
  }

  search(keyword: any): void {
    this.tableSvc.search(keyword);
  }

  setFilter(index: number) {
    this.tableSvc.setFilter(index);
    this.updateFilterDisplay();
  }

  filter(value: any) {
    this.tableSvc.setSubFilter(value);
    this.updateFilterDisplay();
  }

  filterByDate(dateRange: Date[]) {
    console.log(dateRange);
    if (dateRange) {
      dateRange[0] == dateRange[1] ?
        alert('Start date and end date cannot be the same.')
        : this.filter(dateRange);
    }
  }

  sort(index: number) {
    this.tableSvc.setSorter(index);
  }

}
