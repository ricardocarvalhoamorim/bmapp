import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { NewConsultantPage } from '../pages/new-consultant/new-consultant';
import { NewClientPage } from '../pages/new-client/new-client';
import { ConsultantsPage } from '../pages/consultants/consultants';
import { ClientsPage } from '../pages/clients/clients';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';
import { BMappApi } from '../shared/BMappApi';
import { Storage } from '@ionic/storage';
import { ChartModule } from 'ng2-chartjs2';


@NgModule({
  declarations: [
    MyApp,
    Page1,
    NewConsultantPage,
    NewClientPage,
    ConsultantsPage,
    ClientsPage,
    SettingsPage,
    LoginPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    ChartModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    NewConsultantPage,
    NewClientPage,
    ConsultantsPage,
    ClientsPage,
    SettingsPage,
    LoginPage
  ],
  providers: [
    BMappApi,
    Storage
  ]
})
export class AppModule { }
