import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Content, LoadingController } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { ProfilePage } from '../profile/profile';
import { TraitService } from '../../services/traits.service';
import { AddUserPage } from '../add-user/add-user';
import { AuthService } from '../../services/auth.service';

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

  public loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private traitService: TraitService, private authService: AuthService, private loadingCtrl: LoadingController, public modalCtrl: ModalController,
    private storage: Storage) {
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
      console.log(data)
      alert(JSON.stringify(data));
      this.loading.dismiss();
	  this.navCtrl.setRoot(this.navCtrl.getActive().component);
    });
  }

  acceptFrdRequest(frdInfo) {
    var reqToRec = [{ 'id': frdInfo.id }]
    this.presentLoadingDefault();
    this.authService.acceptInviation(reqToRec, this.authToken).subscribe(data => {
      alert(JSON.stringify(data));
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

}
