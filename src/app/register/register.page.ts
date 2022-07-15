import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserCredential } from 'firebase/auth';
import { FireAuthService } from '../fireauthservice.service';
import { FireService } from '../fireservice.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required.' },
      {
        type: 'minlength', message: 'Username must be at least 3 characters long.'
      }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      {
        type: 'minlength', message: 'Password must be at least 5 characters long.'
      }
    ]
  };
  constructor(
    private authService: FireAuthService,
    private firestore: FireService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }
  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.minLength(3),
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }
  tryRegister(value) {
    console.log('email: ' + value.email);
    console.log('password: ' + value.password);
    console.log('username: ' + value.username);
    this.authService.doRegister(value)
      .then(res => {
        console.log('uid: ' + (res as UserCredential).user.uid);
        this.errorMessage = "";
        this.successMessage = "Your account has been created. Please log in.";
        return this.firestore.createUser((res as UserCredential).user.uid, value.email, value.username)
          .catch(
            (error) => console.log(error)
          ).then(
            () => console.log("Created user.")
          );
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      })
  }
  goLoginPage() {
    this.router.navigate(["/login"]);
  }
} 
