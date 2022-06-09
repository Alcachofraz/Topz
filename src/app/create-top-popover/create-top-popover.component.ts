import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PopoverController, ToastController } from '@ionic/angular';
import { FireserviceService } from '../fireservice.service';
import { Top } from '../top';
import { TopItem } from '../top-item';

@Component({
  selector: 'app-create-top-popover',
  templateUrl: './create-top-popover.component.html',
  styleUrls: ['./create-top-popover.component.scss'],
})
export class CreateTopPopoverComponent implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';
  validation_messages = {
    'top': [
      { type: 'required', message: 'Top is required.' },
      { type: 'max', message: 'Top should be less than 101.' }
    ],
    'title': [
      { type: 'required', message: 'Title is required.' },
      {
        type: 'minlength', message: 'Title must be at least 2 characters long.'
      },
      {
        type: 'maxlength', message: 'Title must be less than 500 characters long.'
      }
    ]
  };

  constructor(private formBuilder: FormBuilder, public toastController: ToastController, public fser: FireserviceService, public popoverController: PopoverController) { }

  async addTop(value) {
    console.log("title: " + value.title);
    console.log("top: " + top);
    if (value.title.length < 2) {
      (await this.toastController.create({
        message: 'Title is too short',
        duration: 2000
      })).present();
    }
    else if (value.title.length > 99) {
      (await this.toastController.create({
        message: 'Title is too long',
        duration: 2000
      })).present();
    }
    else if (value.top < 1) {
      (await this.toastController.create({
        message: 'Top must have at least 1 item',
        duration: 2000
      })).present();
    }
    else if (value.top > 100) {
      (await this.toastController.create({
        message: 'Top must have less than 100 items',
        duration: 2000
      })).present();
    }
    else {
      let t: Top = { $key: '', title: value.title, top: value.top, author: '', date: '' };
      console.log(t);
      await this.fser.createTop(t).then(resp => {
        t.$key = resp.id;
        console.log("createTop: then - " + resp);
      })
        .catch(error => {
          console.log("createTop: catch - " + error);
          return;
        });
      let items = new Array<TopItem>(t.top);
      for (let i = 0; i < t.top; i++) {
        items[i] = { $key: '', place: i + 1, title: 'Some boardgame', description: 'Because...', image: 'https://picsum.photos/800' };
      }
      await this.fser.createItems(t.$key, items).then(resp => {
        console.log("createItems: then - " + resp);
        this.dismiss();
      })
        .catch(error => {
          console.log("createItems: catch - " + error);
        });
      console.log("addTop: " + "Top " + top + " " + value.title);
    }
  }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      top: new FormControl('', Validators.compose([
        Validators.max(100),
        Validators.required
      ])),
      title: new FormControl('', Validators.compose([
        Validators.minLength(2),
        Validators.maxLength(500),
        Validators.required
      ])),
    });
  }

  dismiss() {
    this.popoverController.dismiss();
  }
}
