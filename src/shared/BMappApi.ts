import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

import { Storage } from '@ionic/storage';
//import { Http /*, Response*/ } from '@angular/http';

@Injectable()
export class BMappApi {

    public storage: Storage;

    user: any;
    consultants: any[];
    clients: any[];

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
     * Attempts to save a new consultant to de database
     */
    saveConsultant(consultant) {
        this.getConsultants().then((val) => {
            if (val === null) {
                val = [];
            }
            val.push(consultant);
            this.consultants = val;
            this.storage.set('consultants', this.consultants);
            this.events.publish('consultant:new', consultant);
        });
    }

    /**
     * Attempts to save a new client to de database
     */
    saveClient(client) {
        this.getConsultants().then((val) => {
            if (val === null) {
                val = [];
            }
            val.push(client);
            this.clients = val;
            this.storage.set('clients', this.clients);
            this.events.publish('client:new', client);
        });
    }

    getUser() {
        return this.storage.get('user');
    }

    saveUser(user) {
        this.storage.set('user', user);
    }

    loadDummyData() {
        this.storage.set('user', this.dummy_user);
        this.storage.set('consultants', this.dummy_consultants);
        this.storage.set('clients', this.dummy_clients);
    }

    reset() {
        this.storage.clear();
    }


    dummy_user = {
        name: 'George Frideric Handel',
        email: 'gfhandel@adneom.com',
        contact: '+32 148 99 98',
        target: 12,
        notifications: true,
        auto_inactive: true
    };

    dummy_bms = [
        {
            name: 'Ricardo Amorim',
            email: 'ramorim@adneom.com',
            contact: '+32 478 62 11 12',
            target: 25,
            notifications: true,
            auto_inactive: true
        },
        {
            name: 'Susan Boyle',
            email: 'sboyle@adneom.com',
            contact: '+32 478 62 11 12',
            target: 10,
            notifications: true,
            auto_inactive: true
        },
        {
            name: 'Jack Sparrow',
            email: 'jsparrow@adneom.com',
            contact: '+32 478 62 11 12',
            target: 15,
            notifications: true,
            auto_inactive: true
        }
    ];

    dummy_clients = [
        {
            id: '9191',
            name: 'ADNEOM Lab',
            address: 'Rue Knappen 92',
            contact: '+32 123 45 67',
            email: 'general@adneom.com'
        },
        {
            id: '877120',
            name: 'Don Giovanni',
            address: 'Palais des beaux arts',
            contact: '+32 123 45 67',
            email: 'giovanni@adneom.com'
        },
        {
            id: '0012314',
            name: 'Proximus',
            address: 'Rue de la Loi',
            contact: '+32 123 45 67',
            email: 'general@proximus.com'
        }
    ];

    dummy_consultants = [
        {
            id: '919182',
            name: 'Franz Lizst',
            email: 'flizst@dolph.com',
            contact: '+32 444 11 11',
            starting_date: '2009-08-11',
            department: 'Development',
            skills: 'Java, Java EE',
            client: 'deloitte',
            languages: 'Portuguese, Spanish',
            car: true
        },
        {
            id: '9112',
            name: 'Antonín Dvořák',
            email: 'advorak@dolph.com',
            contact: '+32 991 11 11',
            starting_date: '2009-01-29',
            department: 'Development',
            skills: 'AngularJs',
            languages: 'French, Dutch, German',
            client: 'FreeeDrive',
            car: true
        },
        {
            id: '19200',
            name: 'Gustav Mahler',
            email: 'gmahler@symphony.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            department: 'Development',
            skills: 'Python, SQL Server, Android, Ruby on Rails',
            languages: 'French, Dutch, Portuguese, German',
            client: 'ZipCar',
            car: false
        },
        {
            id: '88272',
            name: 'Antonio Vivaldi',
            email: 'avivaldi@music.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            department: 'Engineering',
            skills: 'Civil Engineering, Fracture Mechanics, Load balancing',
            languages: 'French, Dutch, Portuguese, German',
            client: 'Telenet',
            car: false
        },
        {
            id: '66251',
            name: 'Johann Sebastian Bach',
            email: 'jbach@music.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            department: 'Engineering',
            skills: 'Mechanical Engineering',
            languages: 'French, Dutch, Portuguese, German',
            client: 'FreeeDrive',
            car: false
        },
        {
            id: '11121',
            name: 'Wolfgang Amadeus Mozart',
            email: 'wmozart@music.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            department: 'IT Support',
            skills: 'Server Maintenance, Linux servers, Microsoft SQL server',
            languages: 'French, Dutch, Portuguese, German',
            client: 'FreeeDrive',
            car: false
        },
        {
            id: '11121',
            name: 'Wolfgang Amadeus Mozart',
            email: 'wmozart@music.com',
            contact: '+32 001 12 22',
            starting_date: '2009-01-10',
            department: 'IT Support',
            skills: 'Server Maintenance, Linux servers, Microsoft SQL server',
            languages: 'French, Dutch, Portuguese, German',
            client: 'Not defined',
            car: false
        }
    ];
}