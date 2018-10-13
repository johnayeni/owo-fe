import { HTTP } from '@ionic-native/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController, LoadingController } from 'ionic-angular';
import { TabsPage } from '../../pages/tabs/tabs';
import { LoginPage } from '../../pages/login/login';
/*
  Generated class for the ProvidersAuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProvidersAuthProvider {
  constructor(
    private http: HTTP,
    private storage: Storage,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
  ) {}
}
