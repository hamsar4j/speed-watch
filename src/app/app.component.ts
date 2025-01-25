import { Component } from '@angular/core';
import { SummaryService } from './services/summary.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: ` <div
    class="dm-sans-font flex min-h-screen flex-col items-center justify-center bg-black p-6"
  >
    <h1 class="mb-10 text-center text-6xl font-light text-white">SpeedWatch</h1>
    <div class="w-full max-w-2xl justify-center">
      <div class="mb-6 flex">
        <input
          [(ngModel)]="videoUrl"
          placeholder="Enter YouTube Video URL"
          class="flex-grow rounded-l-2xl border border-white px-4 py-2 text-white focus:border-sky-500 focus:outline focus:outline-sky-500"
        />
        <button
          (click)="fetchSummary()"
          class="rounded-r-2xl border border-white bg-white px-6 py-2 text-black hover:opacity-80"
        >
          Generate Summary
        </button>
      </div>
      <div *ngIf="isLoading" class="flex items-center justify-center">
        <div
          class="h-10 w-10 animate-spin rounded-full border-t-2 border-blue-500"
        ></div>
      </div>
      <div *ngIf="isError" class="flex items-center justify-center">
        <div class="text-red-500">
          {{ errorMsg }}
        </div>
      </div>
      <div
        *ngIf="summary"
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-md"
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
  isLoading: boolean = false;
  isError: boolean = false;
  errorMsg: string = `Please check that your URL is in the correct format`;

  constructor(private summaryService: SummaryService) {}

  fetchSummary() {
    this.isLoading = false;
    this.isError = false;
    this.summary = '';

    if (this.videoUrl) {
      this.isLoading = true;
      this.summaryService.getSummary(this.videoUrl).subscribe({
        next: (data) => {
          this.summary = data.summary;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error: ', err);
          this.isLoading = false;
          this.isError = true;
        },
      });
    }
  }
}
