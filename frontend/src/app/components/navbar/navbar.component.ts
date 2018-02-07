import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(protected router: Router, protected activatedRoute: ActivatedRoute, protected authenticationService: AuthenticationService) {}
  async logout() {      
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
