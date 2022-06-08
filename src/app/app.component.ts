import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public router: Router, public afAuth: AngularFireAuth, public platform: Platform) { }
  initializeApp() {
    this.platform.ready().then(() => {
      this.afAuth.user.subscribe(user => {
        if (user) {
          this.router.navigate(["/home"]);
        } else {
          this.router.navigate(["/login"]);
        }
      }, err => {
        this.router.navigate(["/login"]);
      }, () => {
        //this.splashScreen.hide();
      })
      //this.statusBar.styleDefault();
    });
  }
}
