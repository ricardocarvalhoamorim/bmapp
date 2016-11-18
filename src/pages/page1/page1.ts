import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { NewConsultantPage } from '../new-consultant/new-consultant';
import { ConsultantsPage } from '../consultants/consultants';
import { ClientsPage } from '../clients/clients';
import { NewClientPage } from '../new-client/new-client';
import { SettingsPage } from '../settings/settings';
import { BMappApi } from '../../shared/BMappApi';
import { Chart } from 'ng2-chartjs2';

import * as _ from 'lodash';


@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {

  consultants;
  undefinedCount = 0;

  /**
   * Assigned
   */
  assignedCount = 0;
  clients;
  today = new Date().toDateString();


  constructor(
    public navCtrl: NavController,
    public events: Events,
    public bmappAPI: BMappApi) {

    events.subscribe('clients:updated', (clients) => {
      this.ionViewDidLoad();
    });

    events.subscribe('consultants:updated', (clients) => {
      this.ionViewDidLoad();
    });

  }

  labels: string[] = ["Me", "Target"];
  data: Chart.Dataset[] = [
    {
      label: 'Running missions',
      data: [this.assignedCount, 5],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 1
    }
  ];

  ionViewDidLoad() {
    //load clients and consultants
    this.bmappAPI.getConsultants().then((val) => {
      this.consultants = val;

      this.undefinedCount = _.filter(
        this.consultants,
        _.matchesProperty('client', 'Not defined')).length

      this.assignedCount = this.consultants.length - this.undefinedCount;
    });

    this.bmappAPI.getClients().then((val) => {
      this.clients = val;
    });
  }

  ionViewWillEnter() {
    this.ionViewDidLoad();
  }

  pushNewConsultant() {
    this.navCtrl.push(NewConsultantPage);
  }


  pushNewClient() {
    this.navCtrl.push(NewClientPage);
  }

  switchToSettings() {
    this.navCtrl.setRoot(SettingsPage);
  }

  switchToConsultantsList() {
    this.navCtrl.setRoot(ConsultantsPage);
  }

  switchToClientsList() {
    this.navCtrl.setRoot(ClientsPage);
  }
}
