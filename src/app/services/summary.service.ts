import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  private apiUrl = 'http://0.0.0.0:8000/get_summary';

  constructor(private http: HttpClient) {}

  getSummary(videoUrl: string): Observable<any> {
    const body = { url: videoUrl };
    return this.http.post<any>(this.apiUrl, body);
  }
}
