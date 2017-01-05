import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController,NavParams, AlertController, Events } from 'ionic-angular';
import { BMappApi } from '../../shared/BMappApi';
import { BmappService } from '../../providers/bmapp-service'
/*
  Generated class for the NewClient page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-new-client',
  templateUrl: 'new-client.html',
  providers: [BmappService]
})
export class NewClientPage {

  client: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    public bmappService: BmappService,
    public loadingCtrl: LoadingController,
    public bmappApi: BMappApi) {

    if (!navParams.get('client')) {
      console.log("Setting up a new client");
      this.client = {
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
  }

  /**
   * Attempts to save the provided information in a new client record
   */
  saveClient() {
    console.log(this.client);

    if (!this.client.name) {
      this.presentToast('You must provide a name for this record');
      return;
    }

    let loader = this.loadingCtrl.create({
      content: "Saving data..."
    });

    loader.present();
    this.bmappService.saveClient(this.client).subscribe(
      data => {
        this.events.publish('clients:new', this.client);
        this.bmappApi.saveClient(this.client);
        this.presentToast('Saved successfully');
        loader.dismiss();
        this.navCtrl.pop();
      },
      err => {
        this.presentToast("Unable to save this record");
        loader.dismiss();
        console.log(err);
      }
    )


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
