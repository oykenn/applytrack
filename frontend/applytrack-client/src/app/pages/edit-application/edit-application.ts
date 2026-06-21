// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-edit-application',
//   imports: [],
//   templateUrl: './edit-application.html',
//   styleUrl: './edit-application.css',
// })
// export class EditApplication {}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

import { AuthService } from '../../services/auth';
import { ApplicationService } from '../../services/application';

@Component({
  selector: 'app-edit-application',
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf],
  templateUrl: './edit-application.html',
  styleUrls: ['./edit-application.css']
})
export class EditApplication implements OnInit {
  applicationId!: number;
  errorMessage = '';
  isLoading = true;
  isSaving = false;

  formData = {
    company_name: '',
    position: '',
    application_type: '',
    work_setup: '',
    location: '',
    job_link: '',
    status: '',
    date_applied: '',
    contact_person: '',
    contact_email: '',
    interview_date: '',
    interview_time: '',
    interview_mode: '',
    meeting_link: '',
    notes: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.applicationId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.applicationId) {
      this.errorMessage = 'Invalid application ID.';
      this.isLoading = false;
      return;
    }

    this.loadApplication();
  }

  loadApplication(): void {
    this.applicationService.getApplicationById(this.applicationId).subscribe({
      next: (response) => {
        const app = response.application;

        this.formData = {
          company_name: app.company_name || '',
          position: app.position || '',
          application_type: app.application_type || 'Internship',
          work_setup: app.work_setup || 'Hybrid',
          location: app.location || '',
          job_link: app.job_link || '',
          status: app.status || 'Pending',
          date_applied: app.date_applied ? app.date_applied.substring(0, 10) : '',
          contact_person: app.contact_person || '',
          contact_email: app.contact_email || '',
          interview_date: app.interview_date ? app.interview_date.substring(0, 10) : '',
          interview_time: app.interview_time || '',
          interview_mode: app.interview_mode || '',
          meeting_link: app.meeting_link || '',
          notes: app.notes || ''
        };

        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load application.';
        this.isLoading = false;
      }
    });
  }

  updateApplication(): void {
    this.errorMessage = '';

    if (!this.formData.company_name || !this.formData.position) {
      this.errorMessage = 'Company name and position are required.';
      return;
    }

    this.isSaving = true;

    this.applicationService.updateApplication(this.applicationId, this.formData).subscribe({
      next: () => {
        this.router.navigate(['/applications', this.applicationId]);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to update application.';
        this.isSaving = false;
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}