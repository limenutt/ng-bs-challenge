import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage implements OnInit {
  authenticationInProgress: boolean;
  authenticationError: string;
  loginFormControls: { email: FormControl, password: FormControl }
  loginForm: FormGroup;
  constructor(protected router: Router, protected authenticationService: AuthenticationService) {}
  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }
  protected createFormControls() {
    this.loginFormControls = {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required ])
    };
  }
  protected createForm() {
    this.loginForm = new FormGroup(this.loginFormControls);
  }
  async submit(type: 'signin' | 'signup') {
    try {
      let result: boolean;
      if (type === 'signin') {
        result = await this.authenticationService.signIn(this.loginFormControls.email.value, this.loginFormControls.password.value);
      } else {
        result = await this.authenticationService.signUp(this.loginFormControls.email.value, this.loginFormControls.password.value);
      }
      if (!result) {
        throw new Error('Unexpected authentication error has happened');
      }
      this.router.navigate(['/app']);
    } catch (error) {
      this.authenticationError = (error.error && error.error.error) || (<Error>error).message;
    } finally {
      this.authenticationInProgress = false;
    }
  }
}
