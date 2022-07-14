import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, IonSlides, ModalController, NavController } from '@ionic/angular';
import { FireauthService } from '../fireauthservice.service';
import { FireserviceService } from '../fireservice.service';
import { Top } from '../top';
import { TopItem } from '../top-item';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-top',
  templateUrl: './top.page.html',
  styleUrls: ['./top.page.scss'],
})
export class TopPage implements OnInit {
  @ViewChild('slides', { read: IonSlides }) public slides: IonSlides;
  id = null;
  top: Top = null;
  items: Array<TopItem> = null;

  constructor(
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public fser: FireserviceService,
    public auth: FireauthService,
    public router: Router,
    public sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    public nav: NavController,
  ) { }

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('sid');
    (await this.fser.getTop(this.id)).subscribe(data => {
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
    (await this.fser.streamItems(this.id)).subscribe(data => {
      this.items = data.map(e => {
        return {
          $key: e.payload.doc.id,
          title: e.payload.doc.data()['title'],
          description: e.payload.doc.data()['description'],
          place: e.payload.doc.data()['place'],
          image: e.payload.doc.data()['image'],
        };
      });
      this.items.sort((a, b) => b.place - a.place);
      console.log(this.items);
    });
  }

  goBack() {
    this.nav.back();
  }

  chooseItem() {

  }

  nextSlide() {
    this.slides.slideNext();
  }

  previousSlide() {
    this.slides.slidePrev();
  }
}
