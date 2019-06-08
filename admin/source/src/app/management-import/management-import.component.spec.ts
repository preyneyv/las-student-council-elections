import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementImportComponent } from './management-import.component';

describe('ManagementImportComponent', () => {
  let component: ManagementImportComponent;
  let fixture: ComponentFixture<ManagementImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
