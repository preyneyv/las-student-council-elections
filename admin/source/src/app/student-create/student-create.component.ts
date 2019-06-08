import { Component, OnInit } from '@angular/core';
import { StudentService } from '../_services/student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-create',
  templateUrl: './student-create.component.html',
  styleUrls: ['./student-create.component.css']
})
export class StudentCreateComponent implements OnInit {

  constructor(
    private studentService: StudentService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  attemptCreate(data) {
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
    this.studentService.create(data).subscribe(
      () => {
        this.router.navigate([ 'students' ]);
      }
    );
  }
}
