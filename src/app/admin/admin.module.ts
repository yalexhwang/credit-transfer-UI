import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { PaginationModule } from 'ngx-bootstrap';

import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
    PaginationModule.forRoot(),
  ],
  declarations: [
    AdminComponent,
    DashboardComponent
  ],
  exports: [],
  providers: []
})
export class AdminModule {}
