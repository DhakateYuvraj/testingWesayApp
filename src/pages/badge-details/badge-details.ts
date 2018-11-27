import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController  } from 'ionic-angular';
import { BadgesListPage } from '../badges-list/badges-list';
import { Storage } from "@ionic/storage";
import { TraitService } from '../../services/traits.service';
import { FriendsListPage } from '../friends-list/friends-list';
import { BadgeProvider } from '../../providers/badge/badge';

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
	public selectedBadges = [];
	
	constructor(
	public navCtrl: NavController, 
	public navParams: NavParams, 
	private storage: Storage,
	private traitService: TraitService,
	public actionSheetCtrl: ActionSheetController,
	public badgeProvider: BadgeProvider) {
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
	let cntData = this.badgeProvider.getAvailableBadgesCnt();
		if(this.pageFor == "availableBadges"){
			this.traitService.getAvailableBadges(token).subscribe(data => {
				this.traitService.hideLoading();
				this.badgeProvider.setAvailableBadges(data.userBadgeList);
				this.availableBadgesObj = this.badgeProvider.getAvailableBadges();
				this.availableBadgesObj.forEach(function (obj, index) {
					totalBadgesEarn = totalBadgesEarn + obj.badgeCount
				});
				if(totalBadgesEarn > cntData){
					this.isAddNewBadge = true
					console.log(this.isAddNewBadge);
				}
				this.badgeProvider.setBadgesEmptySlots(totalBadgesEarn - cntData)
				
				/* this.traitService.getAvailableBadgesCnt(token).subscribe(cntData => {
					//this.availableBadgesCnt = cntData;
					if(totalBadgesEarn > cntData){
						this.isAddNewBadge = true
						console.log(this.isAddNewBadge);
					}
					this.badgeProvider.setBadgesEmptySlots(totalBadgesEarn - cntData)
				}) */
			})
		}else if (this.pageFor == "givenBadges"){
			this.traitService.getGivenBadges(token).subscribe(data => {
				this.traitService.hideLoading();	
				//console.log(JSON.stringify(data))
				this.givenBadgesObj = data.userBadgeList;
			})
		}
	}
	
	openBadgesMasterList(badge){
		this.navCtrl.push('BadgesListPage');
	}
	
	actionOnBadge(badge){
		//this.traitService.showLoading();

		if(this.pageMode == 'view' && badge == 'newBadge'){
			this.openBadgesMasterList(badge);
		} else if(this.pageMode == 'view' && badge != 'newBadge'){
			this.presentActionSheet(badge);
		} else if(this.pageMode == 'give' && badge == 'newBadge'){	
			this.openBadgesMasterList(badge);
		} else if(this.pageMode == 'give' && badge != 'newBadge'){
			if(this.selectedBadges.indexOf(badge.badgeId) > -1){
				this.selectedBadges.splice(this.selectedBadges.indexOf(badge.badgeId),1);
			}else{
				this.selectedBadges.push(badge.badgeId);
			}
			console.log(this.selectedBadges);
		}
	}
	
	giveBadge(){
		if(this.selectedBadges.length > 0){
			this.traitService.showLoading();
			let badgeInfo = {
				badgeid:this.selectedBadges,
				badgegivenfor:this.frdInfo.id,
				isAnonymous :  this.isAnonymous ? 1 : 0,
				badgeVisibility : 1
			}
			this.traitService.giveBadgeToFriend(this.token,badgeInfo).subscribe(data => {
				this.traitService.hideLoading();
				this.traitService.presentSuccessToast('Badge given to '+this.frdInfo.fullname);
				//this.getBadgeInfo(this.token);
				this.navCtrl.pop();
			})
		}
	}
	
	giveBadgeToFriend(badge){
		this.navCtrl.push(FriendsListPage, {
		selectFrdMode: true,
		badgeId:badge.badgeId,
		isAnonymous :  this.isAnonymous ? 1 : 0 
		});
	}
	openGivenBadgeInfo(gvnBadge){		
		this.navCtrl.push('BadgeInfoPage', {
			badgeInfo: gvnBadge,
			frdInfo : this.frdInfo,
			forPage : 'givenBadge'
		});
	}
	 presentActionSheet(badge) {
   let actionSheet = this.actionSheetCtrl.create({
     title: 'Select Action',
     buttons: [
       {
         text: 'Give a badge',
         role: '',
         handler: () => {
           this.giveBadgeToFriend(badge)
         }
       },
       {
         text: 'Swap a badge',
         handler: () => {
           this.openBadgesMasterList(badge);
         }
       },
       {
         text: 'Cancel',
         role: 'cancel',
         handler: () => {
           console.log('Cancel clicked');
         }
       }
     ]
   });
   actionSheet.present();
 }
	
	
}
