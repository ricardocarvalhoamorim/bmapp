import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BmappService } from '../../providers/bmapp-service';

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

  consultant: any;
  missions: any[];

  constructor(params: NavParams,
    public navCtrl: NavController,
    public bmService: BmappService) {
    this.consultant = params.data;
    console.log(this.consultant);
  }

  ionViewDidLoad() {
    this.bmService.loadMissions().subscribe(
      data => {
        this.missions = data._embedded.missions;
        console.log(this.missions);
      }, 
      err => {
        console.log("Couldn't load missions (mission)");
      }
    );
  }
}
