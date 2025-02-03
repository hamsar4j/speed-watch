import { Component } from '@angular/core';
import { SummaryService } from './services/summary.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
  template: ` <div
    class="dm-sans-font flex min-h-screen flex-col items-center justify-center bg-black bg-[url(/red_distortion_3.jpg)] p-6"
  >
    <h1 class="mb-4 text-center text-6xl font-light text-white">SpeedWatch</h1>
    <span class="p-4 text-zinc-400"
      >Summarise Youtube videos to text with a click of a button</span
    >
    <div class="w-full max-w-2xl justify-center">
      <div class="mb-6 flex">
        <input
          [(ngModel)]="videoUrl"
          placeholder="Enter YouTube Video URL"
          class="flex-grow rounded-2xl border border-white px-4 py-2 text-white focus:border-sky-500 focus:outline focus:outline-sky-500"
        />
        <button
          (click)="fetchSummary()"
          class="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-white hover:opacity-80"
        >
          <mat-icon class="transition duration-300 hover:rotate-90"
            >chevron_right</mat-icon
          >
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
      <div *ngIf="summary" class="mt-6">
        <h2 class="mb-4 text-2xl font-semibold text-gray-700">Chat</h2>
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
          <div *ngFor="let message of chatMessages" class="mb-4">
            <div class="text-gray-700">
              {{ message.role }}: {{ message.content }}
            </div>
          </div>
          <input
            [(ngModel)]="chatInput"
            placeholder="Ask a question about the video"
            class="flex-grow rounded-2xl border border-black px-4 py-2 text-black focus:border-sky-500 focus:outline focus:outline-sky-500"
          />
          <button
            (click)="sendChatMessage()"
            class="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-white hover:opacity-80"
          >
            <mat-icon class="transition duration-300 hover:rotate-90"
              >chevron_right</mat-icon
            >
          </button>
        </div>
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
  chatInput: string = '';
  chatMessages: { role: string; content: string }[] = [];

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

  sendChatMessage() {
    if (this.chatInput && this.videoUrl) {
      const video_id = this.extractVideoId(this.videoUrl);
      this.chatMessages.push({ role: 'user', content: this.chatInput });
      this.summaryService
        .chat({ user_input: this.chatInput, video_id: video_id })
        .subscribe({
          next: (data) => {
            this.chatMessages.push({
              role: 'assistant',
              content: data.response,
            });
            this.chatInput = '';
          },
          error: (err) => {
            console.error('Error: ', err);
          },
        });
    }
  }

  extractVideoId(url: string): string {
    const match = url.match(/v=([^&]+)/);
    return match ? match[1] : '';
  }
}
