import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})

export class ProfileComponent implements OnInit {
  user: any;

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit() {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.router.navigate(['/login']);
      }
    });
  }
}
