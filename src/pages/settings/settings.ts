import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { BMappApi } from '../../shared/BMappApi';
import { BmappService } from '../../providers/bmapp-service'
import * as _ from 'lodash';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
  providers: [BmappService]
})
export class SettingsPage {

  public storage: Storage;

  /**
   * Business managers list
   */
  bms: any[];
  error;

  user = {
    id: new Date().getUTCMilliseconds(),
    name: '',
    initials: '',
    email: '',
    contact: '',
    target: 0,
    isUnitManager: false,
    active: true
  };

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public bmappService: BmappService,
    public bmappAPI: BMappApi) {
  }

  ionViewDidLoad() {
    this.bmappAPI.getActiveUser().then((val) => {
      this.user = val;
    });

    this.loadBusinessManagers();
    /*
    this.bmappAPI.getBms().then((val) => {
      this.bms = val;
      this.user = _.find(this.bms, { active: true });
    });
    */
  }

  /**
   * Dispatches the request to load the business managers in the background
   */
  loadBusinessManagers() {
    this.bmappService.loadBusinessManagers().subscribe(
      data => {
        this.bms = data._embedded.businessManagers;
        this.error = null;
      },
      err => {
        console.log(err);
        this.error = err;
      }
    );
  }

  /**
   * Calls the api to save the changes
   */
  saveSettings() {
    if (this.user.name === '') {
      this.presentToast('You have to provide a name')
      return;
    }
    this.bmappAPI.saveBM(this.user);
    this.presentToast('Settings successfully saved');
  }

  /**
   * Shows a toast with the specified message
   */
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });

    toast.present();
  }

  reset() {
    this.newUser();
    this.bmappAPI.reset();
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
        this.saveSettings();
      }
    });
    alert.present();
  }

  /**
   * Clears the fields to create a new user
   */
  newUser() {
    this.user = {
      id: new Date().getUTCMilliseconds(),
      name: '',
      initials: '',
      email: '',
      contact: '',
      target: 0,
      isUnitManager: false,
      active: true
    };
  }

  /**
   * Report an issue with the application
   */
  report() {
    window.open(`mailto:rcamorim@adneom.com?subject=BMApp feedback&body=Hi Ricardo, Here\'s my feedback on the app`, '_system');
  }
}