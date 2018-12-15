import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Content, LoadingController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { ProfilePage } from '../profile/profile';
import { AddUserPage } from '../add-user/add-user';
import { Contacts } from '@ionic-native/contacts';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AuthService } from '../../services/auth.service';
import { TraitService } from '../../services/traits.service';

@Component({
	selector: 'page-friends-list',
	templateUrl: 'friends-list.html',
})

export class FriendsListPage {
	@ViewChild("contentRef") contentHandle: Content;
	public scrollHt: number = 0;
	public topOrBottom;
	public contentBox;
	public tabBarHeight;
	public friendList = [];
	public allContacts: any
	public authToken;
	public showSyncContact = false;
	public selectFrd = false;
	public badgeId;
	public isAnonymous;
	public token;
	public loading;
	public searchedUsers;
	public searchUserTxt;
	private isContactSynced = true;
	constructor(
	public navCtrl: NavController, 
	public navParams: NavParams, 
	private traitService: TraitService, 
	private authService: AuthService, 
	public modalCtrl: ModalController,
	private storage: Storage, 
	private contacts: Contacts, 
	private loadingCtrl: LoadingController, 
	private socialSharing: SocialSharing
	){
		this.selectFrd = navParams.get('selectFrdMode') ? true : false;
		this.badgeId = navParams.get('badgeId');
		this.isAnonymous = navParams.get('isAnonymous');
		
		this.storage.get('token').then((token) => {
			this.authToken = token;
			this.getAllFriends(this.authToken);
			this.loadGenericSetting()
			this.token = token;
		});
		this.presentLoadingDefault();
	}
	
	doRefresh(refresher){
		this.traitService.getMyFriendList(this.authToken).subscribe(data => {
			this.friendList = data.response;
			refresher.complete();
		});		
	}
	
	loadGenericSetting(){
		this.traitService.loadGenericSetting(this.authToken).subscribe(data => {
			if(data.response){
				if(!data.response.isContactSynced){
					this.isContactSynced = true;
				}else{
					this.isContactSynced = false;
				}
			}else{
				this.isContactSynced = false;
			}
		});
	}
	
	presentLoadingDefault() {
		this.loading = this.loadingCtrl.create({ spinner: 'bubbles' });
	}

	showLoading(){
		this.presentLoadingDefault();
		//if(!this.loading){
			this.presentLoadingDefault();
			this.loading.present();
		//}
	}
	hideLoading(){
		//if(this.loading){
			this.loading.dismiss();
		//}
	}

	getAllFriends(token) {
		this.showLoading();
		this.traitService.getMyFriendList(this.authToken).subscribe(data => {
			this.friendList = data.response;
			this.hideLoading();
		});
	}
	
	searchNewUser(){
		if(this.searchUserTxt){
			this.showLoading();
			let usrObj = {"fullname":this.searchUserTxt};
			this.traitService.searchUser(this.authToken,usrObj).subscribe(data => {
				this.searchedUsers = data.response;			
				if(!this.searchedUsers || this.searchedUsers.length < 1){
					this.traitService.presentSuccessToast('No record found');				
				}
				setTimeout(() => {
					this.hideLoading();
				}, 1000);
			});
		}else{			
			this.traitService.presentSuccessToast('Enter the username');	
		}
	}


	openFriendProfile(frdInfo) {
		if(this.selectFrd){
			this.showLoading();
			let badgeInfo = {
				badgeid:[this.badgeId],
				badgegivenfor:frdInfo.id,
				isAnonymous :  this.isAnonymous ? 1 : 0 ,
				badgeVisibility : 1
			}
			this.traitService.giveBadgeToFriend(this.token,badgeInfo).subscribe(data => {
				this.hideLoading();
				//this.navCtrl.pop();
				this.traitService.presentSuccessToast('Badge given to '+frdInfo.fullname);				
				this.navCtrl.push(ProfilePage, {
					frdInfo: frdInfo,
					tabOpen: 'badges'
				});
			})
		}else{
			this.navCtrl.push(ProfilePage, {
				frdInfo: frdInfo,
				tabOpen: 'trait'
			});
		}
	}

	sendFrdRequest(frdInfo) {
		this.showLoading();
		var reqToSend = [{ 'friendsid': frdInfo.contactid }]
		this.authService.sendFrdReq(reqToSend, this.authToken).subscribe(data => {
			this.hideLoading();
			this.navCtrl.setRoot(this.navCtrl.getActive().component);
		});
	}

	acceptFrdRequest(frdInfo) {
		this.showLoading();
		var reqToRec = [{ 'id': frdInfo.friendsid }]
		this.authService.acceptInviation(reqToRec, this.authToken).subscribe(data => {
			this.hideLoading();
			if (data.status == "success") {
				this.storage.get('token').then((token) => {
					this.authToken = token;
					this.getAllFriends(token);
				});
			}
			this.navCtrl.setRoot(this.navCtrl.getActive().component);
		});
	}

  syncContacts(){
  this.showSyncContact = true;
	var options = {
      filter: "",
      multiple: true,
      hasPhoneNumber: true
    };
    this.contacts.find(['displayName', 'name', 'phoneNumbers', 'emails'], options).then((res) => {
		this.traitService.addContacts(res, this.authToken).subscribe(data => {
		// alert('sync complete');
		this.showSyncContact = false;
		this.navCtrl.setRoot(this.navCtrl.getActive().component);
      });
    }).catch((err) => {
		this.showSyncContact = false;
		// alert(JSON.stringify(err));
		console.log('err', err);
    });  
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsListPage');
  }

  openProfilePage() {
    this.navCtrl.setRoot(ProfilePage);
  }


  addNewUser() {
    this.navCtrl.push(AddUserPage);
  }
	
	inviteFriend(){
		this.socialSharing.shareWithOptions(
			{ message: "Hi there, I am inviting you to join WeSay - A fun app about our social perception. Click here to join - https://www.wesay.app/contact-us/"} 
		)
		.then((result) =>
		{
			alert(JSON.stringify(result.app));
		})
		.catch((err) =>
		{
			alert(JSON.stringify(err));
		});
	}

}
