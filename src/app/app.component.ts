import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from "@ionic/storage"; 
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { Push, PushObject, PushOptions } from '@ionic-native/push';


@Component({
	templateUrl: 'app.html'
})

export class MyApp {
	@ViewChild(Nav) nav: Nav;
	rootPage: any; 

	constructor(
	public platform: Platform, 
	public statusBar: StatusBar, 
	public splashScreen: SplashScreen, 
	private storage: Storage,
	public modalCtrl: ModalController,
	private push: Push
	) {
		this.initializeApp();
		this.isLoggedIn();
		
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
			this.pushSetup();
		});
	}

	isLoggedIn(){
		this.storage.get('token').then((token) => {
			console.log('token', token);
			if (token != undefined || token != null) { 
				this.rootPage = TabsPage; 
			} else {
				this.rootPage = LoginPage; 
			}
		}); 
	}
	pushSetup(){
const options: PushOptions = {
android: {
	senderID : '374837237806'
}
};

const pushObject: PushObject = this.push.init(options);


pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
	}

	openPage(page) {
		this.nav.setRoot(page.component);
	}
  
}
