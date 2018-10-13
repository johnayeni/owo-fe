import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController,
} from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private http: HTTP,
  ) {}

  formData = {
    fullname: '',
    email: '',
    password: '',
  };

  url = 'https://owo-be.herokuapp.com';

  async ionViewDidEnter() {
    const token = await this.storage.get('token');
    if (token) {
      this.navCtrl.push(TabsPage);
    }
  }

  async register() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    loading.present();
    try {
      const response = await this.http.post(`${this.url}/auth/register`, this.formData, {});
      const responseData = await JSON.parse(response.data);
      this.toast(responseData.message);
      this.navCtrl.push(LoginPage);
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        const errorData = await JSON.parse(error.error);
        this.toast(errorData.messages[0].message || 'Error occured in registration');
      } else {
        this.toast('Error occured in registration');
      }
    }
    loading.dismiss();
  }

  goToLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  toast(message) {
    const toast = this.toastCtrl.create({
      message,
      duration: 3000,
    });
    toast.present();
  }
}
