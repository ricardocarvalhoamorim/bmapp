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

  @ViewChild(ChartComponent) chartComp;
  barOptions = {
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

  @ViewChild(ChartComponent) lineChartComponent;
  lineOptions = {
    type: 'bar',
    responsive: false,
    data: {
      labels: ['ME', 'AN', 'DW', 'GG', 'AL', 'DP', 'LJ', 'PD'],
      datasets: [
        {
          label: 'November',
          data: [9, 2, 5, 1, 20, 10, 1, 9],
          backgroundColor: [
            'rgb(255, 5, 5)',
            'rgb(222, 222, 222)',
            'rgb(222, 222, 222)',
            'rgb(222, 222, 222)',
            'rgb(222, 222, 222)',
            'rgb(222, 222, 222)',
            'rgb(222, 222, 222)',
            'rgb(222, 222, 222)'
          ]
        }
      ]
    }
  };

  /**
   * Assigned
   */
  consultants: any[];
  clients: any[];
  undefinedCount = 0;
  assignedCount = 0;
  today = new Date().toDateString();

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public bmappAPI: BMappApi) {

  }

  ionViewDidLoad() {
    this.bmappAPI.getConsultants().then((val) => {
      this.consultants = val;
      console.log("Consultants: " + val);
      if (this.consultants.length === 0) {
        return;
      }


      this.undefinedCount = _.filter(
        this.consultants,
        _.matchesProperty('client', 'Not defined')).length

      this.assignedCount = this.consultants.length - this.undefinedCount;
      this.updateChart();
    });

    this.bmappAPI.getClients().then((val) => {
      this.clients = val;
    });

  }

  /**
   * Uses the available values to update the chart
   */
  updateChart() {
    /*
    if (this.user === undefined)
      return;

    if (this.assignedCount === undefined)
      return;

    let chart = this.chartComp.chart;
    chart.data.datasets[0].data = [this.assignedCount, this.user.target];
    chart.update();

    var ongoingMissions = _.filter(
      this.consultants,
      function (consultant) {
        return consultant.client !== 'Not defined' && new Date(consultant.ending_date) < new Date();
      });
      */
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
