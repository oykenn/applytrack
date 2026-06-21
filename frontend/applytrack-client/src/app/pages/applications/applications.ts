// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-applications',
//   imports: [],
//   templateUrl: './applications.html',
//   styleUrl: './applications.css',
// })
// export class Applications {}

import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth';
import { ApplicationService } from '../../services/application';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, DatePipe, FormsModule],
  templateUrl: './applications.html',
  styleUrls: ['./applications.css']
})
export class Applications implements OnInit {
  user: any;
  applications: any[] = [];
  filteredApplications: any[] = [];

  searchText = '';
  selectedStatus = 'All';

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
        this.filteredApplications = this.applications;
      },
      error: (error) => {
        console.error('Applications error:', error);
      }
    });
  }

  filterApplications(): void {
    const search = this.searchText.toLowerCase();

    this.filteredApplications = this.applications.filter((app) => {
      const matchesSearch =
        app.company_name?.toLowerCase().includes(search) ||
        app.position?.toLowerCase().includes(search) ||
        app.location?.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All' || app.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  deleteApplication(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this application?');

    if (!confirmDelete) return;

    this.applicationService.deleteApplication(id).subscribe({
      next: () => {
        this.applications = this.applications.filter(app => app.id !== id);
        this.filterApplications();
      },
      error: (error) => {
        console.error('Delete error:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}