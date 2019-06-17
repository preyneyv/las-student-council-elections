import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { flatMap } from 'rxjs/operators';

const { url } = environment;

@Injectable({
  providedIn: 'root'
})
export class OptionsService {
  public state = null;
  public state$ = new BehaviorSubject<string>(null);

  constructor(
    private http: HttpClient
  ) {
    this.state$.subscribe(state => this.state = state);
    this.http.get<any>(url('options/state/')).subscribe(({state}) => this.state$.next(state));
  }

  stats() {
    return this.http.get<any>(url('stats'));
  }

  setState(state) {
    const oldState = this.state;
    this.http.post<any>(url('options/state/'), { value: state }).subscribe(
      () => this.state$.next(state)
    );
  }
}
