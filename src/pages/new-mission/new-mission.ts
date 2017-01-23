import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the NewMission page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-new-mission',
  templateUrl: 'new-mission.html'
})
export class NewMissionPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello NewMissionPage Page');
  }

}
