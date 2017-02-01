import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { NewClientPage } from '../pages/new-client/new-client';
import { ConsultantsPage } from '../pages/consultants/consultants';
import { ClientsPage } from '../pages/clients/clients';
import { SettingsPage } from '../pages/settings/settings';
import { ConsultantHomePage } from '../pages/consultant-home/consultant-home'
import { ConsultantSummaryPage } from '../pages/consultant-summary/consultant-summary'
import { ConsultantMissionsPage } from '../pages/consultant-missions/consultant-missions'
import { MissionsPage } from '../pages/missions/missions'
import { NewMissionPage } from '../pages/new-mission/new-mission'
import { LoginPage } from '../pages/login/login'

import { Storage } from '@ionic/storage';
import { ChartModule } from 'ng2-chartjs2';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NewClientPage,
    NewMissionPage,
    ConsultantsPage,
    ClientsPage,
    MissionsPage,
    SettingsPage,
    ConsultantHomePage,
    ConsultantSummaryPage,
    ConsultantMissionsPage,
    LoginPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    ChartModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NewClientPage,
    NewMissionPage,
    ConsultantsPage,
    ClientsPage,
    MissionsPage,
    SettingsPage,
    ConsultantHomePage,
    ConsultantSummaryPage,
    ConsultantMissionsPage,
    LoginPage
  ],
  providers: [
    Storage
  ]
})
export class AppModule { }

