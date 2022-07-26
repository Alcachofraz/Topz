import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, IonSlides, ModalController, NavController } from '@ionic/angular';
import { FireAuthService } from '../fireauthservice.service';
import { FireService } from '../fireservice.service';
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
  author = null;
  top: Top = null;
  items: Array<TopItem> = null;
  isPopoverOpen: boolean = false;

  constructor(
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public fser: FireService,
    public auth: FireAuthService,
    public router: Router,
    public sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    public nav: NavController,
  ) { }

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('sid');
    this.author = this.activatedRoute.snapshot.paramMap.get('uid');
    console.log('1-' + this.id);
    console.log('2-' + this.author);
    (await this.fser.getTop(this.author, this.id)).subscribe(data => {
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
    (await this.fser.streamItems(this.author, this.id)).subscribe(data => {
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
