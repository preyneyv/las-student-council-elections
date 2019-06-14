import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PositionService } from '../_services/position.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  data = [];
  columns = {
    position: { title: "Position", sortable: true },
    votes: { title: "Votes", sortable: false }
  };

  actions = {
    view: 'fa-eye'
  };

  constructor(
    private router: Router,
    private positionService: PositionService
  ) { }

  ngOnInit() {
    this.positionService.list().pipe(
      tap(positions => {
        positions.forEach(position => {
          position.votes = position.candidates.reduce(
            (sum, candidate) => sum + candidate.studentVotes.length +
                                candidate.managementVotes.length * 5 +
                                candidate.teacherVotes.length * 5, 0);
        });
      })
    ).subscribe(positions => this.data = positions);
  }

  doAction({ row, action }) {
    if (action === 'view') {
      this.router.navigateByUrl(`results/${row._id}`);
      console.log(row);
    }
  }
}
