import { Component } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';

import { BmappService } from '../../providers/bmapp-service'
import { ConsultantSummaryPage } from '../consultant-summary/consultant-summary'
import { ConsultantMissionsPage } from '../consultant-missions/consultant-missions'

/*
  Generated class for the ConsultantHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-consultant-home',
  templateUrl: 'consultant-home.html',
  providers: [BmappService]
})
export class ConsultantHomePage {

  consultantSummary = ConsultantSummaryPage;
  consultantMissions = ConsultantMissionsPage;
  consultant: any;
  user: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private bmappService: BmappService) {
    if (!navParams.get('consultant')) {
      console.log("Missing consultant");
      return;
    }

    this.consultant = navParams.get('consultant');
    this.user = navParams.get('user');
  }

/**
 * Calls the service to save the record
 */
  saveConsultant() {
    console.error(this.consultant);
    /*
    this.bmappService.saveConsultant(this.consultant).subscribe(
      data => {
        this.consultant = data;
        this.presentToast("Record saved successfully");
        this.navCtrl.pop();
      },
      err => {
        console.log(err);
        this.presentToast("Something went wrong, please try again later");
      }
    );
    */
  }

  ionViewDidLoad() {
    console.log('Hello ConsultantHomePage Page');
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
