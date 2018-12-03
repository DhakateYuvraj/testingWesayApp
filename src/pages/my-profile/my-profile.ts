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
	public profileData ={
		"location":null,
		"profession":null,
		"workAtStudiesIn":null,
		"aboutMe":null,
		"mywebsite":null,
		"gender":null
	};
	public frdId = 0;
	
	constructor(	
		public storage: Storage, 
		public navCtrl: NavController, 
		public traitService: TraitService, 
		public navParams: NavParams) {
		this.frdId = navParams.get('frdId') ? navParams.get('frdId') : 0;
	}


	ionViewWillEnter() {
		this.storage.get('token').then((token) => {
			this.authToken = token;
			this.getProfileData(this.frdId);
		});		
	}
	
	ionViewDidLoad() {
		console.log('ionViewDidLoad MyProfilePage');
	}
	
	getProfileData(friendId){
		this.traitService.showLoading();
		this.traitService.getProfileData(this.authToken, {"userid":friendId}).subscribe(data => {
			this.profileData = data
			this.traitService.hideLoading();
		});
	}
	
	updateMyProfile(){
		let profileData = {
			"location":this.profileData.location,
			"profession":this.profileData.profession,
			"workAtStudiesIn":this.profileData.workAtStudiesIn,
			"aboutMe":this.profileData.aboutMe,
			"mywebsite":this.profileData.mywebsite,
			"gender":this.profileData.gender
		}
		this.traitService.showLoading();
		this.traitService.updateMyProfile(this.authToken, profileData).subscribe(data => {
			this.traitService.hideLoading();
		});
	}
	
	back(){
		this.navCtrl.pop();
	}
  
}
