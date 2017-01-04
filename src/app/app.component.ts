import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Page1 } from '../pages/page1/page1';
import { ConsultantsPage } from '../pages/consultants/consultants';
import { ClientsPage } from '../pages/clients/clients';
import { SettingsPage } from '../pages/settings/settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Page1;
  today = new Date().toDateString();
  pages: Array<{ title: string, component: any }>;
  consultants: any[];

  constructor(
    public platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // used for an example of ngFor and navigation
      this.pages = [
        { title: 'Home', component: Page1 },
        { title: 'Consultants', component: ConsultantsPage },
        { title: 'Client portfolio', component: ClientsPage },
        { title: 'Settings', component: SettingsPage }
      ];
      StatusBar.styleDefault();
      Splashscreen.hide();
    });


  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  /**
 * Sends an email with feedback for the application
 */
  feedback() {
    window.open(`mailto:rcamorim@adneom.com?subject=BMApp feedback&body=Hi Ricardo, Here\'s my feedback on the app`, '_system');
  }
}
