import { Component, OnInit, ViewChild } from '@angular/core';
import { ManagementService } from '../_services/management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-management-import',
  templateUrl: './management-import.component.html',
  styleUrls: ['./management-import.component.css']
})
export class ManagementImportComponent implements OnInit {
  selectedFile: File = null;
  @ViewChild('input') fileInput;

  constructor(
    private managementService: ManagementService,
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
    if (!confirm('Are you sure you want to import this .csv file? This will remove all existing members from the system!')) {
      return;
    }
    this.managementService.import(this.selectedFile).subscribe(
      () => { this.router.navigate(['management']); },
      (e) => { alert('An error occured:\n' + e.error); console.error(e); }
    );
  }
}
