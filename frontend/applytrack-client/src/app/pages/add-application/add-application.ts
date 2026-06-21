// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-add-application',
//   imports: [],
//   templateUrl: './add-application.html',
//   styleUrl: './add-application.css',
// })
// export class AddApplication {}


import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

import { AuthService } from '../../services/auth';
import { ApplicationService } from '../../services/application';

@Component({
  selector: 'app-add-application',
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf],
  templateUrl: './add-application.html',
  styleUrls: ['./add-application.css']
})
export class AddApplication {
  errorMessage = '';
  isLoading = false;

  formData = {
    company_name: '',
    position: '',
    application_type: 'Internship',
    work_setup: 'Hybrid',
    location: '',
    job_link: '',
    status: 'Pending',
    date_applied: '',
    contact_person: '',
    contact_email: '',
    notes: ''
  };

  constructor(
    private authService: AuthService,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  addApplication(): void {
    this.errorMessage = '';

    if (!this.formData.company_name || !this.formData.position) {
      this.errorMessage = 'Company name and position are required.';
      return;
    }

    this.isLoading = true;

    this.applicationService.addApplication(this.formData).subscribe({
      next: () => {
        this.router.navigate(['/applications']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to add application.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}