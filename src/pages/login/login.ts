import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { BmappService } from '../../providers/bmapp-service'

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [BmappService]
})
export class LoginPage {

  authentication: any = {
    user: "tdumont@adneom.com",
    password: "adneom"
  };
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public bmappService: BmappService) { }

  ionViewDidLoad() {
  }

  authenticate() {

    if (!this.authentication.user || !this.authentication.password) {
      let toast = this.toastCtrl.create({
        message: 'Please provide the necessary fields',
        duration: 3000
      });

      toast.present();
      return;
    }

    let loader = this.loadingCtrl.create({
      content: "Authenticating..."
    });
    loader.present();

    this.bmappService.authenticate(this.authentication).subscribe(
      data => {
        loader.dismiss();
        //For now, we'll just check if it is a registered user
        //until we have a functionall authentication
        for (let bm of data._embedded.businessManagers) {
          if (bm.email === this.authentication.user) {
            this.bmappService.setActiveUser(bm);
            this.navCtrl.setRoot(HomePage, {}, { animate: true, direction: 'forward' });
            return;
          }
        }

        let toast = this.toastCtrl.create({
          message: 'Your email was not recognized by our servers. Please make sure you have typed it correctly and try again',
          duration: 5000
        });

        toast.present();

      },
      err => {
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Could\'nt validate the provided credentials. Please try again later.',
          duration: 5000
        });

        toast.present();
        console.log(err);
      }
    );

  }
}
