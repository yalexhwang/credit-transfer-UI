import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ProdEnvService } from './prod-env.service';
import { UiContentsService } from './ui-contents.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Request } from './../models/request.model';

export interface TableOption {
  setToValue: any, // for date option
  setToIndex: number, // index of curruent item
  items: any[] // all available items
};

@Injectable()
export class TableService extends UiContentsService {

  constructor(
    http: Http,
    prodSvc: ProdEnvService
  ) {
    super(http, prodSvc);
  }

  private viewIndex: number = 1;
  private resultSub = new BehaviorSubject<Request[]>(null);

  private source  = {
    untouched: [],
    searched: [],
    filtered: [],
    sorted: []
  };

  private searchers: {
    main: TableOption,
    keyword: string
  } = {
    main: {
      setToValue: null,
      setToIndex: null,
      items: []
    },
    keyword: null
  }

  /* main: TableOption for filter, sub: TableOption for filter option */
  private filters: {
    main: TableOption,
    sub: TableOption
  } = {
    main: {
      setToValue: null,
      setToIndex: null,
      items: []
    },
    sub: {
      setToValue: null,
      setToIndex: null,
      items: []
    }
  };

  private sorters: TableOption = {
    setToValue: null,
    setToIndex: 0,
    items: []
  };

  resultReposit() {
    return this.resultSub.asObservable();
  }

  sendResult(reqs: Request[]) {
    this.resultSub.next(reqs);
  }

  setViewIndex(index: number) {
    this.viewIndex = index;
  }

  getViewIndex() {
    return this.viewIndex;
  }

  initializeTableOptions() {
    this.searchers.main.setToIndex = null;
    this.searchers.keyword = null;
    this.filters.main.setToIndex = null;
    this.filters.sub.setToValue = null;
    this.filters.sub.setToIndex = null;
    this.filters.sub.items = [];
    this.sorters.setToIndex = 0;
  }

  setSource(source: Request[]) {
    console.log(source);
    this.source.untouched = source;
    this.search(this.searchers.keyword);
  }

  setSearchOptions(options) {
    this.searchers.main.items = options;
  }

  getSearchers(): any {
    return this.searchers;
  }

  setSearcher(index: number, keyword?: string) {
    this.searchers.main.setToIndex = index;
    this.searchers.keyword = keyword;
    if (index === null) return this.resetSearcher();
  }

  resetSearcher() {
    this.source.searched = this.source.untouched.slice();
    this.runFilter();
  }

  search(value: any) {
    this.setSearcher(this.searchers.main.setToIndex, value);
    // if keyword is empty, no search needed
    if (!value) return this.resetSearcher();
    const searcher = this.searchers.main.items[this.searchers.main.setToIndex];
    this.source.searched = searcher.run(this.source.untouched, value);
    this.runFilter();
  }

  runFilter() {
    if (this.filters.sub.setToValue === null) {
      return this.filter(this.filters.sub.setToIndex);
    }
    this.filter(this.filters.sub.setToValue);
  }

  setFilterOptions(options) {
    this.filters.main.items = options;
  }

  getFilters(): any {
    return this.filters;
  }

  setFilter(index: number): void {
    console.log('setFilter: ' + index);
    this.filters.main.setToIndex = index;
    this.setSubFilter(null);
    if (index === null) {
      this.filters.sub.items = [];
      return this.resetFilter();
    }
    this.retrieveFilterSubItems(
      this.filters.main.items[index]
    ).subscribe(data => this.filters.sub.items = data);
  }

  resetFilter() {
    this.source.filtered = this.source.searched.slice();
    this.sort();
  }

  retrieveFilterSubItems(filter: any): Observable<any> {
    if (Object.prototype.hasOwnProperty.call(filter, 'has')) {
      return Observable.of(filter.has);
    }
    return this.retrieveContentsItem(filter.retrieve.item, filter.retrieve.query);
  }

  setSubFilter(value: any) {
    if (typeof value !== 'number') {
      console.log('type is not number');
      this.filters.sub.setToValue = value;
      this.filters.sub.setToIndex = null;
    } else {
      console.log('type is numberr');
      this.filters.sub.setToIndex = value;
      this.filters.sub.setToValue = null;
    }
    return this.filter(value);
  }

  filter(value: any): void {
    if (value === null) return this.resetFilter();
    let selected;
    if (this.filters.sub.setToIndex === null) {
      selected = this.filters.sub.setToValue;
    } else {
      selected = this.filters.sub.items[this.filters.sub.setToIndex];
    }
    const filter = this.filters.main.items[this.filters.main.setToIndex];
    this.source.filtered = filter.run(this.source.searched, selected);
    this.sort();
  }

  setSortOptions(options) {
    this.sorters.items = options;
  }

  getSorters(): any {
    return this.sorters;
  }

  setSorter(index: number) {
    this.sorters.setToIndex = index;
    this.sort();
  }

  sort() {
    const sorter = this.sorters.items[this.sorters.setToIndex];
    this.source.sorted = sorter.run(this.source.filtered);
    this.sendResult(this.source.sorted);
  }

}
