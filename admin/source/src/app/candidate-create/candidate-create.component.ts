import { Component, OnInit, ViewChild } from '@angular/core';
import { PositionService } from '../_services/position.service';
import { CandidateService } from '../_services/candidate.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidate-create',
  templateUrl: './candidate-create.component.html',
  styleUrls: ['./candidate-create.component.css']
})
export class CandidateCreateComponent implements OnInit {
  allPositions = [];
  positions = [];

  selectedFile: File = null;

  @ViewChild('form') form: NgForm;

  constructor(
    private positionService: PositionService,
    private candidateService: CandidateService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.positionService.list().subscribe(positions => this.allPositions = positions);
  }

  attemptCreate(data) {
    if (!data.name) {
      return alert('Please enter the name of the candidate!');
    }
    if (!this.selectedFile) {
      return alert('Please pick a picture of the candidate!');
    }
    if (!data.grade) {
      return alert('Please enter the candidate\'s grade!');
    }
    if (!data.section) {
      return alert('Please enter the candidate\'s section!');
    }
    if (!data.house) {
      return alert('Please enter the candidate\'s house!');
    }
    this.candidateService.create(data, this.selectedFile).subscribe(
      () => {
        this.router.navigate([ 'candidates' ]);
      },
      () => {}
    );
  }

  selectFile(file) { this.selectedFile = file; }

  updatePositions(value) {
    // tslint:disable-next-line:prefer-const
    let { grade, section, house, positions } = value;
    grade = parseInt(grade, 10);
    if (!(grade && section && house)) {
      return this.positions = [];
    }

    this.positions = this.allPositions.filter(position => {
      if (position.grades.length && !position.grades.includes(grade)) {
        return false;
      }
      if (position.house && position.house !== house) {
        return false;
      }
      if (position.section && position.section !== section) {
        return false;
      }
      return true;
    });
    if (positions) {
      const pIds = this.positions.map(p => p._id);
      positions = positions.filter(pId => pIds.includes(pId));
      this.form.form.patchValue({ positions });
    }
  }
}
