import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  constructor(public navCtrl: NavController, public app: App) {}

  logout() {
    this.app.getRootNav().setRoot(LoginPage);
  }
}
