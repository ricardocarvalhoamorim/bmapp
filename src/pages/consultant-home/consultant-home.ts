import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ConsultantSummaryPage } from '../consultant-summary/consultant-summary'
import { ConsultantMissionsPage } from '../consultant-missions/consultant-missions'

/*
  Generated class for the ConsultantHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-consultant-home',
  templateUrl: 'consultant-home.html'
})
export class ConsultantHomePage {

  consultantSummary = ConsultantSummaryPage;
  consultantMissions = ConsultantMissionsPage;
  consultant: any;
  user: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
    if (!navParams.get('consultant')) {
      console.log("Missing consultant");
      return;
    }

    this.consultant = navParams.get('consultant');
    this.user = navParams.get('user');
    /*
        this.consultant.missions = [
          {
            "id": 3,
            "startDate": "2016-08-31",
            "endDate": "2017-01-17",
            "role": "Senior Java Developer",
            "sellingPrice": 870,
            "country": "Belgium",
            "clientId": "4",
            "clientName": "Proximus",
            "consultantId": 7,
            "consultantName": "Ricardo Amorim"
          },
          {
            "id": 3,
            "startDate": "2016-08-31",
            "endDate": "2017-01-17",
            "role": "Senior Java Developer",
            "sellingPrice": 490,
            "country": "Luxembourg",
            "clientId": "4",
            "clientName": "Proximus",
            "consultantId": 7,
            "consultantName": "Ricardo Amorim"
          }
        ]
    
        */
  }

  ionViewDidLoad() {
    console.log('Hello ConsultantHomePage Page');
  }

}
