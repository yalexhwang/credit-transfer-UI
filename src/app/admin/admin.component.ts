import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { UiContentsService } from './../core/ui-contents.service';
import { UserService } from './../core/user.service';
import { User } from './../models/user.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  constructor(
    private userSvc: UserService
  ) { }

  selfSbs: Subscription;
  self: User;

  adminBoards = [
    {path: '', title: 'Dashboard'},
    {path: 'department', title: 'Department'},
    {path: 'gtcourse', title: 'GT Course'},
    {path: 'school', title: 'School'},
    {path: 'user', title: 'User'}
  ];
  currentBoardIndex: number = 0;

  ngOnInit() {
    this.selectBoard(this.currentBoardIndex);
    this.selfSbs = this.userSvc.selfReposit()
      .subscribe(data => data ? this.self = data : null);
  }

  selectBoard(index: number) {
    this.currentBoardIndex = index;
  }

  ngOnDestroy() {
  }

}
