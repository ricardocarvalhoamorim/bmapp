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
   * Chart with a comparison between business managers
   */
  @ViewChild(ChartComponent) competitionComp;
  public competitionOptions = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Running missions',
          data: [],
          backgroundColor:
          'rgba(215, 40, 40, 0.9)'
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

  constructor(
    public navCtrl: NavController,
    public events: Events,
    public bmappAPI: BMappApi) {

    events.subscribe('consultants:new', (data) => {
      this.consultants.push(data);
      this.ionViewDidLoad();
    });

    events.subscribe('clients:new', (data) => {
      this.clients.push(data);
      this.ionViewDidLoad();
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
          name: 'Demo user',
          initials: 'DU',
          email: 'duser@adneom.com',
          contact: '+32 881 77 11',
          target: 3,
          isUnitManager: false,
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
   * Uses the available values to update the chart
   */
  updateChart() {

    if (this.user === undefined)
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
          && consultant.clientID !== '-1'
          //&& new Date(consultant.ending_date) < new Date()
        )
          return consultant;
      }).length;
      this.competitionOptions.data.datasets[0].data.push(consultantsCount);
    }

    //update pie chart
    this.consultantsDistributionOptions.data.datasets[0].data = [this.consultantsOnMission, this.consultantsOnBench];
    this.competitionComp.chart.update(2000);
    //this.consultantsDistributionComp.chart.update();

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
