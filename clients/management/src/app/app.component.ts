import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

let url = path => '../api/' + path;
if (!environment.production) {
  url = path => 'http://localhost:3000/api/' + path;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  state = null;

  disablePin = false;
  disableVoting = false;

  member = null;

  positions = null;

  choices = {};

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.http.get<any>(url('state'), { responseType: ('text' as 'json') }).subscribe(state => {
      if (state === 'vote') {
        this.state = 'pin';
      } else {
        this.state = 'error';
      }
    });
  }

  // Only allow certain keys
  pinKeypress(evt, val) {
    if (['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(evt.key)) {
      return;
    }
    if (isNaN(parseInt(evt.key, 10)) || val.length === 4) {
      evt.preventDefault(); evt.stopPropagation();
    }
  }

  pinInput(evt, val, e) {
    if (val.length === 4) {
      this.disablePin = true;
      console.log('test pin', val);
      // Check the pin
      this.http.get<any>(url(`management/${val}`)).subscribe(
        (res) => {
          // valid pin
          const { member } = res;
          if (!confirm(`Are you ${member.name}?`)) {
            this.disablePin = false;
            e.value = '';
            setTimeout(() => {
              e.focus();
            });
            return;
          }
          this.member = res.member;
          this.state = 'instructions';
          e.value = '';
          // this.loadPositions();
        },
        (error) => {
          console.error(error);
          if (error.status === 404 || error.status === 422) {
            // Incorrect pin or pin already used.
            alert(error.error.message + '\nAsk a Tech Team Member for help.');
            this.disablePin = false;
            e.value = '';
            setTimeout(() => {
              e.focus();
            });
          }
        }
      );
    }
  }

  // Go back to the pin screen
  toPin() {
    this.state = 'pin';
    this.disablePin = false;
    this.disableVoting = false;
    this.choices = {};
    this.member = null;
    this.positions = null;
  }

  loadPositions() {
    this.state = 'cast-vote';
    this.http.get<any>(url(`management/${this.member.pin}/positions`)).subscribe(
      ({ positions }) => this.positions = positions,
      (err) => alert(JSON.stringify(err))
    );
  }

  img(id) {
    return this.sanitizer.bypassSecurityTrustUrl(url(`candidates/${id}/image/`));
  }

  selectCandidate(position, posCandidate) {
    if (this.choices[position._id] === posCandidate) {
      delete this.choices[position._id];
    } else {
      this.choices[position._id] = posCandidate;
    }
  }

  submitVotes() {
    if (Object.keys(this.choices).length !== this.positions.length) {
      return alert('Please check that you have picked a candidate for each position!');
    }
    const choices = Object.keys(this.choices).reduce((o, k) => (o[k] = this.choices[k]._id, o), {});

    this.disableVoting = true;
    this.http.post<any>(url(`management/${this.member.pin}`), choices).subscribe(
      () => {
        // alert('Your votes have been recorded successfully! Thank you for participating!');
        this.state = 'thank-you';
      },
      (e) => {
        alert(`An error occured! Ask a Tech Team Member for help.\n${JSON.stringify(e)}`);
      }
    );
  }
}
