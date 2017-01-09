import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ConsultantSummaryPage } from '../consultant-summary/consultant-summary'

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

consultantSummary: ConsultantSummaryPage;
consultant: any;

  constructor(
    public navCtrl: NavController) { }

  ionViewDidLoad() {
    console.log('Hello ConsultantHomePage Page');
  }

}
