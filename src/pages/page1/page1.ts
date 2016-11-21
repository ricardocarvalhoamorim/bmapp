import { Component, ViewChild } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { NewConsultantPage } from '../new-consultant/new-consultant';
import { ConsultantsPage } from '../consultants/consultants';
import { ClientsPage } from '../clients/clients';
import { NewClientPage } from '../new-client/new-client';
import { SettingsPage } from '../settings/settings';
import { BMappApi } from '../../shared/BMappApi';
import { ChartComponent } from 'ng2-chartjs2';

import * as _ from 'lodash';


@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {

  consultants;
  undefinedCount = 0;
  @ViewChild(ChartComponent) chartComp;
  options = {
    type: 'bar',
    responsive: false,
    data: {
      labels: ['Me', 'Goal'],
      datasets: [
        {
          label: 'Running missions',
          data: [1, 2],
          backgroundColor: [
          'rgba(215, 40, 40, 0.9)',
          'rgba(222, 222, 222, 0.9)'
        ]
        }
      ]
    }
  };

  /**
   * Assigned
   */
  assignedCount = 0;
  user: any;
  clients: any[];
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

  ionViewDidLoad() {
    //load clients and consultants
    this.bmappAPI.getConsultants().then((val) => {
      this.consultants = val;

      this.undefinedCount = _.filter(
        this.consultants,
        _.matchesProperty('client', 'Not defined')).length

      this.assignedCount = this.consultants.length - this.undefinedCount;
      this.updateChart();
    });

    this.bmappAPI.getClients().then((val) => {
      this.clients = val;
    });

    this.bmappAPI.getUser().then((val) => {
      this.user = val;
      this.updateChart();
    });

  }

  /**
   * Uses the available values to update the chart
   */
  updateChart() {
    if (this.user === undefined)
      return;

    if (this.assignedCount === undefined)
      return;
      
    console.log("UPDATE: " + this.assignedCount + " " + this.user.target);
    let chart = this.chartComp.chart;
    chart.data.datasets[0].data = [this.assignedCount, this.user.target];
    chart.update();
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
