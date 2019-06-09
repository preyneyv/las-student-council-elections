import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../_services/candidate.service';
import { Router } from '@angular/router';
import { OptionsService } from '../_services/options.service';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.css']
})
export class CandidateListComponent implements OnInit {
  data: any = [];

  columns = {
    name: { title: 'Name', sortable: true },
    grade: { title: 'Grade', sortable: true },
    section: { title: 'Section', sortable: true },
    house: { title: 'House', sortable: true },
  };

  actions: any = {};

  constructor(
    private candidateService: CandidateService,
    private router: Router,
    public os: OptionsService
  ) { }

  ngOnInit() {
    this.candidateService.list().subscribe(
      candidates => this.data = candidates
    );
    this.os.state$.subscribe(this.updateActions.bind(this));
  }

  doAction({row, action}) {
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete the candidate "${row.name}"?`)) {
        return;
      }
      row._actions = { ...(row._actions || {}), delete: false };
      this.candidateService.delete(row._id).subscribe(
        () => this.data = this.data.filter(r => r !== row),
        (e) => this.ngOnInit()
      );
    }
    if (action === 'edit') {
      this.router.navigateByUrl(`candidates/edit/${row._id}`);
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
