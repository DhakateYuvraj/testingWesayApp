import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
//import { AngularFirestore } from 'angularfire2/firestore';


@Injectable()
export class FcmProvider {

	constructor(
		public firebaseNative: Firebase,
		//public afs: AngularFirestore,
		private platform: Platform
	) {

	};

	getToken() {
		let token;
		token =  this.firebaseNative.getToken()
		.then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
		.catch(error => console.error('Error getting token', error));
		return(token)
	}


  }
