import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const { url } = environment;

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(
    private http: HttpClient
  ) { }

  list() {
    return this.http.get<any>(url('students'));
  }

  create(data) {
    return this.http.post<any>(url('students'), data);
  }

  delete(id) {
    return this.http.delete<any>(url(`students/${id}`));
  }

  find(id) {
    return this.http.get<any>(url(`students/${id}`));
  }

  update(id, data) {
    return this.http.patch<any>(url(`students/${id}`), data);
  }

  reset(id) {
    return this.http.post<any>(url(`students/${id}/reset`), {});
  }
}
