import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const { url } = environment;

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(
    private http: HttpClient
  ) { }

  list() {
    return this.http.get<any>(url('teachers'));
  }

  create(data) {
    return this.http.post<any>(url('teachers'), data);
  }

  delete(id) {
    return this.http.delete<any>(url(`teachers/${id}`));
  }

  find(id) {
    return this.http.get<any>(url(`teachers/${id}`));
  }

  update(id, data) {
    return this.http.patch<any>(url(`teachers/${id}`), data);
  }

  reset(id) {
    return this.http.post<any>(url(`teachers/${id}/reset`), {});
  }

  import(file) {
    const data = new FormData();
    data.append('file', file);
    return this.http.post<any>(url(`teachers/import`), data);
  }
}
