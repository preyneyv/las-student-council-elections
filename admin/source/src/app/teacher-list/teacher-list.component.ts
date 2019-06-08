import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../_services/teacher.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const { url } = environment;

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit {
  data: any = [];

  columns: any = {
    name: { title: 'Name', sortable: true },
    pin: { title: 'PIN', sortable: true },
    house: { title: 'House', sortable: true },
    used: { title: 'Used', sortable: true },
    voted: { title: 'Voted', sortable: true },
  };

  actions: any = {
    reset: 'fa-redo',
    edit: 'fa-pencil-alt',
    delete: 'fa-trash',
  };

  constructor(
    private router: Router,
    private teacherService: TeacherService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.teacherService.list().pipe(
      tap(teachers => {
        teachers.forEach(teacher => {
          teacher._used = teacher.used;
          teacher._voted = teacher.voted;
          teacher.used = teacher.used ? 'Yes' : 'No';
          teacher.voted = teacher.voted ? 'Yes' : 'No';
          teacher._actions = { reset: teacher._used };
        });
      })
    )
    .subscribe(teachers => this.data = teachers);
  }

  doAction({ row, action }) {
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete the teacher "${row.name}"?`)) {
        return;
      }
      row._actions = { ...(row._actions || {}), delete: false };
      this.teacherService.delete(row._id).subscribe(
        () => this.data = this.data.filter(r => r !== row),
        (e) => this.ngOnInit()
      );
    }
    if (action === 'edit') {
      this.router.navigateByUrl(`/teachers/edit/${row._id}`);
    }
    if (action === 'reset') {
      if (!confirm(`Are you sure you want to refresh ${row.name}'s PIN? (this will delete their current votes, if any.)`)) {
        return;
      }
      row._actions = { ...(row._actions || {}), reset: false };
      this.teacherService.reset(row._id).subscribe(
        () => {
          row._actions.reset = false;
          row._used = row._voted = false;
          row.used = row.voted = 'No';
        },
        () => this.ngOnInit()
      );
    }
  }

  url(path) { return this.sanitizer.bypassSecurityTrustUrl(url(path)); }
}
