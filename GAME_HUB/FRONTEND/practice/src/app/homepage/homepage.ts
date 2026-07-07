import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterLink, Header],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage implements OnInit, OnDestroy, AfterViewInit {
  private isBrowser: boolean;
  typedText = '';
  private fullText = 'Welcome to GameHub';
  private typeIndex = 0;
  private typeTimer: any;
  showCursor = true;
  private cursorTimer: any;

  stats = [
    { label: 'Active Players', target: 1200, current: 0, suffix: '+' },
    { label: 'Games Available', target: 50, current: 0, suffix: '+' },
    { label: 'Scores Recorded', target: 10000, current: 0, suffix: '+' }
  ];
  statsAnimated = false;

  features = [
    { icon: '🕹️', title: 'Multiple Games', desc: 'Choose from a growing library of fun and challenging browser games.' },
    { icon: '🏆', title: 'Leaderboards', desc: 'Compete globally and climb the ranks with your high scores.' },
    { icon: '👤', title: 'Player Profiles', desc: 'Track your achievements, stats, and gaming journey.' },
    { icon: '⚡', title: 'Instant Play', desc: 'No downloads needed. Jump right into the action from your browser.' }
  ];

  private observer: IntersectionObserver | null = null;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return localStorage.getItem('userToken') !== null;
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.startTypewriter();
      this.cursorTimer = setInterval(() => this.showCursor = !this.showCursor, 530);
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.setupScrollObserver();
    }
  }

  ngOnDestroy() {
    if (this.typeTimer) clearTimeout(this.typeTimer);
    if (this.cursorTimer) clearInterval(this.cursorTimer);
    if (this.observer) this.observer.disconnect();
  }

  private startTypewriter() {
    if (this.typeIndex < this.fullText.length) {
      this.typedText += this.fullText.charAt(this.typeIndex);
      this.typeIndex++;
      this.typeTimer = setTimeout(() => this.startTypewriter(), 80);
    }
  }

  private setupScrollObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          if (entry.target.classList.contains('stats-section') && !this.statsAnimated) {
            this.statsAnimated = true;
            this.animateCounters();
          }
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.scroll-reveal, .stats-section').forEach(el => {
      this.observer?.observe(el);
    });
  }

  private animateCounters() {
    this.stats.forEach(stat => {
      const duration = 2000;
      const steps = 60;
      const increment = stat.target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.target) {
          stat.current = stat.target;
          clearInterval(timer);
        } else {
          stat.current = Math.floor(current);
        }
      }, duration / steps);
    });
  }
}