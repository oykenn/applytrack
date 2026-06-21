import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  formData = {
    fullname: '',
    email: '',
    password: '',
    course: '',
    school: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.fullname || !this.formData.email || !this.formData.password) {
      this.errorMessage = 'Full name, email, and password are required.';
      return;
    }

    this.isLoading = true;

    this.authService.register(this.formData).subscribe({
      next: () => {
        this.successMessage = 'Account created successfully. Redirecting to login...';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Registration failed.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}