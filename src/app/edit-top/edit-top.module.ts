import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTopPageRoutingModule } from './edit-top-routing.module';

import { EditTopPage } from './edit-top.page';
import { FileSizePipe } from '../file-size.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditTopPageRoutingModule
  ],
  declarations: [EditTopPage, FileSizePipe]
})
export class EditTopPageModule { }
