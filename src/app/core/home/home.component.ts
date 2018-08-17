import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { User } from './../../models/user.model';
import { UserService } from './../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    private userSvc: UserService
  ) { }

  selfSbs: Subscription;
  self: User;

  ngOnInit() {
    this.selfSbs = this.userSvc.selfReposit()
      .subscribe(data => data ? this.self = data : null);
    this.userSvc.getSelf();
  }

  ngOnDestroy() {
    this.selfSbs.unsubscribe();
  }
}
