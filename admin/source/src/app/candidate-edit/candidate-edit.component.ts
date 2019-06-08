import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PositionService } from '../_services/position.service';
import { CandidateService } from '../_services/candidate.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-candidate-edit',
  templateUrl: './candidate-edit.component.html',
  styleUrls: ['./candidate-edit.component.css']
})
export class CandidateEditComponent implements OnInit {
  id = null;
  candidate = null;

  selectedFile: File = null;

  allPositions: any[] = [];
  positions: any[] = [];

  @ViewChild('form') form: NgForm;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private positionService: PositionService,
    private candidateService: CandidateService
  ) { }

  ngOnInit() {
    const id = this.id = this.route.snapshot.paramMap.get('id');
    // Fetch and set existing data
    this.candidateService.find(id).pipe(
      tap((candidate) => {
        candidate.positions = candidate.positions.map(p => p._id);
      })
    ).subscribe(
      candidate => {
        this.candidate = candidate;
        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
          this.form.form.patchValue(candidate);
        });
        if (this.allPositions) {
          this.updatePositions(this.candidate);
        }
      }, () => {
        // invalid position id provided, position not found
        this.router.navigate(['not-found'], { skipLocationChange: true });
      }
    );

    // Get all positions
    this.positionService.list().subscribe(positions => {
      this.allPositions = positions;
      if (this.candidate) {
        this.updatePositions(this.candidate);
      }
    });
  }

  // Select a file
  selectFile(file) { this.selectedFile = file; }

  // Update selectable positions
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

  get image() {
    return this.candidateService.image(this.id);
  }

  attemptUpdate(data) {
    if (!data.name) {
      return alert('Please enter the name of the candidate!');
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
    this.candidateService.update(this.id, data, this.selectedFile).subscribe(
      () => {
        this.router.navigate(['candidates']);
      }
    );
  }
}
