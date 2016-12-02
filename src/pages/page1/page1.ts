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

  public competitionLabels: string[] = [];
  public competitionsData: any[] = [];

  @ViewChild(ChartComponent) competitionComp;
  public competitionOptions = {
    type: 'bar',
    responsive: false,
    data: {
      labels: this.competitionLabels,
      datasets: [
        {
          data: this.competitionsData,
          backgroundColor: [
            'rgba(215, 40, 40, 0.9)',
            'rgba(222, 222, 222, 0.9)'
          ]
        }
      ]
    }
  };

  @ViewChild(ChartComponent) consultantsDistributionComp;
  public consultantsDistributionOptions = {
    type: 'doughnut',
    responsive: false,
    data: {
      labels: ['Mission', 'Bench'],
      backgroundColor: 'rgba(148,159,177,0.2)',
      datasets: [
        {
          data: [0, 1],
          backgroundColor: [
            'rgba(215, 40, 40, 0.9)',
            'rgba(222, 222, 222, 0.9)'
          ]
        }
      ]
    }
  };

  consultants: any[];
  clients: any[];
  bms: any[];

  /**
   * The active user
   */
  user: any;

  /**
   * Number of consultants waiting for a mission
   */
  standbyCount = 0;

  /**
   * Number of consultants currently on a mission
   */
  assignedCount = 0;

  /**
   * Today's formatted date
   */
  today = new Date().toDateString();

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public bmappAPI: BMappApi) {

    events.subscribe('consultants:new', (data) => {
      this.consultants.push(data);
      console.log("NEW: " + data);
      this.updateChart();
    });
  }

  ionViewDidLoad() {

    this.bmappAPI.getBms().then((val) => {
      this.user = _.find(val, { active: true });
      this.bms = val;
      if (!this.user) {

        console.log("Could not find an acive user, will create one");
        this.user = {
          id: new Date().getUTCMilliseconds(),
          name: 'No name provided',
          email: '',
          contact: '',
          target: 6,
          notifications: true,
          auto_inactive: true,
          active: true
        };

        this.bmappAPI.saveBM(this.user);
        this.ionViewDidLoad();
      }
    });

    this.bmappAPI.getConsultants().then((val) => {
      this.consultants = val;
      if (this.consultants.length === 0) {
        console.log("There are no consultants");
        return;
      }

      this.standbyCount = _.filter(
        this.consultants,
        _.matchesProperty('client', '')).length;

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

    if (this.user === undefined)
      return;

    if (this.assignedCount === undefined)
      return;

    //update bar chart
    if (this.bms.length == 0) {
      console.log("No BMs, skipping update");
      return;
    }

    this.competitionOptions.data.labels = _.map(this.bms, 'initials');
    this.competitionOptions.data.datasets[0].data = [];

    for (let bm of this.bms) {
      var consultantsCount = _.filter(this.consultants, function (consultant) {
        if (consultant.bm === bm.id
          && consultant.client !== ''
          //&& new Date(consultant.ending_date) < new Date()
        )
          return consultant;
      }).length;

      if (this.user.id === bm.id)
        this.assignedCount = consultantsCount;

      this.competitionOptions.data.datasets[0].data.push(consultantsCount);
    }
    this.competitionComp.chart.update();

    //update pie chart
    this.consultantsDistributionOptions.data.datasets[0].data = [this.assignedCount, this.standbyCount];

  }

  pushNewConsultant() {
    this.navCtrl.push(NewConsultantPage, { 'user': this.user });
  }


  pushNewClient() {
    this.navCtrl.push(NewClientPage, { 'user': this.user });
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
