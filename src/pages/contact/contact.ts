import { Component, NgZone } from '@angular/core';
import { App, IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  user = {
    fullname: '',
    email: '',
    balance: 0.0,
    created_at: '',
  };
  url = 'https://owo-be.herokuapp.com';
  constructor(
    private navCtrl: NavController,
    public app: App,
    private http: HTTP,
    private storage: Storage,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private zone: NgZone,
  ) {}

  ionViewDidEnter() {
    this.getUserDetails();
  }

  async getUserDetails() {
    const token = await this.storage.get('token');
    if (!token) {
      this.navCtrl.popToRoot();
    }
    const headers = { Authorization: `Bearer ${token}` };
    let loading = this.loadingCtrl.create({ content: 'Please wait...' });
    loading.present();
    try {
      const response = await this.http.get(`${this.url}/api/user`, {}, headers);
      const responseData = await JSON.parse(response.data);
      this.zone.run(() => {
        this.user = { ...responseData.user };
        this.user = { ...this.user, created_at: new Date(this.user.created_at).toDateString() };
      });
    } catch (error) {
      if (error.status === 401) {
        this.logout();
      } else {
        this.toast('Error fetching data');
      }
    }
    loading.dismiss();
  }

  toast(message) {
    const toast = this.toastCtrl.create({
      message,
      duration: 3000,
    });
    toast.present();
  }

  logout() {
    this.storage.remove('token');
    this.app.getRootNav().setRoot(LoginPage);
    this.navCtrl.popToRoot();
  }
}
