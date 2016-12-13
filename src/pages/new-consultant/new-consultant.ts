import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, AlertController, Events } from 'ionic-angular';

import * as _ from 'lodash';
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
  user: any;
  isReadOnly = true;
  clients: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastController: ToastController,
    public events: Events,
    public alertCtrl: AlertController,
    public bmappApi: BMappApi) {

    if (!navParams.get('user')) {
      console.log("An active user is required to create a consultant!");
      return;
    }

    this.user = navParams.get('user');

    if (!navParams.get('consultant')) {
      this.consultant = {
        id: new Date().getUTCMilliseconds(),
        bm: this.user.id,
        clientID: '-1',
        client: 'No client',
        initials: '',
        name: '',
        email: '',
        contact: '',
        starting_date: '',
        ending_date: '',
        skills: '',
        languages: '',
        package: 0,
        car: false
      };

    } else {
      this.consultant = navParams.get('consultant');
      console.log(this.consultant);
    }


    if (this.user.id !== this.consultant.bm && !this.user.isUnitManager) {
      this.isReadOnly = true;
      return;
    }

    this.isReadOnly = false;
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

    if (this.isReadOnly) {
      this.navCtrl.pop();
      return;
    }

    if (!this.consultant.name) {
      this.presentToast('You must provide a name for this record');
      return;
    }

    this.consultant.bm = this.user.id;
    this.bmappApi.saveConsultant(this.consultant);
    this.presentToast('Saved successfully');
    this.events.publish("consultants:new", this.consultant);
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
    alert.setTitle('Pick a client');

    for (let client of this.clients) {
      alert.addInput({
        type: 'radio',
        label: client.name,
        value: client.id,
        checked: false
      });
    }

    alert.addInput({
      type: 'radio',
      label: 'No client',
      value: '-1',
      checked: false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        //data -> client id
        if (data === '-1') {
          this.consultant.clientID = '-1';
          this.consultant.client = 'No client';
          console.log(this.consultant);
          return;
        }
        var client = _.find(this.clients, { id: data });
        this.consultant.clientID = client.id;
        this.consultant.client = client.name;
        console.log(this.consultant);
      }
    });
    alert.present();
  }

  /**
   * Triggers the consultant's deletion
   */
  delete() {
    this.showPrompt();
  }

  /**
   * Show confirmation dialog
   */
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Delete record',
      message: "Are you sure you want to delete this record?",
      buttons: [
        {
          text: 'No'
        },
        {
          text: 'Yes',
          handler: data => {
            this.bmappApi.deleteConsultant(this.consultant);
            this.navCtrl.pop();
          }
        }
      ]
    });
    prompt.present();
  }
}
