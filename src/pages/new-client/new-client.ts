import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, AlertController } from 'ionic-angular';
import { BMappApi } from '../../shared/BMappApi';
/*
  Generated class for the NewClient page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-new-client',
  templateUrl: 'new-client.html'
})
export class NewClientPage {

  client: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    public bmappApi: BMappApi) {

    if (!navParams.get('client')) {
      console.log("Setting up a new client");
      this.client = {
        id: new Date().getUTCMilliseconds(),
        name: '',
        email: '',
        contact_email: '',
        contact: '',
        address: ''
      };
    } else {
      this.client = navParams.get('client');
    }
  }
  ionViewDidLoad() {
    console.log('Hello NewClientPage Page');
  }

  /**
   * Attempts to save the provided information in a new consultant record
   */
  saveConsultant() {
    console.log(this.client);

    if (!this.client.name) {
      this.presentToast('You must provide a name for this record');
      return;
    }

    
      this.bmappApi.saveClient(this.client);
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

}
