import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(public nav: NavController) { }

  ngOnInit(): void {

  }


  OpenNavVideoPlay(id: number) {
    this.nav.navigateForward("/videoplay/" + id);
    console.log("teste" + id);
  }
}
