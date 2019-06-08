import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementCreateComponent } from './management-create.component';

describe('ManagementCreateComponent', () => {
  let component: ManagementCreateComponent;
  let fixture: ComponentFixture<ManagementCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
