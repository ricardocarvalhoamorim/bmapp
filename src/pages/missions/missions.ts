import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Missions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-missions',
  templateUrl: 'missions.html'
})
export class MissionsPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello MissionsPage Page');
  }

}
