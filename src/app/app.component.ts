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
          <mat-icon class="hover:animate-wiggle">chevron_right</mat-icon>
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
      <div *ngIf="chatMessages.length > 0" class="mt-6">
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
          <div class="chat-messages mb-4 max-h-96 overflow-y-auto">
            <div *ngFor="let message of chatMessages" class="mb-4">
              <div
                [ngClass]="{
                  'user-message': message.role === 'user',
                  'assistant-message': message.role === 'assistant',
                }"
                class="message-bubble"
              >
                <div class="message-content">
                  {{ message.content }}
                </div>
                <div class="message-timestamp mt-1 text-xs text-gray-500">
                  {{ message.timestamp }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex">
            <input
              [(ngModel)]="chatInput"
              placeholder="Ask a question about the video"
              class="flex-grow rounded-2xl border border-gray-300 px-4 py-2 text-black focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <button
              (click)="sendChatMessage()"
              class="hover:opacity-80% ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white"
            >
              <mat-icon class="hover:animate-wiggle">chevron_right </mat-icon>
            </button>
          </div>
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
  chatMessages: { role: string; content: string; timestamp: string }[] = [];

  constructor(private summaryService: SummaryService) {}

  fetchSummary() {
    this.isLoading = false;
    this.isError = false;
    this.summary = '';
    this.chatMessages = []; // clear previous chat messages

    if (this.videoUrl) {
      this.isLoading = true;
      this.summaryService.getSummary(this.videoUrl).subscribe({
        next: (data) => {
          this.summary = data.summary;
          this.isLoading = false;

          // add the summary as the first message from the bot
          this.chatMessages.push({
            role: 'assistant',
            content: `Here's the summary of the video:\n\n${this.summary}`,
            timestamp: this.getCurrentTimestamp(),
          });
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
      const video_url = this.videoUrl;
      this.chatMessages.push({
        role: 'user',
        content: this.chatInput,
        timestamp: this.getCurrentTimestamp(),
      });
      this.summaryService
        .chat({ user_input: this.chatInput, video_url: video_url })
        .subscribe({
          next: (data) => {
            this.chatMessages.push({
              role: 'assistant',
              content: data.response,
              timestamp: this.getCurrentTimestamp(),
            });
            this.chatInput = '';
          },
          error: (err) => {
            console.error('Error: ', err);
          },
        });
    }
  }

  getCurrentTimestamp(): string {
    return new Date().toLocaleTimeString();
  }
}
