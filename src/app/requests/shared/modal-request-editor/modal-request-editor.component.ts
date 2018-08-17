import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RequestEditorService } from './../../../core/request-editor.service';
import { SchoolService } from './../../../core/school.service';
import { SchoolSelectorComponent } from './school-selector/school-selector.component';

export interface Attached {
  file: any,
  typeID: number
}

@Component({
  selector: 'app-modal-request-editor',
  templateUrl: './modal-request-editor.component.html',
  styleUrls: ['./modal-request-editor.component.scss']
})
export class ModalRequestEditorComponent implements OnInit {
  constructor(
    public modalRef: BsModalRef,
    private subModalRef: BsModalRef,
    private modalSvc: BsModalService,
    private editorSvc: RequestEditorService,
    private schoolSvc: SchoolService,
    private formBuilder: FormBuilder
  ) { }

  self;
  alertChecked: boolean = false;
  infoBox = {
    title: 'Look at Transfer Equivalency Table!',
    detail: 'Transfer Equivalency Table shows courses that are pre-approved for credit award at Georgia Tech. Submit a request only if your course is NOT listed on the table.',
    link: {
      name: 'Transfer Equivalency Table',
      url: 'https://oscar.gatech.edu/pls/bprod/wwtraneq.P_TranEq_Ltr'
    },
  };

  optionSbs: Subscription;
  options: {
    term: null,
    season: null,
    year: null,
    subject: null,
  };

  schoolSbs: Subscription;
  school = {
    id: null,
    name: ''
  };

  uploadSbs: Subscription;
  courseForm: FormGroup;
  labForm: FormGroup;
  files: Attached[] = [];

  ngOnInit() {
    this.initializeForms();
    this.optionSbs = this.editorSvc.optionReposit()
      .subscribe(data => this.options = data);
    this.editorSvc.getOptions(this.constructor.name);
    this.schoolSbs = this.schoolSvc.selectedSchoolReposit()
      .subscribe((data) => {
        console.log(data);
        if (data) {
          this.school = data;
          this.courseForm.get('schoolID').setValue(this.school.id);
        }
      });
  }

  closeInfoBox(value: boolean) {
    this.alertChecked = value;
  }

  initializeForms() {
    // this.courseForm = this.formBuilder.group({
    //   schoolID: ['', Validators.required],
    //   prefix: ['ABC', Validators.required],
    //   number: ['101', Validators.required],
    //   title: ['Test course', Validators.required],
    //   term: ['Semester', Validators.required],
    //   season: ['Summer', Validators.required],
    //   year: ['2011', Validators.required],
    //   hasLab: [false, Validators.required],
    //   credit: [5, [
    //     Validators.required,
    //     Validators.min(1),
    //     Validators.max(15)
    //   ]],
    //   equivSubjectID: [null],
    //   equivNumber: [null],
    //   admission: [true, Validators.required]
    // });
    this.courseForm = this.formBuilder.group({
      schoolID: ['', Validators.required],
      prefix: [null, Validators.required],
      number: [null, Validators.required],
      title: [null, Validators.required],
      term: [null, Validators.required],
      season: [null, Validators.required],
      year: [null, Validators.required],
      hasLab: [false, Validators.required],
      credit: [null, [
      Validators.required,
      Validators.min(1),
      Validators.max(15)
    ]],
      equivSubjectID: [null],
      equivNumber: [null],
      admission: [null, Validators.required]
    });
    this.labForm = this.formBuilder.group({
      prefix: [null, Validators.required],
      number: [null, Validators.required],
      title: [null, Validators.required],
      credit: [null, [
        Validators.required,
        Validators.min(1),
        Validators.max(15)
      ]]
    });
    this.school = {
      id: null,
      name: ''
    };
  }

  selectSchool() {
    this.subModalRef = this.modalSvc.show(SchoolSelectorComponent);
    console.log(this.courseForm.get('schoolID'));
  }

  onSameAsAbove(checked: boolean) {
    const props = ['prefix', 'number', 'title'];
    if (checked) {
      return props.forEach((prop) => {
        this.labForm.get(prop).setValue(
          this.courseForm.get(prop).value
        );
      });
    }
    props.forEach((prop) => {
      if (
        this.labForm.get(prop).value
        === this.courseForm.get(prop).value
      ) {
        this.labForm.get(prop).setValue("");
      }
    });
  }

  onTermSelected(term: string) {
    if (term !== 'Other') {
      return this.courseForm.get('term').setValue(term);
    }
    this.courseForm.get('term').setValue(null);
  }

  notifyFileStatus(files: any) {
    console.log(files);
    this.files = files;
  }

  submit() {
    this.uploadSbs = this.editorSvc.uploadReposit()
      .subscribe(data => this.modalRef.hide());
    this.editorSvc.addRequest(
      this.courseForm.value,
      this.labForm.value,
      this.files,
      this.self.id
    );
  }

}
