import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewConsultantPage } from '../new-consultant/new-consultant';
import { NewClientPage } from '../new-client/new-client';
import { SettingsPage } from '../settings/settings';
import { BMappApi } from '../../shared/BMappApi';


@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {

  consultants;
  clients;
  today = new Date().toDateString();


  constructor(
    public navCtrl: NavController,
    public bmappAPI: BMappApi ) {;

  }

  ionViewDidLoad() {
    //load clients and consultants
    this.bmappAPI.getConsultants().then((val) => {
      this.consultants = val;
      console.log("Loaded " + val);
    });

    this.bmappAPI.getClients().then((val) => {
      this.clients = val;
    });
  }

  ionViewWillEnter() {
    this.ionViewDidLoad();
  }

  pushNewConsultant() {
    this.navCtrl.push(NewConsultantPage);
  }


  pushNewClient() {
    this.navCtrl.push(NewClientPage);
  }

  switchToSettings() {
    this.navCtrl.setRoot(SettingsPage);
  }
}
