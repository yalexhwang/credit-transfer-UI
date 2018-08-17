import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AccordionModule, BsDatepickerModule, BsDropdownModule, ModalModule, PaginationModule, PopoverModule, ProgressbarModule, SortableModule } from 'ngx-bootstrap';
import { InfoBoxComponent } from './info-box/info-box.component';
import { TableComponent } from './table/table.component';
import { TableBoxComponent } from './table/table-box/table-box.component';
import { LogDisplayComponent } from './log-display/log-display.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    AccordionModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    SortableModule.forRoot()
  ],
  declarations: [
    InfoBoxComponent,
    LogDisplayComponent,
    TableComponent,
    TableBoxComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    InfoBoxComponent,
    LogDisplayComponent,
    TableComponent,
    TableBoxComponent
  ],
  providers: []
})
export class SharedModule {}
