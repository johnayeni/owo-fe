import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController,
  AlertController,
} from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private http: HTTP,
  ) {}

  formData = {};

  url = 'https://owo-be.herokuapp.com';

  async ionViewDidEnter() {
    const token = await this.storage.get('token');
    if (token) {
      this.navCtrl.push(TabsPage);
    }
  }

  async login() {
    let loading = this.loadingCtrl.create({ content: 'Please wait...' });
    loading.present();
    try {
      const response = await this.http.post(`${this.url}/auth/login`, this.formData, {});
      const responseData = await JSON.parse(response.data);
      this.toast(responseData.message);
      await this.storage.set('token', String(responseData.token));
      this.navCtrl.push(TabsPage);
    } catch (error) {
      if (error.status === 400) {
        const errorData = await JSON.parse(error.error);
        this.toast(errorData.messages[0].message || 'Error occured logging in');
      } else {
        this.toast('Error occured logging in');
      }
    }
    loading.dismiss();
  }

  goToRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }

  toast(message) {
    const toast = this.toastCtrl.create({
      message,
      duration: 3000,
    });
    toast.present();
  }
}
