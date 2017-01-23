import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { BmappService } from '../../providers/bmapp-service';
import * as _ from 'lodash';

/*
  Generated class for the Missions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-missions',
  templateUrl: 'missions.html',
  providers: [BmappService]
})
export class MissionsPage {

  user;
  error;
  consultants: any[];
  missions: any[];
  filteredMissions: any[];
  searchInput = '';
  missionFilter = 'mine';

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private bmappService: BmappService) { }

  ionViewDidLoad() {
    console.log('Hello MissionsPage Page');
    this.bmappService.getActiveUser().then(data => {
      this.user = data;
      this.loadMissions(null);
    });
  }

  /**
 * Loads the consultants, extracts their missions and populates the list
 */
  loadMissions(refresher) {
    let loader = this.loadingCtrl.create({
      content: "Loading missions..."
    });

    if (!refresher) {
      loader.present();
    }

    this.bmappService.loadConsultants().subscribe(
      data => {
        this.consultants = data._embedded.consultants;

        this.missions = [];
        for (let consultant of this.consultants)
          this.missions = this.missions.concat(consultant.missions);

        this.missions = _.map(this.missions, mission => {
          mission.margin = mission.sellingPrice - mission.cost;
          mission.percentage = Math.round(mission.margin / mission.cost * 100);
          return mission;
        });

        this.filterMissions();
        this.error = null;

        if (null != refresher)
          refresher.complete();
        else
          loader.dismiss();
      },
      err => {
        this.error = err;
        console.log(err);
        if (null != refresher)
          refresher.complete();
        else
          loader.dismiss();
      }
    );
  }

  /**
   * Filters the list of missions according to the selected tab
   */
  filterMissions() {
    if (this.missionFilter === 'all') {
      this.filteredMissions = this.missions;
    } else {
      this.filteredMissions = _.filter(this.missions, s => s.businessManagerId === this.user.id);
    }
  }

  onInput($event) {
    if (this.searchInput === '') {
      this.onCancel(null);
      return
    }
    let queryTextLower = this.searchInput.toLowerCase();
    let filteredResults = _.filter(this.filteredMissions, function (mission) {
      return mission.role.toLowerCase().includes(queryTextLower) || mission.clientName.toLowerCase().includes(queryTextLower);
    });

    console.log(filteredResults);
    this.filteredMissions = filteredResults;
  }

  onCancel($event) {
    this.filterMissions();
  }

}
