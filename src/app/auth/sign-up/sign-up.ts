import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss'
})
export class SignUp {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder,private auth: AuthService,private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    this.auth.signup(this.signupForm.value).subscribe({
      next: res => {
        localStorage.setItem('authData', JSON.stringify(res));
        this.router.navigate(['/auth/login']);
      },
      error: err => alert(err.error.message || 'signUp failed')
    });
  }
  }

