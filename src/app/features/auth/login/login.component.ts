import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { LoginCredentials } from '../../../models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatCheckboxModule
  ],
  template: `
    <div class="login-container">
      <div class="login-background">
        <div class="photo-credit">Foto: Acervo Insanos M.C.</div>
      </div>
      <div class="login-form-container">
        <div class="login-header">
          <div class="logo-title-container">
            <img src="assets/logo/logo-issi.svg" alt="Logo" class="logo" />
            <div class="title-container">
              <h1>Sistema de Gestão</h1>
              <h2>de Staff</h2>
            </div>
          </div>
          <h2 class="welcome-text">Seja bem vindo!</h2>
        </div>

        <div class="login-form">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="username">Usuário</label>
              <input
                type="text"
                id="username"
                formControlName="username"
                placeholder="Digite o usuário"
              />
              <div class="error-message" *ngIf="loginForm.get('username')?.errors?.['required'] && loginForm.get('username')?.touched">
                Usuário é obrigatório
              </div>
            </div>

            <div class="form-group">
              <label for="password">Senha</label>
              <div class="password-input-container">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  id="password"
                  formControlName="password"
                  placeholder="Digite a senha"
                />
                <span
                  class="password-toggle"
                  (click)="togglePasswordVisibility()"
                  [title]="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
                >
                  <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </span>
              </div>
              <div class="error-message" *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched">
                Senha é obrigatória
              </div>
            </div>

            <div class="form-options">
              <div class="remember-me">
                <mat-checkbox formControlName="remember">Lembrar-me</mat-checkbox>
              </div>
              <a href="#" class="forgot-password">Esqueci a senha</a>
            </div>

            <button type="submit" class="login-button" [disabled]="loginForm.invalid || isLoading">
              Acessar
              <span class="loading-spinner" *ngIf="isLoading"></span>
            </button>
            <div class="error-message" *ngIf="loginError">{{loginError}}</div>
          </form>

          <div class="support-contact">
            <button class="support-button">Contato com o suporte</button>
          </div>
        </div>

        <div class="login-footer">
          <div class="footer-logos">
            <img src="assets/logo/logo-operacional.svg" alt="Logo Operacional" />
            <img src="assets/logo/logo-ti.svg" alt="Logo TI" />
          </div>
          <p>© Insanos M.C. Tecnologia e Instrução 2025</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = null;
      const credentials: any = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };
      this.authService.login(credentials).pipe(
        catchError((err) => {
          this.loginError = 'Usuário ou senha inválidos';
          this.isLoading = false;
          return of(null);
        })
      ).subscribe((res) => {
        this.isLoading = false;
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          if (res.user) {
            localStorage.setItem('user', JSON.stringify(res.user));
          }
          this.router.navigate(['/volunteers']);
        } else if (!this.loginError) {
          this.loginError = 'Usuário ou senha inválidos';
        }
      });
    }
  }
}
