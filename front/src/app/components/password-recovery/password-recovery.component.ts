import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css'
})
export class PasswordRecoveryComponent implements OnInit {
  token: string | null = null;
  newPassword: string = '';
  message: string = '';
  success: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Read the 'token' from the query parameters
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
    });
  }

  onSubmit(): void {
    // Basic check if we have a token
    if (!this.token) {
      this.message = 'Invalid or missing reset token.';
      return;
    }

    // Construct the request body
    const payload = {
      token: this.token,
      newPassword: this.newPassword
    };

    // POST to your backend / serverless API
    // Replace 'API_ENDPOINT' with your actual URL
    this.http.post('https://<API_ENDPOINT>/confirmPasswordReset', payload)
      .subscribe({
        next: (response: any) => {
          // Assuming the server returns { success: true, message: '...' } on success
          if (response.success) {
            this.success = true;
            this.message = response.message || 'Password updated successfully!';
          } else {
            this.message = response.message || 'Something went wrong.';
          }
        },
        error: (err) => {
          console.error('Error resetting password:', err);
          this.message = err.error?.message || 'Server error. Please try again later.';
        }
      });
  }
}
