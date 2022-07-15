import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FireAuthService } from './fireauthservice.service';
import { FireService } from './fireservice.service';
import { finalize, tap } from 'rxjs/operators';
import { Top } from './top';

@Injectable({
  providedIn: 'root'
})
export class FireStorageService {

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
  ) {
    this.isImgUploading = false;
    this.isImgUploaded = false;
  }

  ngFireUploadTask: AngularFireUploadTask;

  progressNum: Observable<number>;

  progressSnapshot: Observable<any>;

  fileUploadedPath: Observable<string>;

  FileName: string;
  FileSize: number;

  isImgUploading: boolean;
  isImgUploaded: boolean;

  uploadPhotoUrl(event: FileList, uid: string, popoverController: PopoverController) {

    const file = event.item(0)

    if (file.type.split('/')[0] !== 'image') {
      console.log('File type is not supported!')
      return;
    }

    this.isImgUploading = true;
    this.isImgUploaded = false;

    this.FileName = file.name;

    const fileStoragePath = `profile-photos/${uid}`;

    const imageRef = this.angularFireStorage.ref(fileStoragePath);

    this.ngFireUploadTask = this.angularFireStorage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(

      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp => {
          this.fileStorage(resp, uid);
          this.isImgUploading = false;
          this.isImgUploaded = true;
          popoverController.dismiss();
        }, error => {
          console.log(error);
        })
      }),
      tap(snap => {
        this.FileSize = snap.totalBytes;
      })
    )
  }


  fileStorage(photoUrl: string, uid: string) {
    this.fser.firestore.collection('users').doc(uid).update({ photoUrl: photoUrl }).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
  }

  uploadTopItemImage(event: FileList, itemId: string, top: Top, items) {

    const file = event.item(0)

    if (file.type.split('/')[0] !== 'image') {
      console.log('File type is not supported!')
      return;
    }

    this.isImgUploading = true;
    this.isImgUploaded = false;

    this.FileName = file.name;

    let fileStoragePath = `tops/${top.author}/${top.$key}/${itemId}`

    const imageRef = this.angularFireStorage.ref(fileStoragePath);

    this.ngFireUploadTask = this.angularFireStorage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(

      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp => {
          let i = items.findIndex((e) => e.$key == itemId);
          items[i].image = resp;
          this.isImgUploading = false;
          this.isImgUploaded = true;
        }, error => {
          console.log(error);
        })
      }),
      tap(snap => {
        this.FileSize = snap.totalBytes;
      })
    )
  }
}
