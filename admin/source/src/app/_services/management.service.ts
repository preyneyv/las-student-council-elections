import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const { url } = environment;

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  constructor(
    private http: HttpClient
  ) { }

  list() {
    return this.http.get<any>(url('management'));
  }

  create(data) {
    return this.http.post<any>(url('management'), data);
  }

  delete(id) {
    return this.http.delete<any>(url(`management/${id}`));
  }

  find(id) {
    return this.http.get<any>(url(`management/${id}`));
  }

  update(id, data) {
    return this.http.patch<any>(url(`management/${id}`), data);
  }

  reset(id) {
    return this.http.post<any>(url(`management/${id}/reset`), {});
  }

  import(file) {
    const data = new FormData();
    data.append('file', file);
    return this.http.post<any>(url(`management/import`), data);
  }
}
