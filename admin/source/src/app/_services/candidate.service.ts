import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

const { url } = environment;

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  create(data: any, image) {
    const fd = new FormData();
    for (const row of Object.entries(data)) {
      const key = row[0];
      const value = row[1] as string;
      fd.append(key, value);
    }
    fd.append('image', image);
    return this.http.post<any>(url('candidates'), fd);
  }

  list() {
    return this.http.get<any>(url('candidates'));
  }

  delete(id) {
    return this.http.delete<any>(url(`candidates/${id}`));
  }

  find(id) {
    return this.http.get<any>(url(`candidates/${id}?with=positions`));
  }

  image(id) {
    return this.sanitizer.bypassSecurityTrustUrl(url(`candidates/${id}/image/`));
  }

  update(id, data, image = null) {
    const fd = new FormData();
    for (const row of Object.entries(data)) {
      const key = row[0];
      const value = row[1] as string;
      fd.append(key, value);
    }
    if (image) {
      fd.append('image', image);
    }
    return this.http.patch<any>(url(`candidates/${id}`), fd);
  }
}
