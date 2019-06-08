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
    StudentListComponent
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
    { provide: APP_BASE_HREF, useValue: '/' + (window.location.pathname.split('/')[1] || '') }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
