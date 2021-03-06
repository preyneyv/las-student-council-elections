import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PositionListComponent } from './position-list/position-list.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PositionCreateComponent } from './position-create/position-create.component';
import { LocationStrategy, HashLocationStrategy, APP_BASE_HREF } from '@angular/common';
import { TableComponent } from './table/table.component';
import { PositionEditComponent } from './position-edit/position-edit.component';
import { FormsModule } from '@angular/forms';
import { NotFoundComponent } from './not-found/not-found.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { CandidateCreateComponent } from './candidate-create/candidate-create.component';
import { CandidateEditComponent } from './candidate-edit/candidate-edit.component';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentCreateComponent } from './student-create/student-create.component';
import { StudentEditComponent } from './student-edit/student-edit.component';
import { StudentImportComponent } from './student-import/student-import.component';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { TeacherCreateComponent } from './teacher-create/teacher-create.component';
import { TeacherEditComponent } from './teacher-edit/teacher-edit.component';
import { TeacherImportComponent } from './teacher-import/teacher-import.component';
import { ManagementListComponent } from './management-list/management-list.component';
import { ManagementImportComponent } from './management-import/management-import.component';
import { ManagementEditComponent } from './management-edit/management-edit.component';
import { ManagementCreateComponent } from './management-create/management-create.component';
import { ResultsComponent } from './results/results.component';
import { ResultsDetailComponent } from './results-detail/results-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    PositionListComponent,
    SidebarComponent,
    HomepageComponent,
    PositionCreateComponent,
    TableComponent,
    PositionEditComponent,
    NotFoundComponent,
    CandidateListComponent,
    CandidateCreateComponent,
    CandidateEditComponent,
    StudentListComponent,
    StudentCreateComponent,
    StudentEditComponent,
    StudentImportComponent,
    TeacherListComponent,
    TeacherCreateComponent,
    TeacherEditComponent,
    TeacherImportComponent,
    ManagementListComponent,
    ManagementImportComponent,
    ManagementEditComponent,
    ManagementCreateComponent,
    ResultsComponent,
    ResultsDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgSelectModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    // { provide: APP_BASE_HREF, useValue: '/' + (window.location.pathname.split('/')[1] || '') }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
