import { NgModule } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { RequestsRoutingModule } from './requests-routing.module';
import { AccordionModule, SortableModule, PaginationModule } from 'ngx-bootstrap';

import { RequestsComponent } from './requests.component';
import { RegistrarComponent } from './registrar/registrar.component';
import { DepartmentComponent } from './department/department.component';
import { StudentComponent } from './student/student.component';
import { ListComponent } from './shared/list/list.component';
import { RequestComponent } from './request/request.component';
import { ModalComponent } from './shared/modal/modal.component';
import { ModalRequestEditorComponent } from './shared/modal-request-editor/modal-request-editor.component';
import { SchoolSelectorComponent } from './shared/modal-request-editor/school-selector/school-selector.component';
import { FileUploadComponent } from './shared/file-upload/file-upload.component';
import { EvaluatorComponent } from './shared/evaluator/evaluator.component';

@NgModule({
  imports: [
    SharedModule,
    RequestsRoutingModule,
    AccordionModule.forRoot(),
    PaginationModule.forRoot(),
    SortableModule.forRoot()
  ],
  declarations: [
    RequestsComponent,
    RegistrarComponent,
    DepartmentComponent,
    StudentComponent,
    RequestComponent,
    ListComponent,
    ModalComponent,
    ModalRequestEditorComponent,
    SchoolSelectorComponent,
    FileUploadComponent,
    EvaluatorComponent
  ],
  exports: [],
  providers: [],
  entryComponents: [
    ModalComponent,
    ModalRequestEditorComponent,
    SchoolSelectorComponent
  ]
})
export class RequestsModule {}
