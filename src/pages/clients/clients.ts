import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, Platform, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { NewClientPage } from '../new-client/new-client';

import { BmappService } from '../../providers/bmapp-service'


/*
  Generated class for the Clients page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-clients',
  templateUrl: 'clients.html',
  providers: [BmappService]
})
export class ClientsPage {

  clients: any[];
  error;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public storage: Storage,
    public events: Events,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public bmappService: BmappService
  ) {
    events.subscribe('clients:new', (data) => {
      if (this.clients.indexOf(data[0]) == -1)
        this.clients.push(data[0]);
    });
  }

  ionViewDidLoad() {
    if (!this.clients)
      this.loadClients(null);
  };

  /**
   * Calls the service to dispatch the http request and handles the response
   */
  loadClients(refresher) {

    let loader = this.loadingCtrl.create({
      content: "Loading clients..."
    });

    if (!refresher) {
      loader.present();
    }

    this.bmappService.getClients()
      .subscribe(
      data => {
        this.clients = data._embedded.clients;
        this.error = null;
        if (null != refresher)
          refresher.complete();
        else
          loader.dismiss();
      },
      err => {
        this.clients = [];
        console.log(this.clients);
        if (null != refresher)
          refresher.complete();
        else
          loader.dismiss();

        this.error = err;
        let toast = this.toastCtrl.create({
          message: 'Something went wrong. Maybe the server is down...',
          duration: 3000
        });
        toast.present();
      }
      )
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

  newClient() {
    this.navCtrl.push(NewClientPage);
  }

  editClient($event, client) {
    console.log(client.name);
    this.navCtrl.push(NewClientPage, { 'client': client });
  }
}
