import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const { url } = environment;

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(
    private http: HttpClient
  ) { }

  list() {
    return this.http.get<any>(url('positions'));
  }

  create(data) {
    return this.http.post<any>(url('positions'), data);
  }

  delete(id) {
    return this.http.delete<any>(url(`positions/${id}`));
  }

  find(id) {
    return this.http.get<any>(url(`positions/${id}`));
  }

  update(id, data) {
    return this.http.patch<any>(url(`positions/${id}`), data);
  }
}
