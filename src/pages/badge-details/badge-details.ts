import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BadgesListPage } from '../badges-list/badges-list';
import { Storage } from "@ionic/storage";
import { TraitService } from '../../services/traits.service';
import { FriendsListPage } from '../friends-list/friends-list';


@IonicPage()
@Component({
  selector: 'page-badge-details',
  templateUrl: 'badge-details.html',
})
export class BadgeDetailsPage {
	public pageFor = 'availableBadges';
	public pageMode;
	public availableBadgesObj;
	public givenBadgesObj;
	public frdInfo;
	public isAnonymous;
	public token;
	public isAddNewBadge = false;
	public availableBadgesCnt;
	
	constructor(
	public navCtrl: NavController, 
	public navParams: NavParams, 
	private storage: Storage,
	private traitService: TraitService) {
		this.frdInfo = navParams.get('frdInfo');
		this.pageFor = navParams.get('pageFor');	//availableBadges  --or--  givenBadges
		this.pageMode = navParams.get('pageMode');
		this.isAnonymous = navParams.get('isAnonymous');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad Badges');	
	}
	
	
	ionViewWillEnter() {
		this.storage.get('token').then((token) => {
			this.traitService.showLoading();
			this.token = token;
			this.getBadgeInfo(token);
		});	
	}

	getBadgeInfo(token){
	let totalBadgesEarn = 0
		if(this.pageFor == "availableBadges"){
			this.traitService.getAvailableBadges(token).subscribe(data => {
				this.traitService.hideLoading();
				this.availableBadgesObj = data.userBadgeList;				
				this.availableBadgesObj.forEach(function (obj, index) {
					totalBadgesEarn =+ obj.badgeCount
				});
				this.traitService.getAvailableBadgesCnt(token).subscribe(cntData => {
					//this.availableBadgesCnt = cntData;
					if(totalBadgesEarn > cntData){
						this.isAddNewBadge = true
						console.log(this.isAddNewBadge);
					}					
				})
			})
		}else if (this.pageFor == "givenBadges"){
			this.traitService.getGivenBadges(token).subscribe(data => {
				this.traitService.hideLoading();	
				console.log(JSON.stringify(data))
				this.givenBadgesObj = data.userBadgeList;
			})
		}
	}
	
	openBadgesMasterList(){
		this.navCtrl.push('BadgesListPage');
	}
	
	actionOnBadge(badge){
		this.traitService.showLoading();

		if(this.pageMode == 'view'){
			this.traitService.hideLoading();
			this.navCtrl.push(FriendsListPage, {
				selectFrdMode: true,
				badgeId:badge.badgeId,
				isAnonymous :  this.isAnonymous ? 1 : 0 
			});
			
		}else if(this.pageMode == 'give' && badge == 'newBadge'){	
			this.openBadgesMasterList();
		}else if(this.pageMode == 'give' && badge != 'newBadge'){
			let badgeInfo = {
				badgeId:badge.badgeId,
				badgegivenfor:this.frdInfo.id,
				isAnonymous :  this.isAnonymous ? 1 : 0 
			}
			this.traitService.giveBadgeToFriend(this.token,badgeInfo).subscribe(data => {
				this.traitService.hideLoading();	
				//if(data.response == 'success'){
					this.traitService.presentSuccessToast('Badge given to '+this.frdInfo.fullname);
					this.getBadgeInfo(this.token);
				//}
				console.log(JSON.stringify(data));
			})
		}
	}
	
	
	
	
	
	
}
