import { Component, OnInit } from '@angular/core';
import { OptionsService } from '../_services/options.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    public os: OptionsService
  ) { }

  ngOnInit() {
  }

}
