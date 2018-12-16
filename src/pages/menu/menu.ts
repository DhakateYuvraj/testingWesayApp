import { Component, ViewChild } from '@angular/core';
import { Nav, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthService } from '../../services/auth.service';
import { MyProfilePage } from '../my-profile/my-profile';
import { FeedbackPage } from '../feedback/feedback';
import { SettingsPage } from '../settings/settings';
import { FriendsListPage } from '../friends-list/friends-list';
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
	selector: 'page-menu',
	templateUrl: 'menu.html',
})
export class MenuPage {  
	@ViewChild(Nav) nav: Nav;
	constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private authService: AuthService) {
	 //this.tab = this.navCtrl.parent;
	console.log(this.navCtrl.parent);
	}

	ionViewDidLoad() {  
		console.log('ionViewDidLoad MenuPage');
	}

	close(){
		this.viewCtrl.dismiss().catch(() => {});  
	}

	openMyProfile(){
		this.navCtrl.push('MyProfilePage');
	}
	
	openSettingPage(){
		//this.navCtrl.push('SettingsPage');
		this.nav.setRoot('SettingPage');
	}
	
	openFeedback(){
		this.navCtrl.push('FeedbackPage');
	}
	
	openFriendList(){
		this.navCtrl.setRoot('FriendsListPage');
	}
	
	openMyPage(){
		this.navCtrl.setRoot('ProfilePage');
	}
	
	openHomePage(){
		this.navCtrl.push('HomePage');
	}

	logout(){
		this.authService.logout();
		this.navCtrl.setRoot(LoginPage);
	}
	
}