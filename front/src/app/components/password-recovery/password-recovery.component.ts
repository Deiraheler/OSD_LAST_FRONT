import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css'
})
export class PasswordRecoveryComponent implements OnInit {
  recoveryForm!: FormGroup;
  message: string = '';
  error: string = '';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.recoveryForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  sendRecoveryLink(): void {
    if (this.recoveryForm.invalid) {
      this.recoveryForm.markAllAsTouched();
      return;
    }
    const payload = { email: this.recoveryForm.get('email')?.value };



    this.http.post('https://p6t8t8ddq0.execute-api.eu-west-1.amazonaws.com/1/create-recovery', payload, this.httpOptions)
      .subscribe({
        next: (response: any) => {
          // Assuming the server returns { success: true, message: '...' } on success
          if (response.success) {
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
