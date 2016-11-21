import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, AlertController } from 'ionic-angular';

import { BMappApi } from '../../shared/BMappApi';

/*
  Generated class for the NewConsultant page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-new-consultant',
  templateUrl: 'new-consultant.html'
})
export class NewConsultantPage {

  consultant: any;
  clients: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    public bmappApi: BMappApi) {

    if (!navParams.get('consultant')) {
      console.log("Setting up a new consultant");
      this.consultant = {
        id: new Date().getUTCMilliseconds(),
        name: '',
        email: '',
        telephone: '',
        starting_date: '',
        skills: '',
        languages: '',
        client: 'Not defined',
        car: false
      };
    } else {
      this.consultant = navParams.get('consultant');
      console.log("EDITING USER " + this.consultant.id);
    }
  }

  ionViewDidLoad() {
    this.bmappApi.getClients().then((val) => {
      this.clients = val;
    });
  }

  /**
   * Attempts to save the provided information in a new consultant record
   */
  saveConsultant() {
    console.log(this.consultant);

    if (!this.consultant.name) {
      this.presentToast('You must provide a name for this record');
      return;
    }

    this.bmappApi.saveConsultant(this.consultant);
    this.presentToast('Saved successfully');
    this.navCtrl.pop();
  }

  /**
   * Displays a toast with the specified message
   */
  presentToast(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  /**
   * Displays an interface to pick a mission and associates it with the 
   * current record
   */
  pickMission() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Lightsaber color');

    for (let client of this.clients) {
      alert.addInput({
        type: 'radio',
        label: client.name,
        value: client.name,
        checked: false
      });
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.consultant.client = data;
      }
    });
    alert.present();
  }

}
