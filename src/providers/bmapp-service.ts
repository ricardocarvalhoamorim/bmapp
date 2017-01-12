import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the BmappService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BmappService {

  baseUri = "http://192.168.1.47:8080";
  consultants: any[];
  businessManagers: any[];
  clients: any[];
  headers;

  constructor(public http: Http) {
    this.headers = new Headers();
  }

  /**
   * Fetches the consultants list from the TRM backend
   */
  loadBusinessManagers() {
    return this.http
      .get(this.baseUri + '/businessManagers', this.headers)
      .map(res => res.json());
  }

  /**
   * Fetches the consultants list from the TRM backend
   */
  loadConsultants() {
    return this.http
      .get(this.baseUri + '/consultants', this.headers)
      .map(res => res.json());
  }

   /**
   * Fetches the consultants list from the TRM backend
   */
  loadConsultant(id) {
    return this.http
      .get(this.baseUri + '/consultants/' + id, this.headers)
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


  /**
   * Fetches the missions from the TRM backend
   */
  loadMissions() {
    return this.http
      .get(this.baseUri + '/missions')
      .map(res => res.json());
  }

  saveClient(client) {
    if (client.id) {
      return this.http
        .put(this.baseUri + "/clients/" + client.id, client)
        .map(res => res.json());
    }

    return this.http
      .post(this.baseUri + "/clients", client)
      .map(res => res.json());
  }

  saveConsultant(consultant) {
     if (consultant.id) {
      return this.http
        .put(this.baseUri + "/consultants/" + consultant.id, consultant)
        .map(res => res.json());
    }

    return this.http
      .post(this.baseUri + "/consultants", consultant)
      .map(res => res.json());
  }
}