import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-friend-list-menu",
  templateUrl: "friend-list-menu.html"
})
export class FriendListMenuPage {
  public homeRef;
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.homeRef = navParams.get("homeRef");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad FriendListMenuPage");
  }

  syncContacts() {
    this.homeRef.syncContacts();
    this.viewCtrl.dismiss();
  }
}
