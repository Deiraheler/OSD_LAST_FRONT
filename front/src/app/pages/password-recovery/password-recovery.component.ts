import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgIf
  ],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css'
})
export class PasswordRecoveryComponentPage implements OnInit {
  token: string | null = null;      // Will hold the reset token from URL
  newPassword: string = '';         // Bound to form input
  message: string = '';             // Feedback message to user
  success: boolean = false;         // Flag to conditionally show success or form

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

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

  // Construct the request body
  const payload = {
    token: this.token,
    newPassword: this.newPassword
  };

  // POST to your backend / serverless API
  this.http.post('https://p6t8t8ddq0.execute-api.eu-west-1.amazonaws.com/1/verify-recovery', payload, httpOptions)
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
