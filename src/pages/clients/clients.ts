import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { BMappApi } from '../../shared/BMappApi';
/*
  Generated class for the Clients page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-clients',
  templateUrl: 'clients.html'
})
export class ClientsPage {

  clients: any[];

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public bmappAPI: BMappApi
  ) { }

  ionViewDidLoad() {
    console.log('Hello ClientsPage Page');

    this.clients = this.bmappAPI.getClients();
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

  /**
   * Launches a map call to show directions to the provided address
   */
  navigate($event, client) {
    if (this.platform.is('iOS')) {
      window.open("http://maps.apple.com/?q=" + client.address, '_system');
      return;
    }
    if (this.platform.is('Android')) {
      window.open("geo:" + client.address);
      return;
    }
    window.open("http://maps.google.com/?q=" + client.address, '_system');
    return;
  }
}
