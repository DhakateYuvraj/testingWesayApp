import { Component, ViewChild } from "@angular/core";
import { Platform, Nav, ModalController, App } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Storage } from "@ionic/storage";
import { TabsPage } from "../pages/tabs/tabs";
import { LoginPage } from "../pages/login/login";
import { SignupPage } from "../pages/signup/signup";
import { FcmProvider } from "../providers/fcm/fcm";
import { TraitService } from "../services/traits.service";
import { AlertController } from "ionic-angular";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  public fcmDeviceId;
  public token;
  public counter = 0;
  constructor(
    public app: App,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: Storage,
    public modalCtrl: ModalController,
    public traitService: TraitService,
    public fcm: FcmProvider,
    public alertCtrl: AlertController
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

    /*this.platform.registerBackButtonAction(()=>{
		let nav = this.app.getActiveNavs()[0];
		let activeView = nav.getActive();                
      //alert(activeView.name);
      if(activeView.name === 'HomePage') {
          if (nav.canGoBack()){
              nav.pop();
          }else{
                    let alertController = this.alertCtrl.create({
                      title: 'Confirm',
                      message: 'Are you sure you want to exit?',
                      buttons: [{
                        text: "Exit",
                        handler: () => { this.platform.exitApp(); }
                      }, {
                        text: "Cancel",
                        role: 'cancel'
                      }]
                    })
                    alertController.present();
                }         
            }else if(nav.canGoBack()){
              nav.pop();
          }
        },100);*/
  }

  isLoggedIn() {
    this.storage.get("token").then(token => {
      this.getFcmToken();
      if (token != undefined || token != null) {
        this.token = token;
        this.rootPage = TabsPage;
      } else {
        this.rootPage = LoginPage;
      }
    });
  }
  getFcmToken() {
    this.fcmDeviceId = this.fcm.getToken();
    this.fcmTokenSend(this.fcmDeviceId);
    setTimeout(this.fcmTokenSend(this.fcmDeviceId), 5000);
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  fcmTokenSend(fcmDeviceId) {
    //alert('in fcmTokenSend app compo'+fcmDeviceId)
    let fcmTokenInfo = { deviceregistrationid: fcmDeviceId };
    this.traitService.fcmTokenSend(this.token, fcmTokenInfo).subscribe(data => {
      //alert('from app component');
      //alert(JSON.stringify(data));
    });
  }
}
