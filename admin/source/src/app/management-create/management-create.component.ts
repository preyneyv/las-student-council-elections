import { Component, OnInit } from '@angular/core';
import { ManagementService } from '../_services/management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-management-create',
  templateUrl: './management-create.component.html',
  styleUrls: ['./management-create.component.css']
})
export class ManagementCreateComponent implements OnInit {

  constructor(
    private managementService: ManagementService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  attemptCreate(data) {
    if (!data.name) {
      return alert('Please enter the name of the management!');
    }
    this.managementService.create(data).subscribe(
      () => {
        this.router.navigate(['management']);
      }
    );
  }
}
