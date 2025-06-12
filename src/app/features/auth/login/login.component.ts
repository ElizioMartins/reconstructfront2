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
  styles: [`
    .login-container {
      display: flex;
      height: 100vh;
      width: 100%;
      overflow: hidden;
      font-family: Arial, sans-serif;
      box-sizing: border-box;
      background-color: white;
    }

    .login-background {
      flex: 1;
      background-color: #000000;
      background-image: url('assets/banner/Rectangle.png');
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .photo-credit {
      position: absolute;
      bottom: 10px;
      left: 10px;
      color: white;
      font-size: 12px;
      opacity: 0.7;
    }

    .login-form-container {
      width: 550px;
      min-width: 550px;
      background-color: white;
      display: flex;
      flex-direction: column;
      padding: 0px 50px;
      box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
      overflow-y: auto;
      justify-content: center;
    }

    .login-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .logo-title-container {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      align-self: center;
    }

    .logo {
      width: 18%;
      height: auto;
      margin-right: 5%;
      min-width: 80px;
      max-width: 120px;
    }

    .welcome-text {
      font-size: 26px;
      margin: 0;
      color: #333;
      font-weight: 500;
      margin-bottom: 15px;
      margin-top: 5px;
      align-self: center;
    }

    .title-container {
      display: flex;
      flex-direction: column;
    }

    .title-container h1 {
      font-size: 22px;
      margin: 0;
      color: #333;
      font-weight: 600;
    }

    .title-container h2 {
      font-size: 22px;
      margin: 0;
      color: #333;
      font-weight: 600;
    }

    .login-form {
      flex: 0;
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .form-group {
      margin-bottom: 25px;
    }

    .form-group label {
      display: block;
      margin-bottom: 10px;
      font-size: 16px;
      color: #666;
      font-weight: normal;
    }

    .form-group input {
      width: 100%;
      padding: 12px 15px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 16px;
      background-color: #f8f8f8;
      box-sizing: border-box;
      color: #333;
    }

    .password-input-container {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .form-options {
      align-items: center;
      margin-bottom: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
    }

    .remember-me {
      display: flex;
      align-items: center;
    }

    .forgot-password {
      color: #0078ff;
      text-decoration: none;
      font-size: 16px;
    }

    .login-button {
      background-color: #0078ff;
      color: white;
      border: none;
      padding: 14px;
      border-radius: 6px;
      font-size: 18px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s;
      width: 100%;
    }

    .login-button:hover {
      background-color: #0065d9;
    }

    .support-contact {
      margin-top: 0 !important;
      margin-bottom: 30px;
    }

    .support-button {
      width: 100%;
      padding: 14px;
      background-color: #333;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 15px;
    }

    .login-footer {
      text-align: center;
    }

    .footer-logos {
      display: flex;
      justify-content: center;
      gap: 8%;
      width: 100%;
    }

    .footer-logos img {
      width: 15%;
      height: auto;
      min-width: 50px;
      max-width: 90px;
      margin: 0;
      object-fit: contain;
    }

    .login-footer p {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
      margin-bottom: 0;
    }

    .error-message {
      color: #ff0000;
      font-size: 14px;
      margin-top: 5px;
    }

    .loading-spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255,255,255,.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: rotation 1s ease infinite;
      margin-left: 10px;
    }

    @keyframes rotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 1200px) {
      .login-form-container {
        width: 450px;
        min-width: 450px;
        padding: 25px 35px;
      }

      .logo {
        max-width: 100px;
      }

      .footer-logos img {
        max-width: 75px;
      }
    }

    @media (max-width: 992px) {
      .login-background {
        display: none;
      }

      .login-form-container {
        width: 100%;
        min-width: 100%;
        padding: 25px;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
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
      const credentials: LoginCredentials = {
        email: this.loginForm.value.username,
        password: this.loginForm.value.password
      };
      // TODO: Implementar serviço de autenticação
      console.log('Login attempt:', credentials);
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/volunteers']);
      }, 1000);
    }
  }
}
