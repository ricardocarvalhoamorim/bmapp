import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { BMappApi } from '../../shared/BMappApi';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {

  consultants: any[];
  clients: any[];
  
  constructor(
    public navCtrl: NavController,
    public bmappAPI: BMappApi) {
    
  }

  ionViewDidLoad() {
    this.consultants = this.bmappAPI.getConsultants();
    this.clients = this.bmappAPI.getClients();
  }

}
