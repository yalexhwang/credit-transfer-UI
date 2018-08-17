import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { User } from './../models/user.model';
import { UserService } from './../core/user.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit, OnDestroy {

  constructor(
    private userSvc: UserService
  ) { }

  selfSbs: Subscription;
  self: User;

  ngOnInit() {
    this.selfSbs = this.userSvc.selfReposit()
      .subscribe(data => data ? this.self = data : null);
  }

  ngOnDestroy() {
    this.selfSbs.unsubscribe();
  }
}
