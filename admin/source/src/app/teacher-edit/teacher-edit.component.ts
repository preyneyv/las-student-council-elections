import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TeacherService } from '../_services/teacher.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-teacher-edit',
  templateUrl: './teacher-edit.component.html',
  styleUrls: ['./teacher-edit.component.css']
})
export class TeacherEditComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  id = null;
  teacher = null;

  constructor(
    private teacherService: TeacherService,
    private router: Router,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = this.id = this.route.snapshot.paramMap.get('id');
    this.teacherService.find(id).subscribe(
      teacher => {
        this.teacher = teacher;
        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
          this.form.form.patchValue(teacher);
        });
      }
    );
  }

  attemptUpdate(data) {
    if (!data.name) {
      return alert('Please enter the name of the student!');
    }
    if (!data.house) {
      return alert('Please enter the student\'s house!');
    }
    this.teacherService.update(this.id, data).subscribe(
      () => {
        this.router.navigate(['teachers']);
      }
    );
  }
}
