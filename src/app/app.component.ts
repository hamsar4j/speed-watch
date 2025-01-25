import { Component } from '@angular/core';
import { SummaryService } from './services/summary.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: ` <div
    class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6"
  >
    <h1 class="mb-10 text-center text-4xl font-bold text-gray-800">
      YouTube Summary Generator
    </h1>

    <div class="w-full max-w-2xl">
      <div class="mb-6 flex">
        <input
          [(ngModel)]="videoUrl"
          placeholder="Enter YouTube Video URL"
          class="flex-grow rounded-l-lg border-2 border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          (click)="fetchSummary()"
          class="rounded-r-lg bg-blue-600 px-6 py-2 text-white transition duration-300 hover:bg-blue-700"
        >
          Generate Summary
        </button>
      </div>

      <div
        *ngIf="summary"
        class="rounded-lg border border-gray-200 bg-white p-6 shadow-md"
      >
        <h2 class="mb-4 text-2xl font-semibold text-gray-700">Summary</h2>
        <p class="leading-relaxed text-gray-600">{{ summary }}</p>
      </div>
    </div>
  </div>`,
})
export class AppComponent {
  title = 'speed-watch';
  videoUrl: string = '';
  summary: string = '';

  constructor(private summaryService: SummaryService) {}

  fetchSummary() {
    if (this.videoUrl) {
      this.summaryService.getSummary(this.videoUrl).subscribe({
        next: (data) => {
          this.summary = data.summary;
        },
        error: (err) => {
          console.error('Error: ', err);
        },
      });
    }
  }
}
