import { Component, forwardRef, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor(private navCtrl: NavController, private storage: Storage) {}

  async ionViewDidEnter() {
    const token = await this.storage.get('token');
    if (!token) {
      this.navCtrl.popToRoot();
    }
  }
}
