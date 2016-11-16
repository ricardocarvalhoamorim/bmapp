import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { BMappApi } from '../../shared/BMappApi';

/*
  Generated class for the Consultants page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-consultants',
  templateUrl: 'consultants.html'
})
export class ConsultantsPage {

  consultants: any[];
  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public bmappAPI: BMappApi) { }

  ionViewDidLoad() {
    this.bmappAPI.getConsultants().then((data) => {
        this.consultants = data;
        console.log(data);
    });
  }

  /**
   * Place a call to the client's number
   */
  call($event, client) {
    window.open(`tel:${client.contact}`, '_system')
  }

  email($event, client) {

    window.open(`mailto:${client.email}`, '_system')
  }

}
