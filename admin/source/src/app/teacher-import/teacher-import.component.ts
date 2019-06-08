import { Component, OnInit, ViewChild } from '@angular/core';
import { TeacherService } from '../_services/teacher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-import',
  templateUrl: './teacher-import.component.html',
  styleUrls: ['./teacher-import.component.css']
})
export class TeacherImportComponent implements OnInit {
  selectedFile: File = null;
  @ViewChild('input') fileInput;

  constructor(
    private teacherService: TeacherService,
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
    if (!confirm('Are you sure you want to import this .csv file? This will remove all existing teachers from the system!')) {
      return;
    }
    this.teacherService.import(this.selectedFile).subscribe(
      () => { this.router.navigate(['teachers']); },
      (e) => { alert('An error occured:\n' + e.error); console.error(e); }
    );
  }
}
