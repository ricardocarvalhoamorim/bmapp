import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
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
  missions: any[];

  constructor(params: NavParams,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public bmService: BmappService) {
    this.consultant = params.data;
  }

  ionViewDidLoad() {
    this.fetchMissions(null);
  }

  fetchMissions(refresher) {

    let loader = this.loadingCtrl.create({
      content: "Loading missions..."
    });

    if (!refresher) {
      loader.present();
    }

    this.bmService.loadMissions().subscribe(
      data => {
        this.missions = data._embedded.missions;
        this.missions = _.map(this.missions, mission => {
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
}
