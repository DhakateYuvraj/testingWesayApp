import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { TraitService } from '../../services/traits.service';
import { Storage } from "@ionic/storage"; 

@Injectable()
export class FcmProvider {
	public token;

	constructor(
		public firebaseNative: Firebase,
		private traitService: TraitService,
		private storage: Storage,
		private platform: Platform
	){
		this.storage.get('token').then((token) => {
			this.token = token;
		})
	};

	getToken() {
		let token;
		token =  this.firebaseNative.getToken()
		.then(token => {/* this.fcmTokenSend(token); */ alert(`The token is-- ${token}`); return token;}) // save the token server-side and use it to push notifications to this device
		.catch(error => alert('Error getting token'+ error));
		return(token)
	}

	fcmTokenSend(fcmDeviceId){
		let fcmTokenInfo = { "deviceregistrationid": fcmDeviceId}
		this.traitService.fcmTokenSend(this.token,fcmTokenInfo).subscribe(data => {
		//alert('from fcm');
		//alert(JSON.stringify(data));
		})
	}
	
subscribeToPushNotifications() {
    this.firebaseNative.onNotificationOpen().subscribe((response) => {
	alert(JSON.stringify(response));
      if(response.tap){
        alert('bg');
      }else{
        alert('fg');
      }
    });
  }
}
