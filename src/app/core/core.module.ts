import { NgModule, Optional, SkipSelf } from '@angular/core';
// import services and components for core (ex. header)
import { ActionService } from './action.service';
import { CourseService } from './course.service';
import { EvaluatorService } from './evaluator.service';
import { ProdEnvService } from './prod-env.service';
import { RequestService } from './request.service';
import { RequestEditorService } from './request-editor.service';
import { RequestViewService } from './request-view.service';
import { SchoolService } from './school.service';
import { TableService } from './table.service';
import { TableViewService } from './table-view.service';
import { UiContentsService } from './ui-contents.service';
import { UserService } from './user.service';
import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [
    ActionService,
    CourseService,
    EvaluatorService,
    ProdEnvService,
    RequestService,
    RequestEditorService,
    RequestViewService,
    SchoolService,
    TableService,
    TableViewService,
    UiContentsService,
    UserService
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
