import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  PopoverController,
  AlertController
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { TraitService } from "../../services/traits.service";

@IonicPage()
@Component({
  selector: "page-badge-info",
  templateUrl: "badge-info.html"
})
export class BadgeInfoPage {
  public badgeInfo;
  public isAnonymous;
  public frdProfile = false;
  public badgeId;
  public authToken;
  public frdInfo;
  public badgeObj;
  public forPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private traitService: TraitService,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController
  ) {
    this.badgeObj = navParams.get("badgeInfo");
    this.frdInfo = navParams.get("frdInfo");
    this.forPage = navParams.get("forPage");
    this.badgeId = this.badgeObj.badgeId ? this.badgeObj.badgeId : 0;
    this.isAnonymous = this.traitService.isAnonymousMode() ? 1 : 0;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad BadgeInfoPage");
  }

  ionViewWillEnter() {
    this.storage.get("token").then(token => {
      this.authToken = token;
      this.getBadgeInfo();
    });
  }

  deleteBadge(badgeId) {
    let alert = this.alertCtrl.create({
      title: "Confirm Delete",
      message: "Do you want to delete this badge ?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Confirm",
          handler: () => {
            this.deleteBadgeConfirmed(badgeId);
          }
        }
      ]
    });
    alert.present();
  }

  getBadgeInfo() {
    if (this.forPage == "myBadge") {
      let badgeData = {
        badgeId: this.badgeId,
        userId: this.frdInfo.id
      };
      this.traitService
        .getBadgeDetails(this.authToken, badgeData)
        .subscribe(data => {
          if (data.badgeReceivedList.length == 0) {
            this.navCtrl.pop();
          }
          let newData = [];
          data.badgeReceivedList[0].badgeGivenInfoList.map(singleBadge => {
            if (singleBadge.ackText == null) {
              singleBadge["isAcked"] = false;
            } else {
              singleBadge["isAcked"] = true;
            }
            newData.push(singleBadge);
          });
          data.badgeReceivedList[0].badgeGivenInfoList = newData;
          this.badgeInfo = data.badgeReceivedList[0];
        });
    } else if (this.forPage == "givenBadge") {
      console.log("need to develop");
      let badgeData = {
        badgeId: this.badgeId
      };
      this.traitService
        .getGivenBadgeDetails(this.authToken, badgeData)
        .subscribe(data => {
          if (data.badgeGivenInfoList.length == 0) {
            this.navCtrl.pop();
          }
          let newData = [];
          data.badgeGivenInfoList.map(singleBadge => {
            if (singleBadge.acknowledgement == null) {
              singleBadge["isAcked"] = false;
            } else {
              singleBadge["isAcked"] = true;
            }

            singleBadge["ackText"] = singleBadge.acknowledgement
              ? singleBadge.acknowledgement
              : "Not acknowledged yet";
            singleBadge["isAccepted"] = singleBadge.acceptanceDate
              ? true
              : false;
            singleBadge["userBadgeid"] = singleBadge.userBadgeId;
            newData.push(singleBadge);
          });
          data.badgeGivenInfoList = newData;
          this.badgeInfo = data.badgeDTO;
          this.badgeInfo["badgeGivenInfoList"] = data.badgeGivenInfoList;
        });
    }
  }

  addAckText(badge) {
    console.log(badge.userBadgeid, badge.ackText);
    //acknowledgeBadge
    let badgeData = {
      userBadgeid: badge.userBadgeid,
      text: badge.ackText
    };
    this.traitService
      .acknowledgeBadge(this.authToken, badgeData)
      .subscribe(data => {
        this.getBadgeInfo();
        this.traitService.presentSuccessToast("Acknowledgement send");
      });
  }

  hideUnhideBadge(userBadgeid, isHidden) {
    let badgeData = {
      userBadgeid: userBadgeid,
      isHidden: isHidden ? 1 : 0
    };
    this.traitService
      .hideUnhideBadge(this.authToken, badgeData)
      .subscribe(data => {
        this.getBadgeInfo();
        if (badgeData.isHidden) {
          this.traitService.presentSuccessToast("Badge is hidden");
        } else {
          this.traitService.presentSuccessToast("Badge is visible");
        }
      });
  }

  deleteBadgeConfirmed(userBadgeid) {
    let badgeData = {
      userBadgeid: userBadgeid
    };
    this.traitService.deleteBadge(this.authToken, badgeData).subscribe(data => {
      this.getBadgeInfo();
      this.traitService.presentSuccessToast("badge deleted");
    });
  }

  acceptRejectBadge(userBadgeid, isAccepted) {
    let badgeData = {
      userBadgeid: userBadgeid,
      badgeId: this.badgeId,
      isAccepted: isAccepted
    };
    console.log(badgeData);
    this.traitService
      .acceptRejectBadge(this.authToken, badgeData)
      .subscribe(data => {
        this.getBadgeInfo();
        if (badgeData.isAccepted) {
          this.traitService.presentSuccessToast("Badge is Accepted");
        } else {
          this.traitService.presentSuccessToast("Badge is Rejected");
        }
      });
  }
}
