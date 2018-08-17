import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/subscription';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { ViewEncapsulation } from '@angular/core';

export interface Attached {
  file: any,
  typeID: number
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileUploadComponent implements OnInit {
  constructor() { }
  private lab: boolean;
  @Input() set hasLab(val: boolean) {
    this.lab = val;
    this.initializeTypes(this.lab);
  };
  get hasLab() {
    return this.lab;
  }
  @Output() fileReady = new EventEmitter<Attached[]>();
  types: {
    id: number,
    name: string
  }[] = [];
  files: Attached[] = [];
  sizeLimit: number = 2000000;


  ngOnInit() {
    // this.initializeTypes(this.hasLab);
  }

  initializeTypes(hasLab: boolean) {
    console.log(hasLab);
    hasLab ? this.types = [
      {id: 1, name: 'Course syllabus'},
      {id: 2, name: 'Course description'},
      {id: 3, name: 'Lab syllabus'},
      {id: 4, name: 'Lab description'}
    ] : this.types = [
      {id: 1, name: 'Course syllabus'},
      {id: 2, name: 'Course description'}
    ];
  }

  onFileAdded(attached) {
    console.log(attached);
    this.verifySize(attached[0].size) ? this.files.push({file: attached[0], typeID: null}) : alert('File selected exceeds the size limit.');
    this.isUploadReady();

  }

  verifySize(size: number) {
    return size > this.sizeLimit ? false : true;
  }

  remove(fileIndex: number) {
    this.files.splice(fileIndex, 1);
    this.isUploadReady();
  }

  isUploadReady() {
    this.fileReady.emit(this.assignType(this.files));
  }

  assignType(files: Attached[]) {
    return files.filter((file, index) => {
      return file.typeID = this.types[index].id;
    });
  }

}
