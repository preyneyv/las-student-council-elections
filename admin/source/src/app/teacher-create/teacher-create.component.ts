import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../_services/teacher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-create',
  templateUrl: './teacher-create.component.html',
  styleUrls: ['./teacher-create.component.css']
})
export class TeacherCreateComponent implements OnInit {

  constructor(
    private teacherService: TeacherService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  attemptCreate(data) {
    if (!data.name) {
      return alert('Please enter the name of the teacher!');
    }
    if (!data.house) {
      return alert('Please enter the teacher\'s house!');
    }
    this.teacherService.create(data).subscribe(
      () => {
        this.router.navigate(['teachers']);
      }
    );
  }
}
