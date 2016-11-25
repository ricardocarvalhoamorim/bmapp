import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as _ from 'lodash';
//import { Http /*, Response*/ } from '@angular/http';

@Injectable()
export class BMappApi {

    public storage: Storage;

    constructor(
        public platform: Platform,
        storage: Storage,
        public events: Events) {
        this.storage = storage;
    }

    /**
     * Returns the list of registered cosultants
     */
    getConsultants() {
        return this.storage.get('consultants');
    }

    /**
     * Returns the list of registered clients
     */
    getClients() {
        return this.storage.get('clients');
    }

    /**
     * Gets the registered business managers
     */
    getBms() {
        return this.storage.get('bms');
    }

    /**
     * Attempts to save a new consultant to de database
     */
    saveConsultant(consultant) {
        this.getConsultants().then((val) => {
            if (val === null) {
                val = [];
            }

            var index = _.indexOf(val, _.find(val, { id: consultant.id }));

            if (index === -1) {
                val.push(consultant);
            } else {
                val.splice(index, 1, consultant);
            }

            this.storage.set('consultants', val);
            this.events.publish('consultant:new', consultant);
        });
    }

    /**
     * Attempts to save a new client to de database
     */
    saveClient(client) {
        this.getClients().then((val) => {
            if (val === null) {
                val = [];
            }

            
            var index = _.indexOf(val, _.find(val, { id: client.id }));
            if (index === -1) {
                val.push(client);
            } else {
                val.splice(index, 1, client);
            }

            this.storage.set('clients', val);
            this.events.publish('client:new', client);
        });
    }

    /**
         * Attempts to save a business manager or create a new one
         */
    saveBM(businessManager) {
        this.getBms().then((val) => {
            if (val === null) {
                val = [];
            }

            //disable all other users
            _.map(val, function (v) {
                v.active = false;
            });
            
            businessManager.active = true;

            var index = _.indexOf(val, _.find(val, { id: businessManager.id }));
            if (index === -1) {
                //doesn't exist, just push a new one
                console.log("NEW");
                val.push(businessManager);
            } else {
                //update an existing one
                console.log("UPDATE");
                val.splice(index, 1, businessManager);
            }
            console.log(val);
            this.storage.set('bms', val);
            this.events.publish('bm:new', businessManager);
        });
    }

    loadDummyData() {
        this.storage.set('bms', this.dummy_bms);
        this.storage.set('consultants', this.dummy_consultants);
        this.storage.set('clients', this.dummy_clients);
    }

    reset() {
        this.storage.clear();
    }

    dummy_bms = [
        {
            id: '9',
            name: 'Ricardo Amorim',
            email: 'ramorim@adneom.com',
            contact: '+32 478 62 11 12',
            target: 25,
            active: true
        },
        {
            id: '8',
            name: 'Susan Boyle',
            email: 'sboyle@adneom.com',
            contact: '+32 478 62 11 12',
            target: 10,
            active: false
        },
        {
            id: '7',
            name: 'Jack Sparrow',
            email: 'jsparrow@adneom.com',
            contact: '+32 478 62 11 12',
            target: 15,
            active: false
        },
        {
            id: '6',
            name: 'Daniel Wijnans',
            email: 'dwijnans@adneom.com',
            contact: '+32 478 62 11 12',
            target: 10,
            active: false
        },
        {
            id: '5',
            name: 'Tristan Dumont',
            email: 'tdumont@adneom.com',
            contact: '+32 478 62 11 12',
            target: 40,
            active: false
        }
    ];

    dummy_clients = [
        {
            id: '9191',
            bm: '7',
            name: 'ADNEOM Lab',
            address: 'Rue Knappen 92',
            contact: '+32 123 45 67',
            email: 'general@adneom.com'
        },
        {
            id: '877120',
            bm: '8',
            name: 'Don Giovanni',
            address: 'Palais des beaux arts',
            contact: '+32 123 45 88',
            email: 'giovanni@adneom.com'
        },
        {
            id: '0012314',
            bm: '8',
            name: 'Proximus',
            address: 'Rue de la Loi',
            contact: '+00012 99070120 123 45 67',
            email: 'general@proximus.com'
        }
    ];

    dummy_consultants = [
        {
            id: '919182',
            bm: '9',
            name: 'Franz Lizst',
            email: 'flizst@dolph.com',
            contact: '+32 444 11 11',
            starting_date: '2009-08-11',
            ending_date: '2016-11-31',
            department: 'Development',
            skills: 'Java, Java EE',
            client: 'deloitte',
            languages: 'Portuguese, Spanish',
            car: true
        },
        {
            id: '9112',
            bm: '8',
            name: 'Antonín Dvořák',
            email: 'advorak@dolph.com',
            contact: '+32 991 11 11',
            starting_date: '2009-01-29',
            ending_date: '2016-11-31',
            department: 'Development',
            skills: 'AngularJs',
            languages: 'French, Dutch, German',
            client: 'FreeeDrive',
            car: true
        },
        {
            id: '19200',
            bm: '7',
            name: 'Gustav Mahler',
            email: 'gmahler@symphony.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            ending_date: '2016-11-31',
            department: 'Development',
            skills: 'Python, SQL Server, Android, Ruby on Rails',
            languages: 'French, Dutch, Portuguese, German',
            client: 'ZipCar',
            car: false
        },
        {
            id: '88272',
            bm: '8',
            name: 'Antonio Vivaldi',
            email: 'avivaldi@music.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            ending_date: '2016-11-31',
            department: 'Engineering',
            skills: 'Civil Engineering, Fracture Mechanics, Load balancing',
            languages: 'French, Dutch, Portuguese, German',
            client: 'Telenet',
            car: false
        },
        {
            id: '66251',
            bm: '9',
            name: 'Johann Sebastian Bach',
            email: 'jbach@music.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            ending_date: '2016-11-31',
            department: 'Engineering',
            skills: 'Mechanical Engineering',
            languages: 'French, Dutch, Portuguese, German',
            client: 'FreeeDrive',
            car: false
        },
        {
            id: '11121',
            bm: '7',
            name: 'Wolfgang Amadeus Mozart',
            email: 'wmozart@music.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            ending_date: '2016-09-31',
            department: 'IT Support',
            skills: 'Server Maintenance, Linux servers, Microsoft SQL server',
            languages: 'French, Dutch, Portuguese, German',
            client: 'FreeeDrive',
            car: false
        },
        {
            id: '11121',
            bm: '8',
            name: 'Wolfgang Amadeus Mozart',
            email: 'wmozart@music.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            ending_date: '',
            department: 'IT Support',
            skills: 'Server Maintenance, Linux servers, Microsoft SQL server',
            languages: 'French, Dutch, Portuguese, German',
            client: 'Not defined',
            car: false
        }
    ];
}