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

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomepageComponent },
  // Positions
  { path: 'positions', component: PositionListComponent },
  { path: 'positions/create', component: PositionCreateComponent },
  { path: 'positions/edit/:id', component: PositionEditComponent },

  // Candidates
  { path: 'candidates', component: CandidateListComponent },
  { path: 'candidates/create', component: CandidateCreateComponent },
  { path: 'candidates/edit/:id', component: CandidateEditComponent },

  // Students
  { path: 'students', component: StudentListComponent },
  { path: 'students/create', component: StudentCreateComponent },
  { path: 'students/edit/:id', component: StudentEditComponent },

  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
