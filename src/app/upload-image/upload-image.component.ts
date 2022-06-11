import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FireauthService } from '../fireauthservice.service';
import { FireserviceService } from '../fireservice.service';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit {
  @Input() uid: string;

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
  ) {
    this.isImgUploading = false;
    this.isImgUploaded = false;
  }

  async ngOnInit() {

  }

  ngFireUploadTask: AngularFireUploadTask;

  progressNum: Observable<number>;

  progressSnapshot: Observable<any>;

  fileUploadedPath: Observable<string>;

  FileName: string;
  FileSize: number;

  isImgUploading: boolean;
  isImgUploaded: boolean;

  fileUpload(event: FileList) {

    const file = event.item(0)

    if (file.type.split('/')[0] !== 'image') {
      console.log('File type is not supported!')
      return;
    }

    this.isImgUploading = true;
    this.isImgUploaded = false;

    this.FileName = file.name;

    const fileStoragePath = `profile-photos/${this.uid}`;

    const imageRef = this.angularFireStorage.ref(fileStoragePath);

    this.ngFireUploadTask = this.angularFireStorage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(

      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp => {
          this.fileStorage(resp);
          this.isImgUploading = false;
          this.isImgUploaded = true;
          this.dismiss();
        }, error => {
          console.log(error);
        })
      }),
      tap(snap => {
        this.FileSize = snap.totalBytes;
      })
    )
  }


  fileStorage(photoUrl: string) {
    this.fser.firestore.collection('users').doc(this.uid).update({ photoUrl: photoUrl }).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
  }

  dismiss() {
    this.popoverController.dismiss();
  }
}
