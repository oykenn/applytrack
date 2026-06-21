// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashboard',
//   imports: [],
//   templateUrl: './dashboard.html',
//   styleUrl: './dashboard.css',
// })
// export class Dashboard {}

import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
// import { NgFor, NgIf } from '@angular/common';
import { NgFor, NgIf, DatePipe } from '@angular/common';

import { AuthService } from '../../services/auth';
import { ApplicationService } from '../../services/application';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, DatePipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  user: any;
  applications: any[] = [];

  total = 0;
  pending = 0;
  interview = 0;
  accepted = 0;
  rejected = 0;

  constructor(
    private authService: AuthService,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadApplications();
  }

  loadApplications(): void {
    this.applicationService.getApplications().subscribe({
      next: (response) => {
        this.applications = response.applications || [];
        this.calculateStats();
      },
      error: (error) => {
        console.error('Dashboard error:', error);
      }
    });
  }

  calculateStats(): void {
    this.total = this.applications.length;
    this.pending = this.applications.filter(app => app.status === 'Pending').length;
    this.interview = this.applications.filter(app => app.status === 'Interview').length;
    this.accepted = this.applications.filter(app => app.status === 'Accepted').length;
    this.rejected = this.applications.filter(app => app.status === 'Rejected').length;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}