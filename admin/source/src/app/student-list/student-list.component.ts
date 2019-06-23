import { Component, OnInit } from '@angular/core';
import { StudentService } from '../_services/student.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { OptionsService } from '../_services/options.service';

const { url } = environment;

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  data: any = [];

  columns: any = {
    name: { title: 'Name', sortable: true },
    pin: { title: 'PIN', sortable: true },
    grade: { title: 'Grade', sortable: true },
    section: { title: 'Section', sortable: true },
    house: { title: 'House', sortable: true },
    used: { title: 'Used', sortable: true },
    voted: { title: 'Voted', sortable: true },
  };

  actions: any = {};

  constructor(
    private router: Router,
    private studentService: StudentService,
    private sanitizer: DomSanitizer,
    public os: OptionsService
  ) { }

  ngOnInit() {
    this.studentService.list().pipe(
      tap(students => {
        students.forEach(student => {
          student._used = student.used;
          student._voted = student.voted;
          student.used = student.used ? 'Yes' : 'No';
          student.voted = student.voted ? 'Yes' : 'No';
          student._actions = { reset: student._used, edit: !student._used };
        });
      })
    )
    .subscribe(students => this.data = students);
    this.os.state$.subscribe(this.updateActions.bind(this));
  }

  doAction({ row, action }) {
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete the student "${row.name}"?`)) {
        return;
      }
      row._actions = { ...(row._actions || {}), delete: false };
      this.studentService.delete(row._id).subscribe(
        () => this.data = this.data.filter(r => r !== row),
        (e) => this.ngOnInit()
      );
    }
    if (action === 'edit') {
      this.router.navigateByUrl(`/students/edit/${row._id}`);
    }
    if (action === 'reset') {
      if (!confirm(`Are you sure you want to refresh ${row.name}'s PIN? (this will delete their current votes, if any.)`)) {
        return;
      }
      row._actions = { ...(row._actions || {}), reset: false };
      this.studentService.reset(row._id).subscribe(
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
        edit: 'fa-pencil-alt'
      };
    } else {
      this.actions = {};
    }
  }

  url(path) { return this.sanitizer.bypassSecurityTrustUrl(url(path)); }
}
