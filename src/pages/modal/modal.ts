import { Component } from '@angular/core';
import {
  App,
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController,
  LoadingController,
} from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  constructor(
    public app: App,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private http: HTTP,
    private storage: Storage,
  ) {}

  formData = { type: '', amount: 0, description: '' };

  url = 'https://owo-be.herokuapp.com';

  async submit() {
    const token = await this.storage.get('token');
    const headers = { Authorization: `Bearer ${token}` };
    let loading = this.loadingCtrl.create({ content: 'Please wait...' });
    loading.present();
    try {
      const response = await this.http.post(`${this.url}/api/transaction`, this.formData, headers);
      const responseData = JSON.parse(response.data);
      this.toast(responseData.message);
      this.dismiss();
    } catch (error) {
      console.log(error);
      if (error.status === 401) {
        this.logout();
      } else if (error.status === 400) {
        const errorData = JSON.parse(error.error);
        this.toast(errorData.messages[0].message || 'Error creating transaction');
      } else {
        this.toast('Error creating transaction');
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

  dismiss() {
    this.viewCtrl.dismiss();
  }

  logout() {
    this.storage.remove('token');
    this.app.getRootNav().setRoot(LoginPage);
    this.navCtrl.popToRoot();
  }
}
