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
    user: "",
    password: ""
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
        this.bmappService.setActiveUser(data._embedded.businessManagers[0]);
        this.navCtrl.setRoot(HomePage);
      },
      err => {
        loader.dismiss();
        console.log(err);
      }
    );

  }
}
