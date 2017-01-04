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

  baseUri = "http://192.168.1.20:8080";
  consultants: any[];
  businessManagers: any[];
  clients: any[];

  constructor(public http: Http) {
  }



  /**
   * Fetches the consultants list from the TRM backend
   */
  loadBusinessManagers() {
    return this.http
      .get(this.baseUri + '/businessManagers')
      .map(res => res.json());
  }

  /**
   * Fetches the consultants list from the TRM backend
   */
  loadConsultants() {
    return this.http
      .get(this.baseUri + '/consultants')
      .map(res => res.json());
  }

  loadUserConsultants(userID) {
    return this.http
      .get(this.baseUri + '/businessManagers/' + userID + '/consultants')
      .map(res => res.json());
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