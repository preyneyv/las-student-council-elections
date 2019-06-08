import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { StudentService } from '../_services/student.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  id = null;
  student = null;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = this.id = this.route.snapshot.paramMap.get('id');
    this.studentService.find(id).subscribe(
      student => {
        this.student = student;
        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
          this.form.form.patchValue(student);
        });
      },
      () => this.router.navigate([ 'not-found' ], { skipLocationChange: true })
    );
  }

  attemptUpdate(data) {
    if (!data.name) {
      return alert('Please enter the name of the student!');
    }
    if (!data.grade) {
      return alert('Please enter the student\'s grade!');
    }
    if (!data.section) {
      return alert('Please enter the student\'s section!');
    }
    if (!data.house) {
      return alert('Please enter the student\'s house!');
    }
    this.studentService.update(this.id, data).subscribe(
      () => {
        this.router.navigate(['students']);
      }
    );
  }
}
