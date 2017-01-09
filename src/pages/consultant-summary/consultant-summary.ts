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
  selector: 'page-consultant-summary',
  templateUrl: 'consultant-summary.html'
})
export class ConsultantSummaryPage {

  /**
   * The consultant object
   */
  consultant: any;
  /**
   * The list of clients available to pick
   */
  clients: any[];
  /**
   * The current active user
   */
  user: any;
  /**
   * Whether the layout should or shouldn't allow changes
   */
  isReadOnly = true;
  /**
   * The id of the selected client
   */
  pickedClient;

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
        selling_price: 0,
        profit: 0,
        country: "Belgium",
        hr: "Natalia de Wilde D'Estmael",
        car: false,
        missions: []
      };
    } else {
      this.consultant = navParams.get('consultant');
      this.pickedClient = this.consultant.clientID;

      //TODO: remove when backend is updated
      this.consultant.missions = [
        {
          "id": 3,
          "startDate": "2016-08-31",
          "endDate": "2017-01-17",
          "role": "Senior Java Developer",
          "sellingPrice": 870,
          "country": "Belgium",
          "clientId": "4",
          "clientName": "Proximus",
          "consultantId": 7,
          "consultantName": "Ricardo Amorim"
        },
        {
          "id": 3,
          "startDate": "2016-08-31",
          "endDate": "2017-01-17",
          "role": "Senior Java Developer",
          "sellingPrice": 490,
          "country": "Luxembourg",
          "clientId": "4",
          "clientName": "Proximus",
          "consultantId": 7,
          "consultantName": "Ricardo Amorim"
        }
      ]
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

    if (!this.pickedClient || this.pickedClient == -1) {
      this.consultant.clientID = '-1';
      this.consultant.client = 'No client';
    } else {
      var client = _.find(this.clients, { id: this.pickedClient });
      this.consultant.clientID = client.id;
      this.consultant.client = client.name;
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
   * Show confirmation dialog and proceeds to delete the record if the user confirms
   */
  showDeletePrompt() {
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

  /**
   * Updates the margin and profit whenever the input is changed
   */
  onCostsChanged($event) {
    var margin = this.consultant.selling_price - this.consultant.package;
    this.consultant.profit = margin + " (" + Math.round((margin / this.consultant.selling_price) * 100) + "%)";
  }
}
