import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { NewClientPage } from '../pages/new-client/new-client';
import { ConsultantsPage } from '../pages/consultants/consultants';
import { ClientsPage } from '../pages/clients/clients';
import { SettingsPage } from '../pages/settings/settings';
import { ConsultantHomePage } from '../pages/consultant-home/consultant-home'
import { ConsultantSummaryPage } from '../pages/consultant-summary/consultant-summary'

import { BMappApi } from '../shared/BMappApi';
import { Storage } from '@ionic/storage';
import { ChartModule } from 'ng2-chartjs2';


@NgModule({
  declarations: [
    MyApp,
    Page1,
    NewClientPage,
    ConsultantsPage,
    ClientsPage,
    SettingsPage,
    ConsultantHomePage,
    ConsultantSummaryPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    ChartModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    NewClientPage,
    ConsultantsPage,
    ClientsPage,
    SettingsPage,
    ConsultantHomePage,
    ConsultantSummaryPage
  ],
  providers: [
    BMappApi,
    Storage
  ]
})
export class AppModule { }
