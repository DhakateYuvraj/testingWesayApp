import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController
} from "ionic-angular";
import { BadgesListPage } from "../badges-list/badges-list";
import { Storage } from "@ionic/storage";
import { TraitService } from "../../services/traits.service";
import { FriendsListPage } from "../friends-list/friends-list";
import { BadgeProvider } from "../../providers/badge/badge";

@IonicPage()
@Component({
  selector: "page-badge-details",
  templateUrl: "badge-details.html"
})
export class BadgeDetailsPage {
  public pageFor = "availableBadges";
  public pageMode;
  public availableBadgesObj;
  public givenBadgesObj;
  public frdInfo;
  public isAnonymous;
  public token;
  public isAddNewBadge = false;
  public availableBadgesCnt;
  public selectedBadges = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private traitService: TraitService,
    public actionSheetCtrl: ActionSheetController,
    public badgeProvider: BadgeProvider
  ) {
    this.frdInfo = navParams.get("frdInfo");
    this.pageFor = navParams.get("pageFor"); //availableBadges  --or--  givenBadges
    this.pageMode = navParams.get("pageMode");
    this.isAnonymous = navParams.get("isAnonymous");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad Badges");
  }

  ionViewWillEnter() {
    this.storage.get("token").then(token => {
      this.traitService.showLoading();
      this.token = token;
      this.getBadgeInfo(token);
    });
  }

  getBadgeInfo(token) {
    let totalBadgesEarn = 0;
    let cntData = this.badgeProvider.getAvailableBadgesCnt();
    console.log(cntData);
    if (this.pageFor == "availableBadges") {
      this.traitService.getAvailableBadges(token).subscribe(data => {
        this.traitService.hideLoading();
        this.badgeProvider.setAvailableBadges(data.userBadgeList);
        this.availableBadgesObj = this.badgeProvider.getAvailableBadges();
        this.availableBadgesObj.forEach(function(obj, index) {
          if (obj.badgeName == "NEWLY ADDED BADGE") {
            totalBadgesEarn = totalBadgesEarn + obj.badgeCount;
            console.log(obj);
          }
        });
        if (totalBadgesEarn > 0) {
          this.isAddNewBadge = true;
          console.log(this.isAddNewBadge);
        }
        this.badgeProvider.setBadgesEmptySlots(totalBadgesEarn);

        /* this.traitService.getAvailableBadgesCnt(token).subscribe(cntData => {
					//this.availableBadgesCnt = cntData;
					if(totalBadgesEarn > cntData){
						this.isAddNewBadge = true
						console.log(this.isAddNewBadge);
					}
					this.badgeProvider.setBadgesEmptySlots(totalBadgesEarn - cntData)
				}) */
      });
    } else if (this.pageFor == "givenBadges") {
      this.traitService.getGivenBadges(token).subscribe(data => {
        this.traitService.hideLoading();
        //console.log(JSON.stringify(data))
        this.givenBadgesObj = data.userBadgeList;
      });
    }
  }

  openBadgesMasterList(badge) {
    this.navCtrl.push("BadgesListPage", { frdInfo: this.frdInfo, badge: badge });
  }

  actionOnBadge(badge) {
    if (this.pageMode == "view" && badge == "newBadge") {
      this.openBadgesMasterList(badge);
    } else if (this.pageMode == "view" && badge != "newBadge") {
      this.presentActionSheet(badge);
    } else if (this.pageMode == "give" && badge == "newBadge") {
      this.openBadgesMasterList(badge);
    } else if (this.pageMode == "give" && badge != "newBadge") {
      if (this.selectedBadges.indexOf(badge.badgeId) > -1) {
        this.selectedBadges.splice(
          this.selectedBadges.indexOf(badge.badgeId),
          1
        );
      } else {
        this.selectedBadges.push(badge.badgeId);
      }
      console.log(this.selectedBadges);
    }
  }

  giveBadge() {
    if (this.selectedBadges.length > 0) {
      this.traitService.showLoading();
      let badgeInfo = {
        badgeid: this.selectedBadges,
        badgegivenfor: this.frdInfo.id,
        isAnonymous: this.isAnonymous ? 1 : 0,
        badgeVisibility: 1
      };
      this.traitService
        .giveBadgeToFriend(this.token, badgeInfo)
        .subscribe(data => {
          this.traitService.hideLoading();
          this.traitService.presentSuccessToast(
            "Badge given to " + this.frdInfo.fullname
          );
          //this.getBadgeInfo(this.token);
          this.navCtrl.pop();
        });
    }
  }

  giveBadgeToFriend(badge) {
    this.navCtrl.push(FriendsListPage, {
      selectFrdMode: true,
      badgeId: badge.badgeId,
      isAnonymous: this.isAnonymous ? 1 : 0
    });
  }
  openGivenBadgeInfo(gvnBadge) {
    this.navCtrl.push("BadgeInfoPage", {
      badgeInfo: gvnBadge,
      frdInfo: this.frdInfo,
      forPage: "givenBadge"
    });
  }
  presentActionSheet(badge) {
    console.log(badge);

    let getButtons = function(that) {
      let btn = [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ];
      if (badge.badgeName == "NEWLY ADDED BADGE") {
        btn.push({
          text: "Select a badge",
          role: "",
          handler: () => {
            that.openBadgesMasterList(badge);
          }
        });
      } else {
        btn.push(
          {
            text: "Swap a badge",
            role: "",
            handler: () => {
              that.openBadgesMasterList(badge);
            }
          },
          {
            text: "Give a badge",
            role: "",
            handler: () => {
              that.giveBadgeToFriend(badge);
            }
          }
        );
      }
      console.log(btn);

      return btn;
    };

    let actionSheet = this.actionSheetCtrl.create({
      title: "Select Action",
      buttons: getButtons(this)
    });
    actionSheet.present();
  }
}
