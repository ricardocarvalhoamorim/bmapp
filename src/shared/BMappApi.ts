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

        this.dbCheckup();
    }

    /**
     * check the database before continuing
     */
    dbCheckup() {

        this.storage.get('consultants').then((data) => {
            if (data != null)
                return;

            console.log('CONSULTANTS ENTRY CREATED');
            this.storage.set('consultants', []);

        });

        this.storage.get('clients').then((data) => {
            if (data != null)
                return;

            console.log('CLIENTS ENTRY CREATED');
            this.storage.set('clients', []);

        });

        this.storage.get('bms').then((data) => {
            if (data != null)
                return;

            console.log('BMS ENTRY CREATED');
            this.storage.set('bms', []);
        });
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
                console.log("Creating a new consultant: " + consultant);
                val.push(consultant);
            } else {
                console.log("Updating a consultant: " + consultant);
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

            businessManager.initials = businessManager.name.match(/\b(\w)/g).join('');
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
        this.dbCheckup();
    }

    dummy_bms = [
        {
            id: 'bm1',
            name: 'Ricardo Amorim',
            initials: 'RA',
            email: 'ramorim@adneom.com',
            contact: '+32 478 62 11 12',
            target: 25,
            active: true
        },
        {
            id: 'bm2',
            name: 'Daniel Wijnans',
            initials: 'DW',
            email: 'dwijnans@adneom.com',
            contact: '+32 478 62 11 12',
            target: 10,
            active: false
        },
        {
            id: 'bm3',
            name: 'Tristan Dumont',
            initials: 'TD',
            email: 'tdumont@adneom.com',
            contact: '+32 478 62 11 12',
            target: 40,
            active: false
        },
        {
            id: 'bm4',
            name: 'Laura Antonacci',
            initials: 'LA',
            email: 'lantonacci@adneom.com',
            contact: '+32 478 62 11 12',
            target: 10,
            active: false
        },
        {
            id: 'bm5',
            name: 'Alessandre Brasseur',
            initials: 'AB',
            email: 'abrasseur@adneom.com',
            contact: '+32 478 62 11 12',
            target: 12,
            active: false
        }
    ];

    dummy_clients = [
        {
            id: 'c1',
            bm: 'bm1',
            name: 'ADNEOM Lab',
            address: 'Rue Knappen 92',
            contact: '+32 123 45 67',
            email: 'general@adneom.com'
        },
        {
            id: 'c2',
            bm: 'bm1',
            name: 'Don Giovanni',
            address: 'Palais des beaux arts',
            contact: '+32 123 45 88',
            email: 'giovanni@adneom.com'
        },
        {
            id: 'c3',
            bm: 'bm3',
            name: 'Proximus',
            address: 'Rue de la Loi',
            contact: '+00012 99070120 123 45 67',
            email: 'general@proximus.com'
        }
    ];

    dummy_consultants = [
        {
            id: 'cs1',
            bm: 'bm1',
            name: 'Franz Lizst',
            email: 'flizst@dolph.com',
            contact: '+32 444 11 11',
            starting_date: '2009-08-11',
            ending_date: '2016-11-31',
            skills: 'Java, Java EE',
            client: 'c1',
            languages: 'Portuguese, Spanish',
            car: true
        },
        {
            id: 'cs2',
            bm: 'bm2',
            name: 'Antonín Dvořák',
            email: 'advorak@dolph.com',
            contact: '+32 991 11 11',
            starting_date: '2009-01-29',
            ending_date: '2016-11-31',
            skills: 'AngularJs',
            languages: 'French, Dutch, German',
            client: 'c1',
            car: true
        },
        {
            id: 'cs3',
            bm: 'bm2',
            name: 'Gustav Mahler',
            email: 'gmahler@symphony.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            ending_date: '2016-11-31',
            skills: 'Python, SQL Server, Android, Ruby on Rails',
            languages: 'French, Dutch, Portuguese, German',
            client: 'c2',
            car: false
        },
        {
            id: 'cs4',
            bm: 'bm2',
            name: 'Antonio Vivaldi',
            email: 'avivaldi@music.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            ending_date: '2016-11-31',
            skills: 'Civil Engineering, Fracture Mechanics, Load balancing',
            languages: 'French, Dutch, Portuguese, German',
            client: '',
            car: false
        },
        {
            id: 'cs5',
            bm: 'bm1',
            name: 'Johann Sebastian Bach',
            email: 'jbach@music.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            ending_date: '2016-11-31',
            skills: 'Mechanical Engineering',
            languages: 'French, Dutch, Portuguese, German',
            client: 'c3',
            car: false
        },
        {
            id: 'cs6',
            bm: 'bm4',
            name: 'Sebastian Javert',
            email: 'sjavert@music.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            ending_date: '2016-12-31',
            skills: 'Mechanical Engineering',
            languages: 'French, Dutch, Portuguese, German',
            client: 'c2',
            car: false
        },
        {
            id: 'cs7',
            bm: 'bm4',
            name: 'Matthieu Longchamp',
            email: 'mlongchamo@music.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            ending_date: '2016-12-31',
            skills: 'Oracle Java 8',
            languages: 'French, Dutch, Portuguese, German',
            client: 'c2',
            car: false
        },
        {
            id: 'cs8',
            bm: 'bm4',
            name: 'Sven',
            email: 'sven@music.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            ending_date: '2016-12-31',
            skills: 'Oracle Java 8',
            languages: 'French, Dutch, Portuguese, German, Japanese',
            client: 'c2',
            car: false
        },
        {
            id: 'cs9',
            bm: 'bm4',
            name: 'Miles Davis',
            email: 'mdavis@music.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            ending_date: '2016-12-31',
            skills: 'Percussion',
            languages: 'French, Dutch, English Portuguese, German, Japanese',
            client: 'c3',
            car: false
        },
        {
            id: 'bm6',
            bm: 'bm4',
            name: 'Ahmed Lordi',
            email: 'alordin@adneom.com',
            contact: '+32 478 62 11 12',
            starting_date: '2009-01-10',
            ending_date: '2016-12-31',
            skills: 'Percussion',
            languages: 'French, Dutch, English Portuguese, German, Japanese',
            client: 'c1',
            car: false
        }
    ];
}