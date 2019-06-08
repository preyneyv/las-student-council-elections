import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../_services/student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-import',
  templateUrl: './student-import.component.html',
  styleUrls: ['./student-import.component.css']
})
export class StudentImportComponent implements OnInit {
  selectedFile = null;
  @ViewChild('input') fileInput;

  constructor(
    private studentService: StudentService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  selectFile(file: File) {
    if (file && file.type !== 'text/csv') {
      this.selectedFile = null;
      return this.fileInput.nativeElement.value = '';
    }
    this.selectedFile = file;
  }

  importFile() {
    if (!this.selectedFile) {
      return;
    }
    if (!confirm('Are you sure you want to import this .csv file? This will remove all existing students from the system!')) {
      return;
    }
    this.studentService.import(this.selectedFile).subscribe(
      () => { this.router.navigate([ 'students' ]); },
      (e) => { alert('An error occured:\n' + e.error); console.error(e); }
    );
  }
}
