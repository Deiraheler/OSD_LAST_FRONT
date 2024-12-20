import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})

export class AuthComponent {
  formSelected = 'login';
  loginData: any;
  registerData: any;
  public loginForm!: FormGroup;
  public registerForm!: FormGroup;
  public errors: string[] = [];

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.initializeFormLogin();
    this.initializeFormRegister();
  }

  initializeFormLogin() {
    this.loginForm = new FormGroup({
      email: new FormControl(this.loginData?.email || '', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(this.loginData?.password || '', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  initializeFormRegister() {
    this.registerForm = new FormGroup({
      email: new FormControl(this.registerData?.email || '', [
        Validators.required,
        Validators.email,
      ]),
      name: new FormControl(this.registerData?.name || '', [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl(this.registerData?.password || '', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl(this.registerData?.confirmPassword || '', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  get EmailLogin() {
    return this.loginForm.get('email') as FormControl;
  }

  get PasswordLogin() {
    return this.loginForm.get('password') as FormControl;
  }

  get EmailRegister() {
    return this.registerForm.get('email') as FormControl;
  }

  get NameRegister() {
    return this.registerForm.get('name') as FormControl;
  }

  get PasswordRegister() {
    return this.registerForm.get('password') as FormControl;
  }

  get ConfirmPasswordRegister() {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  login() {
    this.formSelected = 'login';
  }

  register() {
    this.formSelected = 'register';
  }

  loginUser() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.EmailLogin.value, this.PasswordLogin.value).subscribe({
      next: (data) => {
        console.log('Login successful', data);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login error', error);
        if (error.status === 401) {
          this.errors.push('Invalid credentials');
        }else{
          this.errors.push('Something went wrong');
        }
      }
    });

    //SetTimeout to remove the error message after 5 seconds
    setTimeout(() => {
      this.errors = [];
    }, 3000);
  }

  registerUser() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.register(this.EmailRegister.value, this.NameRegister.value, this.PasswordRegister.value).subscribe({
      next: (data) => {
        console.log('Register successful', data);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Register error', error);
        if (error.status === 400) {
          this.errors.push('Invalid data');
        }else {
          this.errors.push('Something went wrong');
        }
      }
    });

    //SetTimeout to remove the error message after 5 seconds
    setTimeout(() => {
      this.errors = [];
    }, 3000);
  }

  removeError(error: string) {
    this.errors = this.errors.filter((e) => e !== error);
  }
}
