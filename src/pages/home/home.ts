import { Component, NgZone, ViewChild } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController,
  ModalController,
  App,
} from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import { ModalPage } from '../modal/modal';
import { LoginPage } from '../login/login';
import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('doughnutCanvas')
  doughnutCanvas;
  userDetails = { balance: 0.0, total_income: 0.0, total_expenses: 0.0 };

  url = 'https://owo-be.herokuapp.com';

  doughnutChart: any;

  constructor(
    public app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private http: HTTP,
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
        this.userDetails = { ...responseData.user };
        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
          type: 'pie',
          data: {
            labels: ['Income', 'Expense'],
            datasets: [
              {
                label: 'Ratio of Income to Expense',
                data: [responseData.user.total_income, responseData.user.total_expenses],
                backgroundColor: ['rgb(105, 204, 154)', 'rgb(247, 134, 138)'],
                hoverBackgroundColor: ['#00d86c', '#ff3e45'],
              },
            ],
          },
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

  showModal() {
    const modal = this.modalCtrl.create(ModalPage);
    modal.present();
    modal.onDidDismiss(() => {
      this.getUserDetails();
    });
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
