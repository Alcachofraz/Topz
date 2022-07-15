import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { FireAuthService } from '../fireauthservice.service';
import { FireService } from '../fireservice.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { UserProfile } from '../user-profile';
import { FireStorageService } from '../storageservice.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  user: UserProfile = null;
  editable: boolean = false;

  constructor(
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public fser: FireService,
    public auth: FireAuthService,
    private angularFirestore: AngularFirestore,
    public angularFireStorage: AngularFireStorage,
    public router: Router,
    public sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    public toastController: ToastController,
    public popoverController: PopoverController,
    public nav: NavController,
    public storage: FireStorageService,
  ) {
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

  fileUpload(event: FileList) {
    this.storage.uploadPhotoUrl(event, this.user.uid, this.popoverController);
  }

  dismiss() {
    this.popoverController.dismiss();
  }
}
