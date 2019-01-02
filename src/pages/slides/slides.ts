import { Component } from "@angular/core";
import { ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  Slides,
  AlertController,
  Platform
} from "ionic-angular";
import { TabsPage } from "../tabs/tabs";
import { FcmProvider } from "../../providers/fcm/fcm";
import { TraitService } from "../../services/traits.service";
import { Storage } from "@ionic/storage";
import { AuthService } from "../../services/auth.service";

@IonicPage()
@Component({
  selector: "page-slides",
  templateUrl: "slides.html"
})
export class SlidesPage {
  @ViewChild(Slides) slides: Slides;

  public currentIndex = 0;
  public fcmDeviceId;
  public token;
  //public platform;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public traitService: TraitService,
    private storage: Storage,
    public fcm: FcmProvider,
    private authService: AuthService,
    public platform: Platform,
    public alertCtrl: AlertController
  ) {
    this.storage.get("token").then(token => {
      this.getFcmToken();
      //this.platform = platform;
      this.presentConfirm();
    });
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad SlidesPage");
  }

  slideChanged() {
    this.currentIndex = this.slides.getActiveIndex();
    // console.log('Current index is', this.currentIndex);
  }

  close() {
    this.viewCtrl.dismiss().catch(() => {});
  }

  skip() {
    this.navCtrl.setRoot(TabsPage);
  }

  continue() {
    this.navCtrl.setRoot(TabsPage);
  }
  getFcmToken() {
    this.fcmDeviceId = this.fcm.getToken();
    this.fcmTokenSend(this.fcmDeviceId);
    setTimeout(this.fcmTokenSend(this.fcmDeviceId), 5000);
  }

  fcmTokenSend(fcmDeviceId) {
    let fcmTokenInfo = { deviceregistrationid: fcmDeviceId };
    this.traitService
      .fcmTokenSend(this.token, fcmTokenInfo)
      .subscribe(data => {});
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: "Alpha Test Version",
      message:
        "This is an alpha test version of the app. Please note that there may be bugs and some of the functionality may be unavailable. I understand and wish to proceed with being part of the Alpha Test.",
      buttons: [
        {
          text: "Decline",
          role: "cancel",
          handler: () => {
            this.authService.logout();
            this.platform.exitApp();
          }
        },
        {
          text: "Accept",
          handler: () => {
            //console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }
}
