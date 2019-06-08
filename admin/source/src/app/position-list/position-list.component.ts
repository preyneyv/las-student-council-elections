import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PositionService } from '../_services/position.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.css']
})
export class PositionListComponent implements OnInit {
  data: any = [];

  columns: any = {
    position: { title: 'Position', sortable: true },
    gradesRaw: { title: 'Grades', sortable: false },
    section: { title: 'Section', sortable: false },
    house: { title: 'House', sortable: false },
    numCandidates: { title: 'Candidates', sortable: true }
  };

  actions: any = {
    edit: 'fa-pencil-alt',
    delete: 'fa-trash',
  };

  constructor(
    private router: Router,
    private positionService: PositionService
  ) { }

  ngOnInit() {
    this.positionService.list().pipe(
      map(
        (positions: any[]) => positions.map(pos => (
          pos.numCandidates = pos.candidates.length,
          pos.gradesRaw = pos.grades.join(', '),
          pos
        )
      ))
    ).subscribe(data => this.data = data);
  }

  doAction({ row, action }) {
    if (action === 'edit') {
      this.router.navigateByUrl(`positions/edit/${row._id}`);
    }
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete the position "${row.position}"?`)) {
        return;
      }
      row._actions = { ...(row._actions || {}), delete: false };
      this.positionService.delete(row._id).subscribe(
        () => this.data = this.data.filter(r => r !== row),
        (e) => this.ngOnInit()
      );
    }
  }
}
