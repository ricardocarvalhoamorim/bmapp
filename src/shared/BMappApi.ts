import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';

import * as _ from 'lodash';

@Injectable()
export class BMappApi {

    public storage: Storage;
    baseAddress = "http://192.168.4.82:8080/";

    constructor(
        public platform: Platform,
        storage: Storage,
        public http: Http,
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
            this.storage.set('consultants', this.dummy_consultants);
        });

        this.storage.get('clients').then((data) => {
            if (data != null)
                return;
            this.storage.set('clients', this.dummy_clients);
        });

        this.storage.get('bms').then((data) => {
            if (data != null)
                return;
            this.storage.set('bms', this.dummy_bms);
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

            consultant.initials = consultant.name.match(/\b(\w)/g).join('');
            var index = _.indexOf(val, _.find(val, { id: consultant.id }));

            if (index === -1) {
                console.log(consultant);
                val.push(consultant);
            } else {
                console.log(consultant);
                val.splice(index, 1, consultant);
            }

            this.storage.set('consultants', val);
            this.events.publish('consultant:new', consultant);
        });
    }

    /**
     * Removes a consultant
     */
    deleteConsultant(consultant) {
        this.getConsultants().then((val) => {
            if (val === null) {
                console.log("Tried to delete a consultant from an empty set");
                return;
            }
            var index = _.indexOf(val, _.find(val, { id: consultant.id }));

            if (index === -1) {
                console.log("Consultant does not exist:" + consultant.name);
                return;
            } else {
                console.log(consultant);
                val.splice(index, 1);
            }

            this.storage.set('consultants', val);
            this.events.publish('consultants:deleted', consultant);
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
                val.push(businessManager);
            } else {
                //update an existing one
                val.splice(index, 1, businessManager);
            }
            this.storage.set('bms', val);
            this.events.publish('bm:new', businessManager);
        });
    }

    /**
     * Populates the database with dummy data for demo purposes
     */
    loadDummyData() {
        this.storage.set('bms', this.dummy_bms);
        this.storage.set('consultants', this.dummy_consultants);
        this.storage.set('clients', this.dummy_clients);
    }

    /**
     * Clears the database and repopulates it with basic elements
     */
    reset() {
        this.storage.clear();
        this.dbCheckup();
    }

    dummy_bms = [
        {
            id: 'bm1',
            name: 'Anissa Lalaoui',
            initials: 'ALA',
            email: 'alalaoui@adneom.com',
            contact: '+32',
            target: 15,
            isUnitManager: false,
            active: false
        },
        {
            id: 'bm2',
            name: 'Daniel Wijnans',
            initials: 'DW',
            email: 'dwijnans@adneom.com',
            contact: '+32 491 90 69 40',
            target: 10,
            isUnitManager: false,
            active: false
        },
        {
            id: 'bm3',
            name: 'Tristan Dumont',
            initials: 'TD',
            email: 'tdumont@adneom.com',
            contact: '+32 476 416 607',
            target: 10,
            isUnitManager: true,
            active: true
        },
        {
            id: 'bm4',
            name: 'John Doe',
            initials: 'JD',
            email: 'jdoe@adneom.com',
            contact: '+32 476 416 607',
            target: 4,
            isUnitManager: false,
            active: false
        }
    ];

    dummy_clients = [
        //alalaoui
        {
            id: 'c1',
            bm: 'bm1',
            name: 'ADNEOM Lab',
            address: '112-116 Chaussée de Charleroi',
            contact: '+32 2 645 08 00',
            email: ''
        },
        {
            id: 'c2',
            bm: 'bm1',
            name: 'BNB',
            address: 'Boulevard de Berlaimont 3, 1000 Bruxelles',
            contact: '',
            email: ''
        },
        {
            id: 'c3',
            bm: 'bm1',
            name: 'Telenet',
            address: 'Leuvensestraat 30, 1800 Vilvoorde',
            contact: '+32 15 66 66 66',
            email: ''
        },
        {
            id: 'c4',
            bm: 'bm1',
            name: 'BePostBank',
            address: 'Chaussée d\'Ixelles 27, 1050 Ixelles',
            contact: '+32 201 23 45',
            email: ''
        },
        {
            id: 'c5',
            bm: 'bm1',
            name: 'Urbantz',
            address: '120 Avenue Louise, 1000 Brussels',
            contact: '+33 176 31 03 69',
            email: 'info@urbantz.com'
        },
        //dwijnans
        {
            id: 'c6',
            bm: 'bm2',
            name: 'Macq',
            address: 'Rue de l’Aéronef, 21140 Brussels',
            contact: '+32 610 15 00',
            email: 'contact@macq.eu'
        },
        {
            id: 'c7',
            bm: 'bm2',
            name: 'Destiny',
            address: 'Excelsiorlaan 89 1930 Zaventem',
            contact: '+32 240 197 00',
            email: 'info@destiny.be'
        },
        {
            id: 'c8',
            bm: 'bm2',
            name: 'n-allo',
            address: 'Avenue Ariane 7, 1200 Woluwe-Saint-Lambert',
            contact: '+32 300 15 40',
            email: 'info@n-allo.be'
        },
        //tdchassart
        {
            id: 'c9',
            bm: 'bm3',
            name: 'BICS',
            address: 'Rue Lebeau 4, 1000 Bruxelles',
            contact: '+32 547 52 10',
            email: 'bics-com@bics.com'
        },
        {
            id: 'c10',
            bm: 'bm3',
            name: 'Multipharma',
            address: 'Rue du Bailli 65, 1050 Ixelles',
            contact: '+32 537 03 84',
            email: ''
        },
        {
            id: 'c11',
            bm: 'bm3',
            name: 'Proximus',
            address: 'Avenue de la Toison D\'Or, 42, 1060 Brussels',
            contact: '0800 22 800',
            email: 'info@proximus.be'
        }
    ];
            
    dummy_consultants = [
        {
            id: 'cs1',
            bm: 'bm1',
            clientID: 'c2',
            client: 'BNB',
            name: 'Mehdi Abdennadher',
            initials: 'MA',
            email: 'mabdennadher@adneom.com',
            contact: '+32',
            starting_date: '2016-07-04',
            ending_date: '2016-07-11',
            skills: 'Tester',
            languages: 'French',
            package: 200,
            selling_price: 400,
            country: "Belgium",
            hr: "Natalia de Wilde D'Estmael",
            car: true,
            internal: true
        },
        {
            id: 'cs2',
            bm: 'bm1',
            clientID: 'c5',
            client: 'Urbatnz',
            name: 'Gael Genet',
            initials: 'GG',
            email: 'ggenet@adneom.com',
            contact: '+32',
            starting_date: '2016-07-01',
            ending_date: '2016-07-15',
            skills: 'AngularJs, Web',
            package: 300,
            selling_price: 400,
            country: "Belgium",
            hr: "Natalia de Wilde D'Estmael",
            languages: 'French, Dutch, English',
            car: true,
            internal: true
        },
        {
            id: 'cs3',
            bm: 'bm1',
            clientID: 'c4',
            client: 'BePostBank',
            name: 'Vincent D\'hondt',
            initials: 'VD',
            email: 'vdhondt@adneom.com',
            contact: '+32',
            starting_date: '2016-07-01',
            ending_date: '2016-11-31',
            package: 500,
            selling_price: 400,
            country: "Belgium",
            hr: "Natalia de Wilde D'Estmael",
            skills: 'Systems Engineering',
            languages: 'French, Dutch, English',
            car: true,
            internal: true
        },

        //dwijnans
        {
            id: 'cs4',
            bm: 'bm2',
            clientID: 'c2',
            client: 'BNB',
            name: 'Thomas Vandervennet',
            initials: 'tv',
            email: 'tvandervennet@adneom.com',
            contact: '+32',
            starting_date: '2016-11-14',
            ending_date: '2016-12-31',
            package: 400,
            selling_price: 400,
            country: "Belgium",
            hr: "Natalia de Wilde D'Estmael",
            skills: 'UX/UI Designer',
            languages: 'French, Dutch, English',
            car: false,
            internal: true
        },
        {
            id: 'cs5',
            bm: 'bm2',
            clientID: '-1',
            client: 'No client',
            name: 'Manuel Coradi',
            initials: 'JSB',
            email: 'mcoradi@adneom.com',
            contact: '+32 123 44 55',
            starting_date: '2016-01-10',
            ending_date: '2016-11-31',
            package: 239.90,
            selling_price: 700,
            country: "Belgium",
            hr: "Natalia de Wilde D'Estmael",
            skills: 'PLC',
            languages: 'French, Dutch, Spanish, English',
            car: false,
            internal: true
        },
        {
            id: 'cs6',
            bm: 'bm2',
            clientID: '-1',
            client: 'No client',
            name: 'Fabien Jahn',
            initials: 'FJ',
            email: 'fjahn@adneom.com',
            contact: '+32 123 44 55',
            starting_date: '2016-01-10',
            ending_date: '2016-11-31',
            package: 300,
            selling_price: 490,
            country: "Belgium",
            hr: "Natalia de Wilde D'Estmael",
            skills: 'Project Manager',
            languages: 'French, English',
            car: false,
            internal: true
        },
        //tdchassart
        {
            id: 'cs7',
            bm: 'bm3',
            clientID: '-1',
            client: 'No client',
            name: 'Ricardo Amorim',
            initials: 'RA',
            email: 'ramorim@adneom.com',
            contact: '+32 478 62 11 12',
            starting_date: '2016-10-25',
            ending_date: 'Undefined',
            package: 600,
            selling_price: 620,
            country: "Belgium",
            hr: "Natalia de Wilde D'Estmael",
            skills: 'Android, IONIC 2, Java',
            languages: 'French, English, Spanish, Portuguese',
            car: true,
            internal: true
        },
        {
            id: 'cs8',
            bm: 'bm3',
            clientID: '-1',
            client: 'No client',
            name: 'Alessandre Brasseur',
            initials: 'AB',
            email: 'abrasseur@adneom.com',
            contact: '+32 478 62 11 12',
            starting_date: '2016-08-01',
            ending_date: 'Undefined',
            package: 781,
            selling_price: 1090,
            country: "Belgium",
            hr: "Natalia de Wilde D'Estmael",
            skills: 'Xamarin, dotNet',
            languages: 'French, English, Dutch',
            car: true,
            internal: true
        },
        {
            id: 'cs9',
            bm: 'bm3',
            clientID: 'c9',
            client: 'BICS',
            name: 'Fabien Meghazi',
            initials: 'FM',
            email: 'fmeghazi@adneom.com',
            contact: '+32 111 22 33',
            starting_date: '2016-08-01',
            ending_date: 'Undefined',
            package: 1200,
            selling_price: 1400,
            country: "Belgium",
            hr: "Natalia de Wilde D'Estmael",
            skills: 'Python',
            languages: 'French, English, Dutch',
            car: false,
            internal: true
        },
        {
            id: 'cs10',
            bm: 'bm3',
            clientID: 'c10',
            client: 'Multipharma',
            name: 'Christophe Gallot',
            initials: 'CG',
            email: 'cgallot@adneom.com',
            contact: '+32 111 22 33',
            starting_date: '2016-08-01',
            ending_date: 'Undefined',
            package: 500,
            selling_price: 900,
            country: "Belgium",
            hr: "Natalia de Wilde D'Estmael",
            skills: 'Senior Java Swing',
            languages: 'French, English, Dutch',
            car: true,
            internal: true
        },
        {
            id: 'cs11',
            bm: 'bm3',
            clientID: 'c11',
            client: 'Proximus',
            name: 'Adrian Crucianu',
            initials: 'AC',
            email: 'acrucianu@adneom.com',
            contact: '+32 111 22 33',
            starting_date: '2016-08-01',
            ending_date: 'Undefined',
            package: 2900,
            skills: 'VoLTE Expert',
            languages: 'French, English, Dutch',
            car: true,
            internal: false
        },
        {
            id: 'cs12',
            bm: 'bm3',
            clientID: 'c4',
            client: 'BePostBank',
            name: 'Timothy Walton',
            initials: 'TW',
            email: 'twalton@adneom.com',
            contact: '+32 111 22 33',
            starting_date: '2016-08-01',
            ending_date: 'Undefined',
            package: 200,
            selling_price: 400,
            country: "Belgium",
            hr: "Natalia de Wilde D'Estmael",
            skills: 'Test Engineering',
            languages: 'French, English, Dutch',
            car: true,
            internal: false
        }
    ];
}