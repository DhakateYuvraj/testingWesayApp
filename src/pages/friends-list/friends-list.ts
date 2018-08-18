import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Content, LoadingController } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { ProfilePage } from '../profile/profile';
import { TraitService } from '../../services/traits.service';
import { AddUserPage } from '../add-user/add-user';
import { AuthService } from '../../services/auth.service';
import { Contacts } from '@ionic-native/contacts';
import { SocialSharing } from '@ionic-native/social-sharing';

declare var $: any;

@Component({
  selector: 'page-friends-list',
  templateUrl: 'friends-list.html',
})

export class FriendsListPage {
  @ViewChild("contentRef") contentHandle: Content;
  scrollHt: number = 0;
  topOrBottom;
  contentBox;
  tabBarHeight;
  friendList = [];
  public allContacts: any
  authToken;
public showSyncContact = false;
  public loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private traitService: TraitService, private authService: AuthService, private loadingCtrl: LoadingController, public modalCtrl: ModalController,
    private storage: Storage, private contacts: Contacts, private socialSharing: SocialSharing) {
    this.storage.get('token').then((token) => {
      this.authToken = token;
      this.getAllFriends(token);
    });
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({ spinner: 'bubbles' });
    this.loading.present();
  }

  getAllFriends(token) {
    this.presentLoadingDefault();
    this.traitService.getMyFriendList(token).subscribe(data => {
      this.friendList = data.response;
      this.loading.dismiss();
    });
  }
  openFriendProfile(frdInfo) {
    //alert(frdId);
    this.navCtrl.push(ProfilePage, {
      frdInfo: frdInfo
    });
  }

  sendFrdRequest(frdInfo) {
    var reqToSend = [{ 'friendsid': frdInfo.contactid }]
    this.presentLoadingDefault();
    this.authService.sendFrdReq(reqToSend, this.authToken).subscribe(data => {
      //console.log(data)
      //alert(JSON.stringify(data));
      this.loading.dismiss();
	  this.navCtrl.setRoot(this.navCtrl.getActive().component);
    });
  }

  acceptFrdRequest(frdInfo) {
    var reqToRec = [{ 'id': frdInfo.friendsid }]
    this.presentLoadingDefault();
    this.authService.acceptInviation(reqToRec, this.authToken).subscribe(data => {
      //alert(JSON.stringify(data));
      this.loading.dismiss();
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

  toggleMenu() {

    let addModal = this.modalCtrl.create('MenuPage');
    addModal.onDidDismiss(() => {
      return false;
    });
    addModal.present();
  }

  openProfilePage() {
    this.navCtrl.setRoot(ProfilePage);
  }

  scrollingFun(e) {
    if (e.scrollTop > this.scrollHt) {
      $(".tabbar").css("display", "none");
      if (this.topOrBottom == "top") {
        this.contentBox.marginTop = 0;
      } else if (this.topOrBottom == "bottom") {
        this.contentBox.marginBottom = 0;
      }
    } else {
      $(".tabbar").css("display", "flex");
      // document.querySelector(".tabbar")['style'].display = 'flex';
      if (this.topOrBottom == "top") {
        this.contentBox.marginTop = this.tabBarHeight;
      } else if (this.topOrBottom == "bottom") {
        this.contentBox.marginBottom = this.tabBarHeight;
      }
    }
    this.scrollHt = e.scrollTop;
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
