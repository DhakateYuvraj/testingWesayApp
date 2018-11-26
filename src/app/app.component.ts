import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from "@ionic/storage"; 
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
//import { FMC } from '@ionic-native/fcm';
import { FcmProvider } from '../providers/fcm/fcm';


@Component({
	templateUrl: 'app.html'
})

export class MyApp {
	@ViewChild(Nav) nav: Nav;
	rootPage: any; 
	public fcmToken;

	constructor(
	public platform: Platform, 
	public statusBar: StatusBar, 
	public splashScreen: SplashScreen, 
	private storage: Storage,
	public modalCtrl: ModalController,
	public fcm: FcmProvider
	) {
		this.initializeApp();
		this.isLoggedIn();
		this.fcmToken = fcm.getToken();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	isLoggedIn(){
		this.storage.get('token').then((token) => {
			console.log('token', token);
			alert(JSON.stringify(this.fcmToken));
			if (token != undefined || token != null) { 
				this.rootPage = TabsPage; 
			} else {
				this.rootPage = LoginPage; 
			}
		}); 
	}

	openPage(page) {
		this.nav.setRoot(page.component);
	}
  
}
