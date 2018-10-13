import { Component, NgZone } from '@angular/core';
import {
  App,
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController,
  AlertController,
  ModalController,
} from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import { EditmodalPage } from '../editmodal/editmodal';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  url = 'https://owo-be.herokuapp.com';
  transactions = [];
  incomeTransactions = [];
  expenseTransactions = [];
  constructor(
    public app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private http: HTTP,
    private zone: NgZone,
  ) {}

  transactionTab = 'all';

  ionViewDidEnter() {
    this.getTransactions();
  }

  async getTransactions() {
    const token = await this.storage.get('token');
    if (!token) {
      this.navCtrl.popToRoot();
    }
    const headers = { Authorization: `Bearer ${token}` };
    let loading = this.loadingCtrl.create({ content: 'Please wait...' });
    loading.present();
    try {
      const response = await this.http.get(`${this.url}/api/transactions`, {}, headers);
      const responseData = await JSON.parse(response.data);
      this.zone.run(() => {
        this.transactions = [...responseData.transactions];
        this.incomeTransactions = this.transactions.filter((transaction) => {
          return transaction.type == 'income';
        });
        this.expenseTransactions = this.transactions.filter((transaction) => {
          return transaction.type == 'expense';
        });
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

  editTransaction(data) {
    const modal = this.modalCtrl.create(EditmodalPage, data);
    modal.present();
    modal.onDidDismiss(() => {
      this.getTransactions();
    });
  }

  async deleteTransaction(id) {
    const self = this;
    const confirm = this.alertCtrl.create({
      title: 'Delete Transaction record?',
      message: 'You cannot undo this action?',
      buttons: [
        {
          text: 'Cancel',
          handler: function() {
            self.toast('Operation aborted');
          },
        },
        {
          text: 'Continue',
          handler: async function() {
            const token = await self.storage.get('token');
            const headers = { Authorization: `Bearer ${token}` };
            let loading = self.loadingCtrl.create({ content: 'Please wait...' });
            loading.present();
            try {
              const response = await self.http.delete(
                `${self.url}/api/transaction/${id}`,
                {},
                headers,
              );
              const responseData = await JSON.parse(response.data);
              self.toast(responseData.message);
              self.getTransactions();
            } catch (error) {
              if (error.status === 401) {
                self.logout();
              } else {
                self.toast('Error deleting transaction');
              }
            }
            loading.dismiss();
          },
        },
      ],
    });
    confirm.present();
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
