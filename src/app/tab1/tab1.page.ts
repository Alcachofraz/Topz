import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FireService } from '../fireservice.service';
import { Top } from '../top';
import { UserProfile } from '../user-profile';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  user: UserProfile = null;
  timeline: Array<Top> = [];

  constructor(public fser: FireService, public nav: NavController, private activatedRoute: ActivatedRoute) { }

  async ngOnInit() {
    (await this.fser.streamUser()).subscribe(async data => {
      this.user = {
        uid: data.payload.id,
        username: data.payload.data()['username'],
        email: data.payload.data()['email'],
        photoUrl: data.payload.data()['photoUrl'],
      };
      (await this.fser.getTimeline(this.user.uid)).subscribe(data => {
        let temp = [];
        temp = data.map(e => {
          return {
            $key: e.payload.doc.id,
            title: e.payload.doc.data()['title'],
            top: e.payload.doc.data()['top'],
            items: e.payload.doc.data()['items'],
            author: e.payload.doc.data()['author'],
            authorName: e.payload.doc.data()['authorName'],
            date: e.payload.doc.data()['date'],
          };
        });
        //this.timeline = temp.filter((top) => top.author !== this.user.uid);
        this.timeline = temp;
        console.log(this.timeline);
      });
    });
    console.log(this.user);
  }

  openTop(author: string, id: string) {
    this.nav.navigateForward("/top/" + author + "/" + id);
    console.log("open " + id);
  }

  openProfile(uid: string, event) {
    this.nav.navigateForward("/user-profile/" + uid);
    console.log("open profile");
    event.stopPropagation();
    event.preventDefault();
  }
}
