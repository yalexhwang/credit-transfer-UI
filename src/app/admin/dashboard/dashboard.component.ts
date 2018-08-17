import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }
  @Input() self;
  
  adminBoards = [
    {path: '', title: 'Dashboard'},
    {path: 'department', title: 'Department'},
    {path: 'gtcourse', title: 'GT Course'},
    {path: 'school', title: 'School'},
    {path: 'user', title: 'User'}
  ];
  currentBoardIndex: number = 0;
  data: any[] = [];

  ngOnInit() {
    this.selectBoard(this.currentBoardIndex);
  }

  selectBoard(index: number) {
    console.log(index);
    this.currentBoardIndex = index;
  }
}
