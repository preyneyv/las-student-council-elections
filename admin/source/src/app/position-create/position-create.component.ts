import { Component, OnInit } from '@angular/core';
import { PositionService } from '../_services/position.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CandidateService } from '../_services/candidate.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-position-create',
  templateUrl: './position-create.component.html',
  styleUrls: ['./position-create.component.css']
})
export class PositionCreateComponent implements OnInit {
  allCandidates: any[] = [];
  candidates: any[] = [];

  constructor(
    private positionService: PositionService,
    private candidateService: CandidateService,
    private router: Router
  ) { }

  ngOnInit() {
    this.candidateService.list().pipe(
      tap(candidates =>
        candidates.forEach(
          candidate => candidate.displayLabel = [candidate.name, 'G' + candidate.grade].join(' | '))
      )
    ).subscribe(candidates => this.candidates = this.allCandidates = candidates);
  }

  updateCandidates(form: NgForm) {
    // tslint:disable-next-line:prefer-const
    let { gradesRaw, section, house, candidates } = form.value;
    let grades = [];
    if (gradesRaw) {
      grades = gradesRaw.split(',').map(x => parseInt(x, 10));
      if (!grades.every(n => !isNaN(n))) {
        grades = [];
      }
    }
    this.candidates = this.allCandidates.filter(candidate => {
      if (grades.length && !grades.includes(candidate.grade)) {
        return false;
      }
      if (house && house !== candidate.house) {
        return false;
      }
      if (section && section !== candidate.section) {
        return false;
      }
      return true;
    });
    if (candidates) {
      const cIds = this.candidates.map(c => c._id);
      candidates = candidates.filter(cId => cIds.includes(cId));
      form.form.patchValue({ candidates });
    }
  }

  attemptCreate(form: NgForm) {
    const { gradesRaw } = form.value;
    if (!form.value.position) {
      return alert('The position name is required!');
    }

    let data;
    let grades = [];
    if (gradesRaw) {
      grades = gradesRaw.split(',').map(x => parseInt(x, 10));
      if (!grades.every(n => !isNaN(n))) {
        return alert('Ensure you have entered a valid value for grades!');
      }
    }
    data = {
      ...form.value,
      grades
    };
    delete data.gradesRaw;
    this.positionService.create(data).subscribe(
      ({success, position}) => {
        this.router.navigate([ 'positions' ]); // create successful, go back
      },
      (e) => console.error(e)
    );
  }
}
