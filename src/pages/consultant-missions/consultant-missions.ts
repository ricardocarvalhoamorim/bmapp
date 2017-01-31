import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, NavParams } from 'ionic-angular';
import { BmappService } from '../../providers/bmapp-service';
import * as _ from 'lodash';

/*
  Generated class for the ConsultantMissions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-consultant-missions',
  templateUrl: 'consultant-missions.html',
  providers: [BmappService]
})
export class ConsultantMissionsPage {

  error;
  consultant: any;

  constructor(params: NavParams,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private bmService: BmappService) {
    this.consultant = params.data;
  }

  ionViewDidLoad() {
    //this.fetchMissions(null);
    this.consultant.missions = _.map(this.consultant.missions, mission => {
      mission.margin = mission.sellingPrice - mission.cost;
      mission.percentage = Math.round(mission.margin / mission.cost * 100);
      return mission;
    });
  }

  fetchMissions(refresher) {

    let loader = this.loadingCtrl.create({
      content: "Loading missions..."
    });

    if (!refresher) {
      loader.present();
    }

    this.bmService.getConsultants().subscribe(
      data => {
        this.consultant = data;
        this.consultant.missions = _.map(this.consultant.missions, mission => {
          mission.margin = mission.sellingPrice - mission.cost;
          mission.percentage = Math.round(mission.margin / mission.cost * 100);
          return mission;
        });
        if (null != refresher)
          refresher.complete();
        else
          loader.dismiss();

        this.error = null;
      },
      err => {
        this.error = err;
        console.log("Couldn't load missions (mission)");
        if (null != refresher)
          refresher.complete();
        else
          loader.dismiss();
      }
    );
  }

  /**
   * Launches the new mission view
   */
  newMission() {
    let toast = this.toastCtrl.create({
      message: 'This feature will be available soon',
      duration: 3000
    });
    toast.present();
  }
}
