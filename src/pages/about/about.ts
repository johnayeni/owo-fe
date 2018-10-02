import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  constructor(public navCtrl: NavController, public platform: Platform) {
    this.transactions = 'all';
  }

  transactions = 'all';

  counter(i: number) {
    return new Array(i);
  }
}
