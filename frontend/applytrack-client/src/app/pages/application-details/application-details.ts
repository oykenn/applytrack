// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-application-details',
//   imports: [],
//   templateUrl: './application-details.html',
//   styleUrl: './application-details.css',
// })
// export class ApplicationDetails {}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, NgIf } from '@angular/common';

import { AuthService } from '../../services/auth';
import { ApplicationService } from '../../services/application';

@Component({
  selector: 'app-application-details',
  standalone: true,
  imports: [RouterLink, NgIf, DatePipe],
  templateUrl: './application-details.html',
  styleUrls: ['./application-details.css']
})
export class ApplicationDetails implements OnInit {
  application: any;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage = 'Invalid application ID.';
      this.isLoading = false;
      return;
    }

    this.loadApplication(id);
  }

  loadApplication(id: number): void {
    this.applicationService.getApplicationById(id).subscribe({
      next: (response) => {
        this.application = response.application;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load application.';
        this.isLoading = false;
      }
    });
  }

  deleteApplication(): void {
    const confirmDelete = confirm('Are you sure you want to delete this application?');

    if (!confirmDelete || !this.application?.id) return;

    this.applicationService.deleteApplication(this.application.id).subscribe({
      next: () => {
        this.router.navigate(['/applications']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to delete application.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}