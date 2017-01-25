import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, AlertController, Events } from 'ionic-angular';
import { BmappService } from '../../providers/bmapp-service';
import { ConsultantsPage } from '../consultants/consultants'

/*
  Generated class for the NewConsultant page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-consultant-summary',
  templateUrl: 'consultant-summary.html'
})
export class ConsultantSummaryPage {

  /**
   * The consultant object
   */
  consultant: any;
  /**
   * The list of clients available to pick
   */
  clients: any[];
  /**
   * The current active user
   */
  user: any;
  /**
   * Whether the layout should or shouldn't allow changes
   */
  isReadOnly = true;
  /**
   * The id of the selected client
   */
  pickedClient;

  error;

  constructor(
    params: NavParams,
    public navCtrl: NavController,
    public toastController: ToastController,
    public events: Events,
    public alertCtrl: AlertController,
    public bmappService: BmappService) {

    this.consultant = params.data;

    this.bmappService.getActiveUser().then(
      data => {
        this.user = data;
        if (this.user.id !== this.consultant.businessManagerId && !this.user.isUnitManager) {
          this.isReadOnly = true;
          return;
        }

        this.isReadOnly = false;
      },
      err => {
        this.error = err;
        console.log("unable to get user (summary)");
      }
    )

  }

  ionViewDidLoad() {
    this.bmappService.getClients().subscribe(
      (val) => {
        this.clients = val;
      },
      err => {
        console.log(err);
      });
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

  /**
   * Show confirmation dialog and proceeds to delete the record if the user confirms
   */
  showDeletePrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Delete record',
      message: "Are you sure you want to delete this record?",
      buttons: [
        {
          text: 'No'
        },
        {
          text: 'Yes',
          handler: data => {

            this.bmappService.deleteConsultant(this.consultant).subscribe(
              data => {
                this.presentToast("Unable to delete this record");
                this.navCtrl.setRoot(ConsultantsPage);
              },
              err => {
                this.presentToast("Unable to delete this record");
                console.log(err);
              }
            );
          }
        }
      ]
    });
    prompt.present();
  }

  /**
   * Updates the margin and profit whenever the input is changed
   */
  onCostsChanged($event) {
    var margin = this.consultant.selling_price - this.consultant.package;
    this.consultant.profit = margin + " (" + Math.round((margin / this.consultant.selling_price) * 100) + "%)";
  }
}
