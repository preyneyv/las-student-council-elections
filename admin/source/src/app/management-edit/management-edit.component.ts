import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ManagementService } from '../_services/management.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-management-edit',
  templateUrl: './management-edit.component.html',
  styleUrls: ['./management-edit.component.css']
})
export class ManagementEditComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  id = null;
  member = null;

  constructor(
    private managementService: ManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = this.id = this.route.snapshot.paramMap.get('id');
    this.managementService.find(id).subscribe(
      member => {
        this.member = member;
        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
          this.form.form.patchValue(member);
        });
      },
      () => this.router.navigate(['not-found'], { skipLocationChange: true })
    );
  }

  attemptUpdate(data) {
    if (!data.name) {
      return alert('Please enter the name of the member!');
    }
    this.managementService.update(this.id, data).subscribe(
      () => {
        this.router.navigate(['management']);
      }
    );
  }
}
