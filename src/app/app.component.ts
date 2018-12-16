import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from "@ionic/storage"; 
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { FcmProvider } from '../providers/fcm/fcm';
import { TraitService } from '../services/traits.service';


@Component({
	templateUrl: 'app.html'
})

export class MyApp {
	@ViewChild(Nav) nav: Nav;
	rootPage: any; 
	public fcmDeviceId;
	public token;
	public counter = 0;
	constructor(
	public platform: Platform, 
	public statusBar: StatusBar, 
	public splashScreen: SplashScreen, 
	public storage: Storage,
	public modalCtrl: ModalController,
	public traitService: TraitService, 
	public fcm: FcmProvider
	) {
		this.initializeApp();
		this.isLoggedIn();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.fcm.subscribeToPushNotifications();
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
		this.platform.registerBackButtonAction(() => {
			if (this.counter == 0) {
				this.counter++;
				this.traitService.presentSuccessToast('Press again to exit');
				setTimeout(() => { this.counter = 0 }, 3000)
			} else {
				console.log("exitapp");
				this.platform.exitApp();
			}
		}, 0)
	}

	isLoggedIn(){
		this.storage.get('token').then((token) => {
			this.getFcmToken();		
			if (token != undefined || token != null) { 
				this.token = token;
				this.rootPage = TabsPage; 
			} else {
				this.rootPage = LoginPage; 
			}
		}); 
	}
	getFcmToken(){
		this.fcmDeviceId = this.fcm.getToken();
		this.fcmTokenSend(this.fcmDeviceId)
		setTimeout(this.fcmTokenSend(this.fcmDeviceId), 5000);	
	}

	openPage(page) {
		this.nav.setRoot(page.component);
	}
	
	fcmTokenSend(fcmDeviceId){
		//alert('in fcmTokenSend app compo'+fcmDeviceId)
		let fcmTokenInfo = { "deviceregistrationid": fcmDeviceId}
		this.traitService.fcmTokenSend(this.token,fcmTokenInfo).subscribe(data => {
			//alert('from app component');
			//alert(JSON.stringify(data));
		})
	}
  
}
