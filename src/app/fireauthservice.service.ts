import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { Injectable } from '@angular/core';
import { FireserviceService } from './fireservice.service';
@Injectable({
  providedIn: 'root'
})
export class FireauthService {
  constructor(
    private firebaseService: FireserviceService,
    public afAuth: AngularFireAuth
  ) { }
  doRegister(value) {
    return new Promise<any>((resolve, reject) =>
      this.afAuth.createUserWithEmailAndPassword(value.email,
        value.password)
        .then(
          res => resolve(res),
          err => reject(err)))
  }
  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(value.email,
        value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }
  doLogout() {
    return new Promise<void>((resolve, reject) => {
      this.afAuth.signOut()
        .then(() => {
          this.firebaseService.unsubscribeOnLogOut();
          resolve();
        }).catch((error) => {
          console.log(error);
          reject();
        });
    })
  }
}
