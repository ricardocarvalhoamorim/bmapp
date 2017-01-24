import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
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
    public bmappService: BmappService) {
  }

  ionViewDidLoad() {
    this.bmappService.getActiveUser().then((val) => {
      this.user = val;
    });

    this.loadBusinessManagers();
  }

  /**
   * Dispatches the request to load the business managers in the background
   */
  loadBusinessManagers() {
    this.bmappService.getBusinessManagers().subscribe(
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
   * Shows a toast with the specified message
   */
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });

    toast.present();
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
        this.bmappService.setActiveUser(this.user);
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