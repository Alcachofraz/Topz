import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, IonSlides, ModalController, NavController, PopoverController } from '@ionic/angular';
import { FireauthService } from '../fireauthservice.service';
import { FireserviceService } from '../fireservice.service';
import { Top } from '../top';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  tops: Array<Top> = [];

  constructor(
    public modalController: ModalController,
    public popoverController: PopoverController,
    public actionSheetController: ActionSheetController,
    public fser: FireserviceService,
    public auth: FireauthService,
    public router: Router,
    public nav: NavController,
  ) { }

  async ngOnInit() {
    (await this.fser.getTops()).subscribe(data => {
      this.tops = data.map(e => {
        return {
          $key: e.payload.doc.id,
          title: e.payload.doc.data()['title'],
          top: e.payload.doc.data()['top'],
          items: e.payload.doc.data()['items'],
          author: e.payload.doc.data()['author'],
          date: e.payload.doc.data()['date'],
        };
      });
      console.log(this.tops);
    });
  }


  deleteTop(id: string) {
    return this.fser.deleteTop(id);
  }

  editTop(id: string) {
    return;
  }

  openTop(id: string) {
    this.nav.navigateForward("/top/" + id);
    console.log("open " + id);
  }

  addTop() {
    let ntop: string = prompt("New Top");
    if (ntop !== "") {
      let t: Top = { $key: '', title: ntop, top: 10, author: '', date: '' };
      console.log(t);
      this.fser.createTop(t).then(resp => {
        console.log("createTop: then - " + resp);
      })
        .catch(error => {
          console.log("createTop: catch - " + error);
        });
      console.log("addTop: " + this.tops);
    }

  }

  logout() {
    this.auth.doLogout()
      .then(res => {
        this.router.navigate(["/login"]);
      }, err => {
        console.log(err);
      })
  }
}
