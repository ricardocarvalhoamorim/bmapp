import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, Events, Platform } from 'ionic-angular';
import { ConsultantsPage } from '../consultants/consultants';
import { ClientsPage } from '../clients/clients';
import { NewClientPage } from '../new-client/new-client';
import { SettingsPage } from '../settings/settings';
import { ChartComponent } from 'ng2-chartjs2';

import { BmappService } from '../../providers/bmapp-service'

import * as _ from 'lodash';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [BmappService]
})
export class HomePage {

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
   * Array of all the unit's missions
   */
  missions: any[];

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
            '#F9A825',
            '#01579B',
            '#1B5E20',
            '#BF360C',
            '#4E342E'
          ]
        }
      ]
    }
  };
*/
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public events: Events,
    public platform: Platform,
    public bmappService: BmappService) {

    this.platform.ready().then(() => {
      this.bmappService.getBusinessManagers().subscribe(
        data => {
          this.bms = data._embedded.businessManagers;

          this.bmappService.getActiveUser().then(data => {
            if (data) {
              this.user = data;
            } else {

              //this.user = _.find(this.bms, { unitManager: true });
              this.user = this.bms[0];
              this.bmappService.setActiveUser(this.user);
            }
            this.loadAssets();
          });
        },
        err => {
          this.displayMessage('Unable to load the business managers');
        }
      )
    });

    events.subscribe('consultants:new', (data) => {
      this.consultants.push(data);
      this.ionViewDidEnter();
    });

    events.subscribe('clients:new', (data) => {
      this.clients.push(data);
      this.ionViewDidEnter();
    });
  }

  /**
   * Triggers the API call to load both consultants and clients
   */
  loadAssets() {

    //LOAD CONSULTANTS
    this.bmappService.getConsultants().subscribe(
      data => {
        this.consultants = data._embedded.consultants;

        this.userConsultants =
          _.filter(this.consultants, cs => cs.businessManagerId === this.user.id);

        this.consultantsOnMission =
          _.filter(this.userConsultants, consultant =>
            consultant.missions.length > 0).length;
        this.consultantsOnBench = this.userConsultants.length - this.consultantsOnMission;

        this.progress = Math.round(this.consultantsOnMission / this.user.target * 100);

        this.updateChart();

        this.missions = [];
        for (let consultant of this.consultants)
          this.missions = this.missions.concat(consultant.missions);

      },
      err => {
        this.consultants = [];
        this.displayMessage("Something went wrong. Maybe the server is down... (consultants)")
      });

    //LOAD CLIENTS
    this.bmappService.getClients().subscribe(
      data => {
        this.clients = data._embedded.clients;
      },
      err => {
        this.clients = [];
        this.displayMessage('Something went wrong. Maybe the server is down... (clients)');
      });
  }

  /**
   * Runs when the page has fully entered and is now the active page.
   * This event will fire, whether it was the first load or a cached page.
   */
  ionViewDidEnter() {


  }

  /**
   * Uses the available values to update the charts
   */
  updateChart() {

    if (this.user === undefined)
      return;

    //update bar chart
    if (this.bms.length == 0) {
      console.error("No BMs, skipping update");
      return;
    }

    this.bUnitMissionCount = 0;

    for (let bm of this.bms) {
      var consultantsCount = _.filter(this.consultants, function (consultant) {
        if (consultant.businessManagerId === bm.id
          && consultant.missions.length > 0)
          return consultant;
      }).length;

      this.bUnitMissionCount += consultantsCount;
      this.competitionOptions.data.datasets[0].data.push(consultantsCount);
      this.competitionOptions.data.datasets[1].data.push(bm.target);
    }

    this.competitionOptions.data.labels = _.map(this.bms, 'name');

    //update pie chart
    this.consultantsDistributionOptions.data.datasets[0].data = [this.consultantsOnMission, this.consultantsOnBench];


    //handle consultants distribution chart
    /*
    var groupedClients = _.map(this.missions, function (mission) {
      return mission.clientName;
    });

    this.clientsOptions.data.labels = _.uniq(groupedClients);
    this.clientsOptions.data.datasets[0].data =
      _.chain(this.missions)
        .groupBy("clientName")
        .map(function (client) { return client.length })
        .value();

        console.log(this.clientsOptions.data.datasets[0]);
        */
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

  /**
   * Opens up a url with a relaxing video
   */
  takeABreak() {
    window.open(`https://www.youtube.com/watch?v=DJUIgV7t8C0`, '_system');
  }

  displayMessage(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  goToLogin() {
    //this.navCtrl.push(IntroSlidesPage);
  }
}
