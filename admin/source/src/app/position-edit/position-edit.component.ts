import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { PositionService } from '../_services/position.service';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { CandidateService } from '../_services/candidate.service';

@Component({
  selector: 'app-position-edit',
  templateUrl: './position-edit.component.html',
  styleUrls: ['./position-edit.component.css']
})
export class PositionEditComponent implements OnInit {
  id = null;
  position = null;

  allCandidates: any[] = [];
  candidates: any[] = [];

  @ViewChild('form') form: NgForm;

  constructor(
    private positionService: PositionService,
    private candidateService: CandidateService,
    private router: Router,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = this.id = this.route.snapshot.paramMap.get('id');
    this.positionService.find(id).pipe(
      tap((pos) => {
        pos.gradesRaw = pos.grades.join(', ');
        pos.candidates = pos.candidates.map(c => c.candidate);
      })
    )
    .subscribe(
      position => {
        this.position = position;
        this.changeDetectorRef.detectChanges();
        const data = [
          'position', 'gradesRaw',
          'section', 'house', 'candidates'
        ].reduce((o, k) => (o[k] = position[k], o), {});
        setTimeout(() => {
          this.form.setValue(data);
        });
      },
      () => {
        // invalid position id provided, position not found
        this.router.navigate([ 'not-found' ], { skipLocationChange: true });
      }
    );

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

  attemptUpdate() {
    const { gradesRaw } = this.form.value;
    if (!this.form.value.position) {
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
      ...this.form.value,
      grades
    };
    delete data.gradesRaw;
    this.positionService.update(this.id, data).subscribe(
      ({ success, position }) => {
        this.router.navigate(['positions']); // update successful, go back
      },
      (e) => console.error(e)
    );
  }

}
