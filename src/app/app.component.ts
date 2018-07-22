import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from "@ionic/storage"; 
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';    

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // rootPage: any = TabsPage;
  rootPage: any; 

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private storage: Storage) {
    this.initializeApp();
    this.isLoggedIn();
    // used for an example of ngFor and navigation
   

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
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

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
