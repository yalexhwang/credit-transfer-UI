import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EvaluatorService } from './../../../core/evaluator.service';
import { GtCourse } from './../../../models/gtCourse.model';

export interface AwardDisplay {
  course: GtCourse,
  credit: number,
  policyRequested: boolean,
  new: boolean
}

export interface ProposedAward {
  course: GtCourse,
  credit: number,
  policyRequested: boolean,
  awardID: number,
}

export interface DeptAwardData {
  requestID: number,
  gtCourseID: number,
  deptCredit: number,
  policyRequested: number
}

export interface RegistrarAwardData {
  gtCourseID: number
  registrarCredit: number,
  awardID: number,
  actionID: number
}

@Component({
  selector: 'app-evaluator',
  templateUrl: './evaluator.component.html',
  styleUrls: ['./evaluator.component.scss']
})
export class EvaluatorComponent implements OnInit {

  constructor(
    private evalSvc: EvaluatorService
  ) { }

  @Input() self;
  @Input() request;
  @Output() awardDataUpdated = new EventEmitter<any>();
  courseFinder: any = {
    subject: {
      list: [],
      index: null
    },
    course: {
      list: [],
      index: null
    }
  };
  gtCourse: GtCourse;
  editingIndex: number;
  awards: AwardDisplay[] = [];
  awardsCopy: ProposedAward[] = [];
  awardsTotal: number;
  awardData: DeptAwardData[]|RegistrarAwardData[] = [];

  ngOnInit() {
    this.evalSvc.initializeCourseFinder();
    this.courseFinder = this.evalSvc.getCourseFinder();
    if (
      this.self.isRegistrar
      && this.request.activeAwards !== null
    ) {
      this.initializeAwards();
    }
  }

  initializeAwards() {
    this.awards = [];
    this.awardsCopy = [];
    this.request.activeAwards.map(award => {
      const data = this.extractProposedAward(award);
      this.awards.push({
        ...data, new: false
      });
      this.awardsCopy.push({
        ...data, awardID: award.id
      });
    });
    console.log(this.awards);
    console.log(this.awardsCopy);
  }

  extractProposedAward(award: any) {
    return {
      course: award.gtCourse,
      credit: award.credit,
      policyRequested: award.policyRequested
    };
  }

  selectSubject(index: number) {
    this.evalSvc.retrieveCourses(index);
  }

  selectGtCourse(index: number) {
    this.gtCourse = this.courseFinder.course.list[index];
    this.addAward();
  }

  addAward() {
    this.awards.push({
      course: this.gtCourse,
      credit: 0,
      policyRequested: false,
      new: true
    });
    if (this.self.isRegistrar) {
      this.enableEditingForNewAward();
    }
    this.updateAwardData();
    this.gtCourse = null;
  }

  enableEditingForNewAward() {
    this.editingIndex = this.awards.length - 1;
  }

  removeAward(index: number) {
    this.awards.splice(index, 1);
    this.updateAwardData();
    this.getAwardsTotal();
  }

  editAward(index: number) {
    this.editingIndex = this.editingIndex === index ? null : index;
  }

  updateAwardData() {
    this.awardDataUpdated.emit(
      this.extractAwardData(this.awards)
    );
  }

  extractAwardData(awards: any[]) {
    let arr = [];
    if (this.self.isDept) {
      for (let i = 0; i < awards.length; i++) {
        if (!this.checkIfNewAwardCreditIsSelected(awards[i])) {
          return [];
        }
        arr.push({
          requestID: this.request.id,
          gtCourseID: awards[i].course.id,
          deptCredit: Number(awards[i].credit),
          policyRequested: awards[i].policyRequested ? 1 : 0
        });
      }
      return arr;
    }
    if (this.self.isRegistrar) {
      for (let i = 0; i < awards.length; i++) {
        if (!this.checkIfNewAwardCreditIsSelected(awards[i])) {
          return [];
        }
        arr.push({
          gtCourseID: awards[i].course.id,
          registrarCredit: Number(awards[i].credit),
          awardID: this.getFinalDataAwardID(i),
          actionID: this.getFinalDataActionID(awards[i], i)
        });
      }
      if (!this.checkIfChanged(arr)) {
        return [];
      }
      return arr;
    }
  }

  checkIfNewAwardCreditIsSelected(award: any) {
    if (this.self.isDept) {
      return award.credit === 0 ? false : true;
    }
    if (this.self.isRegistrar) {
      if (award.new && award.credit === 0) {
        return false;
      }
      return true;
    }
  }

  checkIfChanged(awardData: any) {
    for (let i = 0; i < awardData.length; i++) {
      if (awardData[i].actionID !== null) {
        return true;
      }
    }
    return false;
  }

  getFinalDataAwardID(index: number) {
    if (this.awardsCopy[index] === undefined) {
      return null;
    }
    return this.awardsCopy[index].awardID;
  }

  getFinalDataActionID(award: any, index: number) {
    if (award.credit == 0) {
      // removed
      return 33;
    }
    if (this.awardsCopy[index] === undefined) {
      return 35;
    }
    if (this.awardsCopy[index].credit !== Number(award.credit)) {
      return 34;
    }
    return null;
  }

  getAwardsTotal() {
    let total = 0;
    for (let i = 0; i < this.awards.length; i++) {
      if (this.awards[i].credit === null) {
        return this.awardsTotal = null;
      }
      total += Number(this.awards[i].credit);
    }
    this.awardsTotal = total;
  }

}
