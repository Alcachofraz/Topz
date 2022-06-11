import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { FireauthService } from '../fireauthservice.service';
import { FireserviceService } from '../fireservice.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { UserProfile } from '../user-profile';
import { UploadImageComponent } from '../upload-image/upload-image.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  user: UserProfile = null;
  editable: boolean = false;

  constructor(public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public fser: FireserviceService,
    public auth: FireauthService,
    private angularFirestore: AngularFirestore,
    public angularFireStorage: AngularFireStorage,
    public router: Router,
    public sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    public toastController: ToastController,
    public popoverController: PopoverController,
    public nav: NavController,
  ) {
  }

  async presentPopover() {
    if (!this.editable) return;
    const popover = await this.popoverController.create({
      component: UploadImageComponent,
      cssClass: '.popover-no-margin',
      componentProps: { uid: this.user.uid }
    });
    await popover.present();
  }

  async ngOnInit() {
    let uid = this.activatedRoute.snapshot.paramMap.get('uid');
    this.editable = (await this.fser.getUser()).id == uid;
    (await this.fser.streamUserByUid(uid)).subscribe(async data => {
      this.user = {
        uid: data.payload.id,
        username: data.payload.data()['username'],
        email: data.payload.data()['email'],
        photoUrl: data.payload.data()['photoUrl'],
      };
    });
  }

  goBack() {
    this.nav.back();
  }

  logout() {
    if (!this.editable) return;
    this.auth.doLogout()
      .then(res => {
        this.nav.navigateRoot('/login');
      }, err => {
        console.log(err);
      })
  }

  a() {
    console.log('editable: ' + this.editable);
  }
}
