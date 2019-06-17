import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PositionService } from '../_services/position.service';
import { flatMap, catchError, tap } from 'rxjs/operators';
import { CandidateService } from '../_services/candidate.service';

@Component({
  selector: 'app-results-detail',
  templateUrl: './results-detail.component.html',
  styleUrls: ['./results-detail.component.css']
})
export class ResultsDetailComponent implements OnInit {
  position = null;
  positions = [];
  positionIds = [];
  currentPosition = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private positionService: PositionService,
    private candidateService: CandidateService
  ) { }

  ngOnInit() {
    this.positionService.list().subscribe(positions => {
      this.positions = positions;
      this.positionIds = positions.map(p => p._id);
    });
    this.route.paramMap.pipe(
      flatMap(paramMap => this.positionService.find(paramMap.get('id'), true)),
      // tap(position => position.candidates.forEach(c => {
      //   c.votes = c.studentVotes.length +
      //     c.managementVotes.length * 5 +
      //     c.teacherVotes.length * 5, 0;
      // }),
      // tap(position => position.votes = position.candidates)
      tap(position => position.candidates.forEach(c => {
        c.votes = c.studentVotes.length +
          c.managementVotes.length * 5 +
          c.teacherVotes.length * 5;
      })),
      tap(position => position.votes = position.candidates.reduce((s, c) => s + c.votes, 0)),
      tap(position => position.candidates = position.candidates.sort((a, b) => b.votes - a.votes))
    ).subscribe(
      position => {
        this.position = position;
        this.currentPosition = position._id;
      },
      e => {
        if (e.status === 404)
          this.router.navigate([ '/not-found' ], { skipLocationChange: true });
      }
    );
  }

  image(id) {
    return this.candidateService.image(id);
  }

  updatePosition() {
    this.router.navigateByUrl(`/results/${this.currentPosition}`);
  }

  goNext() {
    let i = this.positionIds.indexOf(this.currentPosition) + 1;
    if (i >= this.positionIds.length)
      i = 0;
    this.currentPosition = this.positionIds[i];
    this.updatePosition();
  }
  goPrev() {
    let i = this.positionIds.indexOf(this.currentPosition) - 1;
    if (i < 0)
      i = this.positionIds.length - 1;
    this.currentPosition = this.positionIds[i];
    this.updatePosition();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(evt: KeyboardEvent) {
    if (evt.key === 'ArrowRight')
      this.goNext();
    else if (evt.key === 'ArrowLeft')
      this.goPrev();
  }
}
