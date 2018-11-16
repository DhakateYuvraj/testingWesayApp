import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController  } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { TraitService } from '../../services/traits.service';


@IonicPage()
@Component({
  selector: 'page-badge-info',
  templateUrl: 'badge-info.html',
})
export class BadgeInfoPage {

	public badgeInfo;
	public isAnonymous;
	public frdProfile = false;


	constructor(
	public navCtrl: NavController, 
	public navParams: NavParams, 
	private storage: Storage,
	private traitService: TraitService, 
	public popoverCtrl: PopoverController,
	public alertCtrl : AlertController
	) {
		this.badgeInfo = navParams.get('badgeInfo');
		this.badgeId = this.badgeInfo.badgeId ? this.badgeInfo.badgeId : 0;
		this.isAnonymous = this.traitService.isAnonymousMode() ? 1 : 0;	
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad BadgeInfoPage');
	}
	
	ionViewWillEnter() {
		this.storage.get('token').then((token) => {
			this.authToken = token;
		});
		
	}
	
	deleteBadge(badgeId){
	  let alert = this.alertCtrl.create({
		title: 'Confirm Delete',
		message: 'Do you want to delete this badge ?',
		buttons: [
		  {
			text: 'Cancel',
			role: 'cancel',
			handler: () => {
			  console.log('Cancel clicked');
			}
		  },
		  {
			text: 'Confirm',
			handler: () => {
			  deleteBadgeConfirmed(badgeId)
			}
		  }
		]
	  });
	  alert.present();
	}
	
	
	getBadgeInfo(){
		let badgeData = {
			badgeId: this.badgeId
		}
		this.traitService.getBadgeDetails(this.authToken, badgeData).subscribe(data => {
			console.log(data)
		});
	}
	
	hideUnhideBadge(badgeId,isHidden){
		let badgeData = {
			userBadgeid: badgeId,
			isHidden: isHidden ? 1: 0
		}
		this.traitService.hideUnhideBadge(this.authToken, badgeData).subscribe(data => {
			this.getBadgeInfo();			
			if(badgeData.isHidden){
				this.traitService.presentSuccessToast('Badge is hidden');
			}else{
				this.traitService.presentSuccessToast('Badge is visible');
			}
		}); 
	}
  
	deleteBadgeConfirmed(badgeId){
		let badgeData = {
			userBadgeid: badgeId
		}
		this.traitService.deleteBadge(this.authToken, badgeData).subscribe(data => {
			this.getBadgeInfo();
			this.traitService.presentSuccessToast('badge deleted');
		});  
	}

}
