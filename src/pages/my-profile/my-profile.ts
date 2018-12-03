import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { TraitService } from '../../services/traits.service';

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {
	public authToken;
	public frdId = 0;
	
	constructor(	
		public storage: Storage, 
		public navCtrl: NavController, 
		public traitService: TraitService, 
		public navParams: NavParams) {
			
	}


	ionViewWillEnter() {
		this.storage.get('token').then((token) => {
		//this.traitService.showLoading();
		this.authToken = token;
		//this.getLoginUserTraits(token);
		//this.getMasterTraitList();
		this.getProfileData(this.frdId);
		});		
	}
	
	ionViewDidLoad() {
		console.log('ionViewDidLoad MyProfilePage');
	}
	
	getProfileData(friendId){
		this.traitService.showLoading();
		this.traitService.getProfileData(this.authToken, {"userid":friendId}).subscribe(data => {
			console.log(data);
			//this.traitService.hideLoading();
		});
	}
  
}
