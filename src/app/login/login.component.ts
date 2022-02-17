import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  authenticate() {
    if (this.form.valid) {
      let user = {
        userName: this.form.get('username')?.value,
        password: this.form.get('password')?.value,
      };

      console.log(user);

      this.authenticationService.authenticate(user).subscribe((answer: any) => {
        console.log(answer);

        if (answer['status'] === 'OK') {
          sessionStorage.setItem(
            environment.sessionToken,
            'Basic ' + btoa(user.userName + ':' + user.password)
          );
          this.routeTo('/home');
        } else {
          sessionStorage.setItem('session', '');
          //show error
        }
      });
    }
  }

  routeTo(path: string) {
    this.router.navigateByUrl(path);
  }
}
