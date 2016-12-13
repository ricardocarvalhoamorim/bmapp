import { Component } from '@angular/core';
import { NavController, ToastController, Platform, Events } from 'ionic-angular';
import { BMappApi } from '../../shared/BMappApi';
import { NewConsultantPage } from '../new-consultant/new-consultant';
import * as _ from 'lodash';

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

  consultants;
  filteredConsultants;
  user;
  consultantsFilter = 'mine';
  searchInput = "";

  constructor(
    public navCtrl: NavController,
    public toastController: ToastController,
    public platform: Platform,
    public events: Events,
    public bmappAPI: BMappApi) {

    events.subscribe('consultants:new', (data) => {
      if (this.consultants.indexOf(data[0]) == -1)
        this.consultants.push(data[0]);

      this.filterConsultants();
    });

    this.events.subscribe('consultants:deleted', (data) => {
      console.log(data[0].name);
      var index = _.indexOf(
        this.consultants,
        _.find(this.consultants, { id: data[0].id }));

      if (index === -1) {
        console.log("Unable to delete item: " + data[0].name);
        return;
      }

      this.consultants.splice(index, 1);
      this.filterConsultants();
      this.presentToast("Consultant deleted");
    });
  }

  ionViewDidLoad() {
    this.bmappAPI.getConsultants().then((data) => {
      this.consultants = data;
    });

    this.bmappAPI.getBms().then((data) => {
      if (data === undefined)
        return;
      this.user = _.find(data, { active: true });
      this.filterConsultants();
    });
  }

  /**
   * Filters the list of consultants according to the selected tab
   */
  filterConsultants() {
    if (this.consultantsFilter === 'all') {
      this.filteredConsultants = this.consultants;
    } else {
      this.filteredConsultants = _.filter(this.consultants, s => s.bm === this.user.id);
    }
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

  newConsultant() {
    this.navCtrl.push(NewConsultantPage, { 'user': this.user });
  }

  editConsultant($event, consultant) {
    this.navCtrl.push(NewConsultantPage, { 'consultant': consultant, 'user': this.user });
  }

  /**
 * Displays a toast with the specified message
 */
  presentToast(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  onInput($event) {
    if (this.searchInput === '') {
      this.onCancel(null);
      return
    }
    let queryTextLower = this.searchInput.toLowerCase();
    let filteredResults = _.filter(this.filteredConsultants, function (consultant) {
      return consultant.name.toLowerCase().includes(queryTextLower) || consultant.skills.toLowerCase().includes(queryTextLower);
    });

console.log(filteredResults);
    this.filteredConsultants = filteredResults;
  }

  onCancel($event) {
    this.filterConsultants();
  }

}

