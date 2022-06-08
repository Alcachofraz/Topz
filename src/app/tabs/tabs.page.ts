import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
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
    public auth: FireauthService, public alertController: AlertController, public toastController: ToastController,) { }

  async addTop() {
    //let ntop: string = prompt("New Top", "Jogos de Tabuleiro");

    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Create new Top',
      message: 'To create a Top, you must specify the number of items and the title.',
      inputs: [
        {
          label: 'Top',
          name: 'top',
          type: 'number',
          placeholder: '10',
        },
        {
          label: 'Title',
          name: 'title',
          type: 'text',
          placeholder: 'Jogos de Tabuleiro',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'cancel',
          handler: (data) => {
            console.log('Cancel');
          }
        }, {
          text: 'Create',
          role: null,
          handler: async (data) => {
            let title: string = data.title;
            let top: number = data.top;
            console.log("title: " + title);
            console.log("top: " + top);
            if (title.length < 2) {
              (await this.toastController.create({
                message: 'Title is too short',
                duration: 2000
              })).present();
            }
            else if (title.length > 99) {
              (await this.toastController.create({
                message: 'Title is too long',
                duration: 2000
              })).present();
            }
            else if (top < 1) {
              (await this.toastController.create({
                message: 'Top must have at least 1 item',
                duration: 2000
              })).present();
            }
            else if (top > 100) {
              (await this.toastController.create({
                message: 'Top must have less than 100 items',
                duration: 2000
              })).present();
            }
            else {
              let t: Top = { $key: '', title: title, top: top, author: '', date: '' };
              console.log(t);
              this.fser.createTop(t).then(resp => {
                console.log("createTop: then - " + resp);
              })
                .catch(error => {
                  console.log("createTop: catch - " + error);
                });
              console.log("addTop: " + "Top " + top + " " + title);
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
