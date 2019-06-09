import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PositionService } from '../_services/position.service';
import { map } from 'rxjs/operators';
import { OptionsService } from '../_services/options.service';

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

  actions: any = {};

  constructor(
    private router: Router,
    private positionService: PositionService,
    public os: OptionsService
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

    this.os.state$.subscribe(this.updateActions.bind(this));
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

  updateActions(state) {
    if (state === 'setup') {
      this.actions = {
        edit: 'fa-pencil-alt',
        delete: 'fa-trash',
      };
    } else {
      this.actions = {};
    }
  }
}
