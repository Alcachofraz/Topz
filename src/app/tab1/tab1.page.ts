import { Component } from '@angular/core';
import { UserProfile } from 'firebase/auth';
import { FireserviceService } from '../fireservice.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  user: UserProfile = null;

  constructor(public fser: FireserviceService,) { }

  async ngOnInit() {
    (await this.fser.getUser()).subscribe(data => {
      this.user = {
        uid: data.payload.id,
        username: data.payload.data()['username'],
        email: data.payload.data()['email'],
      };
    });
    console.log(this.user);
  }

  presentUserProfile() {
    return;
  }
}
