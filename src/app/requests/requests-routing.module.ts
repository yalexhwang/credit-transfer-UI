import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestsComponent } from './requests.component';
import { RequestComponent } from './request/request.component';

export const requestsRoutes: Routes = [
  {
    path: '',
    component: RequestsComponent
  },
  {
    path: 'request/:id',
    component: RequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(requestsRoutes)],
  exports: [RouterModule]
})

export class RequestsRoutingModule {}
