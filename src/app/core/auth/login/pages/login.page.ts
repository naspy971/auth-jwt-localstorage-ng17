import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AuthService} from "../../auth.service";
import {Login} from "../interfaces";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatFormField,
    MatInput,
    ReactiveFormsModule
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage implements OnInit {
  private readonly authSvc = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLoginFormSubmitted() {
    if (!this.loginForm.valid) {
      return;
    }

    this.authSvc.login(this.loginForm.value as Login).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}
