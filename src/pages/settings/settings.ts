import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { BMappApi } from '../../shared/BMappApi';
import * as _ from 'lodash';

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
    id: new Date().getUTCMilliseconds(),
    name: '',
    initials: '',
    email: '',
    contact: '',
    target: 0,
    notifications: true,
    auto_inactive: true,
    active: true
  };

  bms;

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public bmappAPI: BMappApi) {
  }

  ionViewDidLoad() {
    this.bmappAPI.getBms().then((val) => {
      this.bms = val;
      this.user = _.find(this.bms, { active: true });
    });
  }

  saveSettings() {
    this.user.initials = this.user.name.match(/\b(\w)/g).join('');
    console.log(this.user.initials);
    this.bmappAPI.saveBM(this.user);
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

  /**
  * Displays an interface to pick a mission and associates it with the 
  * current record
  */
  pickProfile() {
    if (this.bms === null)
      return;

    let alert = this.alertCtrl.create();
    alert.setTitle('Pick a profile');
    for (let bm of this.bms) {
      alert.addInput({
        type: 'radio',
        label: bm.name,
        value: bm.name,
        checked: false
      });
    }

    //alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if (data === undefined)
          return;

        this.user = _.find(this.bms, { name: data });
      }
    });
    alert.present();
  }

  newUser() {
    this.user = {
      id: new Date().getUTCMilliseconds(),
      name: '',
      initials: '',
      email: '',
      contact: '',
      target: 0,
      notifications: true,
      auto_inactive: true,
      active: true
    };
  }

}
