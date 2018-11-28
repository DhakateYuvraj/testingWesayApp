import { Injectable } from '@angular/core';
import { Contacts } from '@ionic-native/contacts';
import { TraitService } from '../../services/traits.service';
import { Storage } from "@ionic/storage";

@Injectable()
export class ContactsProvider {
	private authToken;
	
	constructor(private traitService: TraitService, 
		private storage: Storage, 
		private contacts: Contacts) {
		//console.log('Hello ContactsProvider Provider');
		this.storage.get('token').then((token) => {
			this.authToken = token;
		});
	}
  
	syncContacts(){
		let options = {
			filter: "",
			multiple: true,
			hasPhoneNumber: true
		};
		this.contacts.find(['displayName', 'name', 'phoneNumbers', 'emails'], options).then((res) => {
			this.traitService.addContacts(res, this.authToken).subscribe(data => {
				//this.traitService.presentSuccessToast('Contacts sync');
				return true;
				/* this.showSyncContact = false;
				this.navCtrl.setRoot(this.navCtrl.getActive().component); */
			});
		}).catch((err) => {
			//this.showSyncContact = false;
			//this.traitService.presentSuccessToast('Error in contacts sync');
			//console.log('err', err);
			return false
		});
	}

}
