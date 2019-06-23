import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ManagementService } from '../_services/management.service';
import { DomSanitizer } from '@angular/platform-browser';
import { tap } from 'rxjs/operators';
import { OptionsService } from '../_services/options.service';

const { url } = environment;

@Component({
  selector: 'app-management-list',
  templateUrl: './management-list.component.html',
  styleUrls: ['./management-list.component.css']
})
export class ManagementListComponent implements OnInit {
  data: any = [];

  columns: any = {
    name: { title: 'Name', sortable: true },
    pin: { title: 'PIN', sortable: true },
    used: { title: 'Used', sortable: true },
    voted: { title: 'Voted', sortable: true },
  };

  actions: any = {};

  constructor(
    private router: Router,
    private managementService: ManagementService,
    private sanitizer: DomSanitizer,
    public os: OptionsService
  ) { }

  ngOnInit() {
    this.managementService.list().pipe(
      tap(management => {
        management.forEach(person => {
          person._used = person.used;
          person._voted = person.voted;
          person.used = person.used ? 'Yes' : 'No';
          person.voted = person.voted ? 'Yes' : 'No';
          person._actions = { reset: person._used, edit: !person._used };
        });
      })
    )
    .subscribe(management => this.data = management);
    this.os.state$.subscribe(this.updateActions.bind(this));
  }

  doAction({ row, action }) {
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete the person "${row.name}"?`)) {
        return;
      }
      row._actions = { ...(row._actions || {}), delete: false };
      this.managementService.delete(row._id).subscribe(
        () => this.data = this.data.filter(r => r !== row),
        (e) => this.ngOnInit()
      );
    }
    if (action === 'edit') {
      this.router.navigateByUrl(`/management/edit/${row._id}`);
    }
    if (action === 'reset') {
      if (!confirm(`Are you sure you want to refresh ${row.name}'s PIN? (this will delete their current votes, if any.)`)) {
        return;
      }
      row._actions = { ...(row._actions || {}), reset: false };
      this.managementService.reset(row._id).subscribe(
        () => {
          row._actions.reset = false;
          row._actions.edit = true;
          row._used = row._voted = false;
          row.used = row.voted = 'No';
        },
        () => this.ngOnInit()
      );
    }
  }

  updateActions(state) {
    if (state === 'setup') {
      this.actions = {
        edit: 'fa-pencil-alt',
        delete: 'fa-trash',
      };
    } else if (state === 'vote') {
      this.actions = {
        reset: 'fa-redo',
        edit: 'fa-pencil-alt',
      };
    } else {
      this.actions = {};
    }
  }

  url(path) { return this.sanitizer.bypassSecurityTrustUrl(url(path)); }
}
