import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, IonSlides, ModalController, NavController, PopoverController, ToastController } from '@ionic/angular';
import { FireAuthService } from '../fireauthservice.service';
import { FireService } from '../fireservice.service';
import { FireStorageService } from '../storageservice.service';
import { Top } from '../top';
import { TopItem } from '../top-item';

@Component({
  selector: 'app-edit-top',
  templateUrl: './edit-top.page.html',
  styleUrls: ['./edit-top.page.scss'],
})
export class EditTopPage implements OnInit {
  @ViewChild('slides', { read: IonSlides }) public slides: IonSlides;
  id = null;
  top: Top = null;
  items: Array<TopItem> = null;
  selected_index = 0;
  isPopoverOpen: boolean = false;

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

  topItemImageUpload(event: FileList, itemId: string) {
    this.storage.uploadTopItemImage(event, itemId, this.top, this.items);
  }

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('sid');
    (await this.fser.getAuthorTop(this.id)).subscribe(data => {
      this.top = {
        $key: data.payload.id,
        title: data.payload.data()['title'],
        top: data.payload.data()['top'],
        author: data.payload.data()['author'],
        authorName: data.payload.data()['authorName'],
        date: data.payload.data()['date'],
      }
      console.log(this.top);
    });
    await this.fser.getAuthorItems(this.id).then((data) => {
      this.items = data.docs.map(doc => {
        return {
          $key: doc.id,
          title: doc.data()['title'],
          description: doc.data()['description'],
          place: doc.data()['place'],
          image: doc.data()['image'],
        };
      });
      this.items.sort((a, b) => b.place - a.place);
    });
    console.log(this.items);
  }

  async save() {
    this.fser.saveItems(this.top.author, this.top.$key, this.items).then(async (data) => {
      console.log(data);
      this.toastController.create({
        message: 'Top saved',
        duration: 2000
      }).then((e) => {
        e.present();
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  goBack() {
    this.nav.back();
  }

  openPopover() {
    this.isPopoverOpen = true;
  }

  closePopover() {
    this.isPopoverOpen = false;
  }

  chooseItem(item) {
    this.slides.slideTo(Math.abs(this.items.length - item));
    this.isPopoverOpen = false;
  }

  nextSlide() {
    this.slides.slideNext();
  }

  previousSlide() {
    this.slides.slidePrev();
  }
}
