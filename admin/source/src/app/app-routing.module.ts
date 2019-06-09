import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PositionListComponent } from './position-list/position-list.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PositionCreateComponent } from './position-create/position-create.component';
import { PositionEditComponent } from './position-edit/position-edit.component';
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
import { ManagementCreateComponent } from './management-create/management-create.component';
import { ManagementEditComponent } from './management-edit/management-edit.component';
import { ManagementImportComponent } from './management-import/management-import.component';
import { SetupGuard } from './_guards/setup.guard';
import { ResultsComponent } from './results/results.component';
import { ResultsGuard } from './_guards/results.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomepageComponent },
  // Positions
  { path: 'positions', component: PositionListComponent },
  { path: 'positions/create', component: PositionCreateComponent, canActivate: [ SetupGuard ] },
  { path: 'positions/edit/:id', component: PositionEditComponent, canActivate: [ SetupGuard ] },

  // Candidates
  { path: 'candidates', component: CandidateListComponent },
  { path: 'candidates/create', component: CandidateCreateComponent, canActivate: [ SetupGuard ] },
  { path: 'candidates/edit/:id', component: CandidateEditComponent, canActivate: [ SetupGuard ] },

  // Students
  { path: 'students', component: StudentListComponent },
  { path: 'students/create', component: StudentCreateComponent, canActivate: [ SetupGuard ] },
  { path: 'students/edit/:id', component: StudentEditComponent, canActivate: [ SetupGuard ] },
  { path: 'students/import', component: StudentImportComponent, canActivate: [ SetupGuard ] },

  // Teachers
  { path: 'teachers', component: TeacherListComponent },
  { path: 'teachers/create', component: TeacherCreateComponent, canActivate: [ SetupGuard ] },
  { path: 'teachers/edit/:id', component: TeacherEditComponent, canActivate: [ SetupGuard ] },
  { path: 'teachers/import', component: TeacherImportComponent, canActivate: [ SetupGuard ] },

  // Mangaement
  { path: 'management', component: ManagementListComponent },
  { path: 'management/create', component: ManagementCreateComponent, canActivate: [ SetupGuard ] },
  { path: 'management/edit/:id', component: ManagementEditComponent, canActivate: [ SetupGuard ] },
  { path: 'management/import', component: ManagementImportComponent, canActivate: [ SetupGuard ] },

  // Results
  { path: 'results', component: ResultsComponent, canActivate: [ ResultsGuard ] },

  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
