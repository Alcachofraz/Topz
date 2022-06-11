import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditTopPage } from './edit-top.page';

const routes: Routes = [
  {
    path: '',
    component: EditTopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditTopPageRoutingModule {}
