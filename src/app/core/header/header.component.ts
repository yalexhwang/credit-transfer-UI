import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  @Input() self;
  currentMenuSbs: Subscription;
  currentMenu: string;


  ngOnInit() {
    this.getCurrentMenu();
    this.currentMenuSbs = this.router.events
      .subscribe(val => {
        if (val instanceof NavigationEnd) {
          this.currentMenu = val.url.slice(1);
        }
      });
  }

  getCurrentMenu() {
    const segments = this.router.url.slice(1).split("/");
    this.currentMenu = segments[0];
  }

  selectMenu(menu: string) {
    this.currentMenu = menu;
    this.router.navigate(['/' + this.currentMenu]);
  }

}
