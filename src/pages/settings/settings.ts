import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { BMappApi } from '../../shared/BMappApi';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  public storage: Storage;

  user = {
    name: '',
    email: '',
    contact: '',
    target: 0,
    notifications: true,
    auto_inactive: true
  };

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public bmappAPI: BMappApi) {
  }

  ionViewDidLoad() {
    this.bmappAPI.getUser().then((val) => {
      if (val !== null) {
        this.user = val;
      }
    });
  }

  saveSettings() {
    this.bmappAPI.saveUser(this.user);
    this.presentToast('Settings successfully save')
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });

    toast.present();
  }

  loadDummyData() {
    this.bmappAPI.loadDummyData();
    this.ionViewDidLoad();
    this.presentToast('Dummy data successfully loaded');
  }

  reset() {
    this.bmappAPI.reset();
    this.ionViewDidLoad();
  }
}
