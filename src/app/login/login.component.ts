import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../_authentication/authentication.service';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, MatCardTitle, MatIcon, MatCardContent, FormsModule, ReactiveFormsModule, MatFormField, MatInput, MatButton]
})
export class LoginComponent implements OnInit {
  showMessage = false;
  form: UntypedFormGroup = new UntypedFormGroup({
    username: new UntypedFormControl('admin'),
    password: new UntypedFormControl('admin'),
  });
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void { }

  authenticate() {
    if (this.form.valid) {
      let user = {
        userName: this.form.get('username')?.value,
        password: this.form.get('password')?.value,
      };

      if (environment.demo === true) {
        this.setDemoData('testuser', 'testpassword');
        return;
      }

      this.authenticationService.authenticate(user).subscribe({
        next: (answer: any) => {

          if (answer['status'] === 'OK') {
           
          
            //TODO: change this to session key
            sessionStorage.setItem(
              environment.sessionToken,
              'Basic ' + btoa(user.userName + ':' + user.password)
            );

            this.showMessage = false;
            sessionStorage.setItem('PRINCIPAL', JSON.stringify(answer));
            this.routeTo('/home');
          } else {
            sessionStorage.setItem('session', '');
            this.showMessage = true;
          }
        },
        error: (er) => {

          sessionStorage.setItem('session', '');
          this.showMessage = true;
          console.log(er);
        }
      });
    }
  }

  setDemoData(name: string, password: string) {
    let demoData = {
      message: 'authenticated',
      status: 'OK',
      user: { name: 'admin', roles: [{ authority: 'ROLE_ADMIN' }] },
    };

    sessionStorage.setItem('PRINCIPAL', JSON.stringify(demoData));

    sessionStorage.setItem(
      environment.sessionToken,
      'Basic ' + btoa(name + ':' + password)
    );

    this.routeTo('/home');
  }

  routeTo(path: string) {
    this.router.navigateByUrl(path);
  }
}
