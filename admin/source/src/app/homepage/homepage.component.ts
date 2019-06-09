import { Component, OnInit } from '@angular/core';
import { OptionsService } from '../_services/options.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  state = null;
  loading = false;
  stats: any = {};

  constructor(
    private optionsService: OptionsService
  ) { }

  ngOnInit() {
    this.optionsService.stats().subscribe(stats => this.stats = stats);
    this.optionsService.state$.subscribe(state => {
      this.state = state;
    });
  }

  selectState(state) {
    if (state === 'setup') {
      // confirm
      if (!confirm('Are you sure? This will delete all existing votes and refresh all PINs!\nYou cannot undo this action!')) {
        return;
      }
    }
    this.loading = true;
    this.optionsService.setState(state);
  }

}
