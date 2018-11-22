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
	public badgeId;
	public authToken;
	public frdInfo;
	public badgeObj;
	public forPage;


	constructor(
	public navCtrl: NavController, 
	public navParams: NavParams, 
	private storage: Storage,
	private traitService: TraitService, 
	public popoverCtrl: PopoverController,
	public alertCtrl : AlertController
	) {
		this.badgeObj = navParams.get('badgeInfo');
		this.frdInfo = navParams.get('frdInfo');
		this.forPage = navParams.get('forPage');
		this.badgeId = this.badgeObj.badgeId ? this.badgeObj.badgeId : 0;
		this.isAnonymous = this.traitService.isAnonymousMode() ? 1 : 0;	
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BadgeInfoPage');
	}
	
	ionViewWillEnter() {
		this.storage.get('token').then((token) => {
			this.authToken = token;
			this.getBadgeInfo();
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
			  this.deleteBadgeConfirmed(badgeId)
			}
		  }
		]
	  });
	  alert.present();
	}
	
	
	getBadgeInfo(){
		if(this.forPage == "myBadge"){
			let badgeData = {
				badgeId: this.badgeId,
				userId: this.frdInfo.id
			}
			this.traitService.getBadgeDetails(this.authToken, badgeData).subscribe(data => {
				//let x = 
				let x = [];//data.badgeReceivedList[0];
				data.badgeReceivedList[0].badgeGivenInfoList.map(singleBadge => {
					if(singleBadge.ackText == null){
						singleBadge['isAcked'] = false;
					}else{
						singleBadge['isAcked'] = true;
					}
					x.push(singleBadge)
				})
				data.badgeReceivedList[0].badgeGivenInfoList = x;
				this.badgeInfo = data.badgeReceivedList[0];
				if(data.badgeReceivedList.length == 0){
					this.navCtrl.pop();
				}
			});
		}else if(this.forPage == "givenBadge"){
			console.log("need to develop")
		}
	}
	
	addAckText(badge){
		console.log(badge.userBadgeid,badge.ackText);
		//acknowledgeBadge
		let badgeData = {
			userBadgeid: badge.userBadgeid,
			text: badge.ackText
			
		}
		this.traitService.acknowledgeBadge(this.authToken, badgeData).subscribe(data => {
			this.getBadgeInfo();
			this.traitService.presentSuccessToast('Acknowledgement send');
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
