import { Component } from '@angular/core';
import { AlertController, PopoverController, ToastController } from '@ionic/angular';
import { CreateTopPopoverComponent } from '../create-top-popover/create-top-popover.component';
import { FireauthService } from '../fireauthservice.service';
import { FireserviceService } from '../fireservice.service';
import { Top } from '../top';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public fser: FireserviceService,
    public auth: FireauthService, public alertController: AlertController, public toastController: ToastController, public popoverController: PopoverController,) { }

  async presentPopover() {
    const popover = await this.popoverController.create({
      component: CreateTopPopoverComponent,
      cssClass: '.popover-no-margin',
    });
    await popover.present();
  }
}
