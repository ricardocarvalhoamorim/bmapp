import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, NavParams, Events } from 'ionic-angular';
import { BmappService } from '../../providers/bmapp-service';
import * as _ from 'lodash';
/*
  Generated class for the NewMission page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-new-mission',
  templateUrl: 'new-mission.html',
  providers: [BmappService]
})
export class NewMissionPage {

  error: any;
  user: any;
  mission: any;
  client: any;
  consultant: any;

  clients: any[];
  consultants: any[];
  isReadOnly = false;

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private events: Events,
    private bmappService: BmappService) {

    this.consultants = navParams.get('consultants');
    this.user = navParams.get('user');



    if (!navParams.get('mission')) {
      console.log("Didn't receive the required object!");
      this.mission = {
        startDate: '',
        endDate: '',
        role: '',
        sellingPrice: '',
        businessManagerId: this.user.id,
        clientName: '',
        clientId: -1,
        consultantId: -1,
        country: ''
      }
      this.isReadOnly = false;
    } else {
      this.mission = navParams.get('mission');
      if (this.mission.businessManagerId == this.user.id)
        this.isReadOnly = false;
      else
        this.isReadOnly = true;
    }


  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: "Loading data..."
    });

    this.bmappService.getClients().subscribe(
      data => {
        this.clients = data._embedded.clients;
        this.error = null;
        if (this.mission.id) {
          this.client = _.find(this.clients, { 'id': this.mission.clientId });
          this.consultant = _.find(this.consultants, { 'id': this.mission.consultantId });
        }
        loader.dismiss();
        this.onCostsChanged(null);
      },
      err => {
        this.error = err;
        loader.dismiss();
      }
    )
  }

  /**
 * Updates the margin and profit whenever the input is changed
 */
  onCostsChanged($event) {
    if (!this.consultant)
      return;

    this.mission.margin = Math.round(this.mission.sellingPrice - this.mission.cost);
    this.mission.percentage = Math.round(this.mission.margin / this.mission.cost * 100);
  }

  saveMission() {
    if (!this.client) {
      this.presentToast("You must provide a client for this mission");
      return;
    }

    if (!this.consultant) {
      this.presentToast("You must provide a consultant for this mission");
      return;
    }

    if (!this.mission.startDate || !this.mission.endDate) {
      this.presentToast("Please specify the time coverage for this mission");
      return;
    }


    this.mission.businessManager = this.user._links.self.href;
    this.mission.client = this.client._links.self.href;
    this.mission.consultant = this.consultant._links.self.href;

    console.log(this.mission);
    this.bmappService.saveMission(this.mission).subscribe(
      data => { 
        this.navCtrl.pop();
        this.events.publish('mission:created', data);
      },
      err => {
        this.presentToast("An error occurred when saving this record");
        console.error(err);
      }
    );
    //this.presentToast("Back end is still not accepting this feature");
  }

  /**
 * Displays a toast with the specified message
 */
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
