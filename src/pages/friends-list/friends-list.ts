import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Content } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { ProfilePage } from '../profile/profile';
import { AddUserPage } from '../add-user/add-user';
import { Contacts } from '@ionic-native/contacts';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AuthService } from '../../services/auth.service';
import { TraitService } from '../../services/traits.service';

declare var $: any;

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
	
	constructor(
	public navCtrl: NavController, 
	public navParams: NavParams, 
	private traitService: TraitService, 
	private authService: AuthService, 
	public modalCtrl: ModalController,
	private storage: Storage, 
	private contacts: Contacts, 
	private socialSharing: SocialSharing
	){
		this.selectFrd = navParams.get('selectFrdMode') ? true : false;
		this.badgeId = navParams.get('badgeId');
		this.isAnonymous = navParams.get('isAnonymous');
		
		this.storage.get('token').then((token) => {
			this.authToken = token;
			this.getAllFriends(token);
			this.token = token;
		});
	}

	getAllFriends(token) {
		this.traitService.showLoading();
		this.traitService.getMyFriendList(token).subscribe(data => {
			this.friendList = data.response;
			this.traitService.hideLoading();
		});
	}
	
	openFriendProfile(frdInfo) {
		if(this.selectFrd){
			this.traitService.showLoading();
			let badgeInfo = {
				badgeId:this.badgeId,
				badgegivenfor:frdInfo.id,
				isAnonymous :  this.isAnonymous ? 1 : 0 
			}
			this.traitService.giveBadgeToFriend(this.token,badgeInfo).subscribe(data => {
				this.traitService.hideLoading();
				this.navCtrl.pop();
				this.traitService.presentSuccessToast('Badge given to '+this.frdInfo.fullname);
			})
		}else{
			this.navCtrl.push(ProfilePage, {
				frdInfo: frdInfo
			});
		}
	}

	sendFrdRequest(frdInfo) {
		this.traitService.showLoading();
		var reqToSend = [{ 'friendsid': frdInfo.contactid }]
		this.authService.sendFrdReq(reqToSend, this.authToken).subscribe(data => {
			this.traitService.hideLoading();
			this.navCtrl.setRoot(this.navCtrl.getActive().component);
		});
	}

	acceptFrdRequest(frdInfo) {
		this.traitService.showLoading();
		var reqToRec = [{ 'id': frdInfo.friendsid }]
		this.authService.acceptInviation(reqToRec, this.authToken).subscribe(data => {
			this.traitService.hideLoading();
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
		alert('sync complete');
		this.showSyncContact = false;
		this.navCtrl.setRoot(this.navCtrl.getActive().component);
      });
    }).catch((err) => {
		this.showSyncContact = false;
		alert(JSON.stringify(err));
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
	doRefresh(refresher) {
	console.log('Begin async operation', refresher);

	setTimeout(() => {
	console.log('Async operation has ended');
	refresher.complete();
	}, 2000);
	}
	
	inviteFriend(){
		this.socialSharing.shareWithOptions(
			{ message: "Hey there, \n \n I downloaded Wesay and found it is a cool app to understand what is the perception of me in society. \n \n Its useful, fun and secure and it lets me know what everybody says about me. I think it will be fun if you join it too and see what's the perception of all our friends.  Feedback can be given anonymously as well as publicly so we get to hear real feedback on people's perception of US.\n \n Remember it is only about our perception and  not  necessarily the reality.  But it's important that we know is it because it plays a big role in our interactions with society.\n \n Download the app at:- \n",
			url: "http://wesay.app/dl"} 
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
