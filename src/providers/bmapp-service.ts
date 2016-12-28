import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the BmappService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BmappService {

  baseUri = "http://192.168.1.84:8080";
  consultants: any[];
  businessManagers: any[];
  clients: any[];

  constructor(public http: Http) {
  }

  /**
   * Fetches the consultants list from the TRM backend
   */
  loadConsultants() {
    if (this.consultants) {
      // already loaded data
      return Promise.resolve(this.consultants);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http.get(this.baseUri + '/consultants')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.consultants = data;
          resolve(this.consultants);
        });
    });
  }


  /**
   * Fetches the clients from the TRM backend
   */
  loadClients() {
    return this.http
      .get(this.baseUri + '/clients')
      .map(res => res.json());
  }
}