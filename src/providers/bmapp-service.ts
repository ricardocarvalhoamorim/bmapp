import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
  Generated class for the BmappService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BmappService {

  baseUri = "http://192.168.1.23:8080";
  public storage: Storage;
  consultants: any[];
  businessManagers: any[];
  clients: any[];
  headers;

  constructor(
    public http: Http,
    storage: Storage) {
    this.headers = new Headers();  
    this.storage = storage;
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

  /**
   * Saves a consultant record either updating it or creating a new one
   */
  saveConsultant(consultant) {

    //consultant.businessManger = "businessManagers/" + consultant.businessManagerId;
    console.log(consultant);

    if (consultant.id) {
      return this.http
        .put(this.baseUri + "/consultants/" + consultant.id, consultant)
        .map(res => res.json());
    }

    return this.http
      .post(this.baseUri + "/consultants", consultant)
      .map(res => res.json());
  }

  /**
   * Attempts to delete a consultant record
   */
  deleteConsultant(consultant) {
    console.log(consultant);

    return this.http
      .delete(this.baseUri + "/consultants/" + consultant.id)
      .map(res => res.json());
  }

  setActiveUser(user) {
    this.storage.set("active_user", user);
  }

  getActiveUser() {
    return this.storage.get("active_user");
  }
}