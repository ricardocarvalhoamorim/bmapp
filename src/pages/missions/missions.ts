import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, Events, Platform } from 'ionic-angular';
import { NewMissionPage } from '../new-mission/new-mission'
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
  ios;
  consultants: any[];
  missions: any[];
  filteredMissions: any[]; 
  searchInput = '';
  missionFilter = 'mine';

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private platform: Platform,
    private events: Events,
    private bmappService: BmappService) { }

  ionViewDidLoad() {
    this.ios = this.platform.is('ios');
    this.bmappService.getActiveUser().then(data => {
      this.user = data;
      this.loadMissions(null);
    });

    this.events.subscribe('mission:created', (mission) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      this.loadMissions(null);
      this.filterMissions();
      this.presentToast("Successfully saved!");
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

    this.bmappService.getConsultants().subscribe(
      data => {
        this.consultants = data._embedded.consultants;

        this.missions = [];
        for (let consultant of this.consultants)
          this.missions = this.missions.concat(consultant.missions);

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

    this.filteredMissions = filteredResults;
  }

  onCancel($event) {
    this.filterMissions();
  }

  newMission() {
    this.navCtrl.push(NewMissionPage, { consultants: this.consultants, user: this.user });
  }

  editMission($event, mission) {
    this.navCtrl.push(NewMissionPage, { mission: mission, consultants: this.consultants, user: this.user });
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
