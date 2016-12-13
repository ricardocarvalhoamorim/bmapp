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

  /**
   * The list of the group's consultants
   */
  consultants: any[];

  /**
   * The list of consultants assigned for the active user
   */
  userConsultants: any[];

  /**
   * The client portfolio
   */
  clients: any[];

  /**
   * The registered business managers
   */
  bms: any[];

  /**
    * The active user
    */
  user: any;

  /**
   * Number of consultants currently on a mission
   */
  consultantsOnMission = 0;

  /**
   * Number of consultants waiting for a mission
   */
  consultantsOnBench = 0;

  /**
   * Today's formatted date
   */
  today = new Date().toDateString();

  /**
   * Number of consultants with an active mission
   */
  runningMissions = 0;

  /**
   * The user's progress towards his objectives
   */
  progress = 0;

  /**
   * Overall Mission count
   */
  bUnitMissionCount = 0;

  /**
   * Chart with a comparison between business managers
   */
  @ViewChild(ChartComponent) competitionComp;
  public competitionOptions = {
    type: 'bar',
    responsive: false,
    data: {
      labels: [],
      datasets: [
        {
          label: 'Running missions',
          data: [],
          backgroundColor:
          'rgba(215, 40, 40, 0.9)'
        },
        {
          label: 'Objectives',
          data: [],
          backgroundColor:
          'rgba(29, 40, 40, 0.3)'
        }
      ]
    }
  };

  /**
   * Chart with the distribution of consultants according to their occupation
   * (mission or bench)
   */
  @ViewChild(ChartComponent) consultantsDistributionComp;
  public consultantsDistributionOptions = {
    type: 'doughnut',
    responsive: false,
    data: {
      labels: ['Mission', 'Bench'],
      datasets: [
        {
          data: [],
          backgroundColor: [
            'rgba(215, 40, 40, 0.9)'
          ]
        }
      ]
    }
  };


  /**
     * Chart with a distribution of consultants across the clients portfolio
     */
  @ViewChild(ChartComponent) clientsComp;
  public clientsOptions = {
    type: 'doughnut',
    data: {
      labels: [],
      datasets: [
        {
          label: '',
          data: [],
          backgroundColor: [
            '#E57373',
            '#E53935',
            '#D50000',
            '#C62828',
            '#B71C1C'
          ]
        }
      ]
    }
  };

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public bmappAPI: BMappApi) {

    events.subscribe('consultants:new', (data) => {
      this.consultants.push(data);
      this.ionViewDidEnter();
    });

    events.subscribe('clients:new', (data) => {
      this.clients.push(data);
      this.ionViewDidEnter();
    });
  }

  toggleColors() {
    this.clientsOptions.data.datasets[0].backgroundColor = [
      '#607D8B',
      '#1565C0',
      '#00695C',
      '#FFD600',
      '#4E342E'
    ];
    this.updateChart();
    console.log("CHANGED");
  }

  /**
   * Runs when the page has fully entered and is now the active page.
   * This event will fire, whether it was the first load or a cached page.
   */
  ionViewDidEnter() {
    this.bmappAPI.getBms().then((val) => {
      this.user = _.find(val, { active: true });

      this.bms = val;
      if (!this.user) {
        console.log("Could not find an acive user, will create one");
        this.bmappAPI.reset();
        this.ionViewDidEnter();
      }
    });

    this.bmappAPI.getConsultants().then((val) => {
      this.consultants = val;
      if (this.consultants.length === 0) {
        return;
      }

      //compute the user's stats
      this.userConsultants =
        _.filter(this.consultants, cs => cs.bm === this.user.id);
      this.consultantsOnMission =
        _.filter(this.userConsultants, cs => cs.clientID !== '-1').length;
      this.consultantsOnBench = this.userConsultants.length - this.consultantsOnMission;

      this.progress = Math.round(this.consultantsOnMission / this.user.target * 100);

      this.updateChart();
    });

    this.bmappAPI.getClients().then((val) => {
      this.clients = val;
    });
  }

  /**
   * Uses the available values to update the charts
   */
  updateChart() {

    if (this.user === undefined)
      return;

    //update bar chart
    if (this.bms.length == 0) {
      console.log("No BMs, skipping update");
      return;
    }

    this.bUnitMissionCount = 0;

    for (let bm of this.bms) {
      var consultantsCount = _.filter(this.consultants, function (consultant) {
        if (consultant.bm === bm.id
          && consultant.clientID !== '-1'
          //&& new Date(consultant.ending_date) < new Date()
        )
          return consultant;
      }).length;

      this.bUnitMissionCount += consultantsCount;
      this.competitionOptions.data.datasets[0].data.push(consultantsCount);
      this.competitionOptions.data.datasets[1].data.push(bm.target);
    }

    this.competitionOptions.data.labels = _.map(this.bms, 'initials');
    
    //update pie chart
    this.consultantsDistributionOptions.data.datasets[0].data = [this.consultantsOnMission, this.consultantsOnBench];


    //handle consultants distribution chart
    var groupedClients = _.map(this.userConsultants, function (consultant) {
      return consultant.client;
    });

    this.clientsOptions.data.labels = _.uniq(groupedClients);
    this.clientsOptions.data.datasets[0].data =
      _.chain(this.userConsultants)
        .groupBy("client")
        .map(function (client) { return client.length })
        .value();
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

  takeABreak() {
    window.open(`https://www.youtube.com/watch?v=DJUIgV7t8C0`, '_system');
  }
}
