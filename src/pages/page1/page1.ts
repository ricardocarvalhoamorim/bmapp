import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { NewConsultantPage } from '../new-consultant/new-consultant';
import { NewClientPage } from '../new-client/new-client';
import { BMappApi } from '../../shared/BMappApi';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {

  consultants;
  clients;

  constructor(
    public navCtrl: NavController,
    public bmappAPI: BMappApi ) {

  }

  ionViewDidLoad() {
    this.consultants = this.bmappAPI.getConsultants();
    this.clients = this.bmappAPI.getClients();

    console.log(this.consultants.length);
  }

  pushNewConsultant() {
    this.navCtrl.push(NewConsultantPage);
  }


  pushNewClient() {
    this.navCtrl.push(NewClientPage);
  }
}
