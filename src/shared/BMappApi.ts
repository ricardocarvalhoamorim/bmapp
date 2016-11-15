import { Injectable } from '@angular/core';

import { Platform } from 'ionic-angular';



//import { Http /*, Response*/ } from '@angular/http';

@Injectable()
export class BMappApi {

    constructor(public platform: Platform) {
    }

    user = {
        name: 'Ricardo Amorim',
        email: 'ramorim@adneom.com',
        contact: '+32 478 62 11 12',
        target: 25,
        notifications: true,
        auto_inactive: true
    };

    clients = [
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

    missions = [
        {
            id: '1112',
            clientId: '9191',
            startingDate: '2016-09-29',
            endingDate: '2016-12-30',
            name: 'New features on the mobile app',
            description: 'No description provided'
        },
        {
            id: '9910',
            clientId: '9191',
            startingDate: '2016-01-01',
            endingDate: '2017-12-30',
            name: 'New features on the mobile app',
            description: 'No description provided'
        }
    ];

    consultants = [
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
        }
    ];

    getClients() {
        return this.clients;
    }

    getMissions() {
        return this.missions;
    }

    getConsultants() {
        return this.consultants;
    }
    /** 
        constructor(public platform: Platform) {
    
            platform.ready().then(() => {
                let db = new SQLite();
                db.openDatabase({
                    name: "data.db",
                    location: "default"
                }).then(() => {
                    db.executeSql(
                        'CREATE TABLE IF NOT EXISTS consultants (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, telephone TEXT, starting_date TEXT, skills TEXT, languages TEXT)' +
                        'CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, telephone TEXT)' +
                        'CREATE TABLE IF NOT EXISTS missions (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, starting_date TEXT, ending_date TEXT)', {}).then((data) => {
                            console.log("TABLE CREATED: ", data);
                        }, (error) => {
                            console.error("Unable to execute sql", error);
                        })
                }, (error) => {
                    console.error("Unable to open database", error);
                });
            });
        }
        */

    /**
     * Attempts to save a new consultant to de database
     */
    saveConsultant(consultant) {
        this.consultants.push(consultant);
        console.log("NEW CONS" + this.consultants.length);
        return true;
    }

    /**
     * Attempts to save a new client to de database
     */
    saveClient(client) {
        this.clients.push(client);
        console.log("NEW CLIENT" + this.clients.length);
        return true;
    }

    getUser() {
        return this.user;
    }

    saveUser(user) {
        this.user = user;
    }
}