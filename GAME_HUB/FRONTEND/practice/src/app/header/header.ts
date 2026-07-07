import { Component, Inject, PLATFORM_ID, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../services/profile';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  private isBrowser: boolean;
  dropdownOpen = false;
  userProfile: any = null;
  isScrolled = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private profileService: ProfileService,
    private router: Router,
    private http: HttpClient,
    private elementRef: ElementRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.loadUserProfile();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      this.isScrolled = window.scrollY > 50;
    }
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return localStorage.getItem('userToken') !== null;
  }

  loadUserProfile() {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
      },
      error: (err) => {
        console.error('Failed to load user profile in header', err);
        if (err.status === 401) {
          localStorage.removeItem('userToken');
        }
      }
    });
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen && !this.userProfile && this.isLoggedIn()) {
      this.loadUserProfile();
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.dropdownOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  onLogout() {
    this.dropdownOpen = false;
    this.http.post('http://localhost:5238/api/auth/logout', {}).subscribe({
      next: () => {
        localStorage.clear();
        this.userProfile = null;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout request error, proceeding with local clear', err);
        localStorage.clear();
        this.userProfile = null;
        this.router.navigate(['/login']);
      }
    });
  }
}
