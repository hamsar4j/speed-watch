import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getSummary(videoUrl: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/get_summary`, { url: videoUrl });
  }

  chat(chatRequest: {
    user_input: string;
    video_url: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/chat`, chatRequest);
  }
}
