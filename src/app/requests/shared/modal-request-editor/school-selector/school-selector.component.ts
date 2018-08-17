import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Subscription } from 'rxjs/Subscription';
import { SchoolService } from './../../../../core/school.service';

@Component({
  selector: 'app-school-selector',
  templateUrl: './school-selector.component.html',
  styleUrls: ['./school-selector.component.scss']
})
export class SchoolSelectorComponent implements OnInit {
  constructor(
    public modalRef: BsModalRef,
    private schoolSvc: SchoolService,
    private formBuilder: FormBuilder
  ) { }

  optionSbs: Subscription;
  schoolGroups = [
    { name: 'USA', label: 'state', items: [] },
    { name: 'International', label: 'country', items: [] },
    { name: 'School not listed', label: '', items: [] }
  ];
  currentGroup;
  openManualEntry: boolean = false;
  manualForm: FormGroup = this.formBuilder.group({
    name: [null, Validators.required],
    city: [null],
    state: [null, Validators.required],
    country: ['USA', Validators.required],
    countryNotListed: [false],
    zipcode: [null]
  });

  schoolsSbs: Subscription;
  schools: any[];
  school;

  ngOnInit() {
    this.schoolSvc.getOptions(this.constructor.name);
    this.optionSbs = this.schoolSvc.optionReposit()
      .subscribe(
        (data) => {
          console.log(data);
          this.schoolGroups[0].items = data.state;
          this.schoolGroups[1].items = data.country;
          this.schoolGroups[2].items = ['USA', ...data.country];
          this.onSelectSchoolGroup(0);
        }
      );
    this.schoolsSbs = this.schoolSvc.schoolReposit()
      .subscribe(data => this.schools = data);
    this.watchManualFormInput();
  }

  watchManualFormInput() {
    this.manualForm.get('country').valueChanges.subscribe(
      (country) => {
        if (country === "USA") {
          return this.manualForm.get('state')
            .setValidators([Validators.required]);
        }
        this.manualForm.get('state').setValue(null);
        this.manualForm.get('state').setValidators(null);
      });
    this.manualForm.get('countryNotListed').valueChanges.subscribe(
      (countryNotListed) => {
        this.manualForm.get('state').setValue(null)
        if (countryNotListed) {
          this.manualForm.get('country').setValue(null)
        }
      });
  }

  onSelectSchoolGroup(index: number) {
    this.currentGroup = this.schoolGroups[index];
    if (index === 2)
    this.openManualEntry = index === 2 ? true : false;

  }

  onSelectItem(value: string) {
    let query = {};
    query[this.currentGroup.label] = value;
    this.schoolSvc.getSchool(query);
  }

  onSelectSchool(index: number) {
    this.school = this.schools[index]
  }

  confirm() {
    this.schoolSvc.sendSelectedSchool(this.school);
    this.modalRef.hide();
  }

  submit(schoolData: FormGroup) {
    console.log(schoolData);
    this.schoolSvc.addSchool(schoolData).subscribe(
      (data) => {
        this.school = data;
        this.confirm();
      }
    )
  }

}
