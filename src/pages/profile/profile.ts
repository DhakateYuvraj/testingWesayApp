import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  ModalController,
  NavParams,
  Content,
  AlertController,
  ActionSheetController
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { FormControl } from "@angular/forms";
import { TraitDetailsPage } from "../trait-details/trait-details";
import { TraitService } from "../../services/traits.service";
import { ActionSheet, ActionSheetOptions } from "@ionic-native/action-sheet";
import { BadgeInfoPage } from "../badge-info/badge-info";
import { HomePage } from "../home/home";
import { BadgeProvider } from "../../providers/badge/badge";

declare var $: any;

@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  @ViewChild("contentRef") contentHandle: Content;
  @ViewChild("searchInput") myInput;
  searchControl: FormControl;
  scrollHt: number = 0;
  topOrBottom;
  contentBox;
  tabBarHeight;
  section = "trait";
  allTraits = [];
  frdInfo;
  noTrait: Boolean = false;
  authToken;
  frdId;
  profileId;
  frdProfile;
  alert;
  traitsMasterList;
  master_list;
  search_string;
  information: any[];
  availableBadges;
  availableBadgesCnt;
  receivedBadgesObj;
  givenBadgesCnt;
  public myTraitsArray: any[];
  public selectedItem;
  public myTstm;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private traitService: TraitService,
    private storage: Storage,
    private alertCtrl: AlertController,
    public navParams: NavParams,
    private actionSheet: ActionSheet,
    public badgeProvider: BadgeProvider,
    public actionsheetCtrl: ActionSheetController
  ) {
    this.frdInfo = navParams.get("frdInfo");
    let tabOpen = navParams.get("tabOpen") ? navParams.get("tabOpen") : "trait";
    this.section = tabOpen;
    if (this.frdInfo !== undefined) {
      this.frdId = this.frdInfo.id;
      this.profileId = { id: this.frdId };
      this.frdProfile = true;
    } else {
      this.frdId = 0;
      this.profileId = null;
      this.frdProfile = false;
      this.frdInfo = { fullname: " " };
    }
    //this.getUserProfile(this.frdId);
    this.searchControl = new FormControl();

    this.information = [
      {
        name: "What is your first impression of Yuvraj",
        children: [
          {
            name: "Special Academy Pizza",
            information:
              "Pastrami pork belly ball tip andouille corned beef jerky shankle landjaeger. Chicken chuck porchetta picanha, ham brisket tenderloin venison meatloaf landjaeger jowl.",
            price: "$25"
          }
        ]
      },
      {
        name: "What's the nicest thing about Yuvraj",
        children: [
          {
            name: "Special Academy Pizza",
            information:
              "Pastrami pork belly ball tip andouille corned beef jerky shankle landjaeger. Chicken chuck porchetta picanha, ham brisket tenderloin venison meatloaf landjaeger jowl.",
            price: "$25"
          }
        ]
      },
      {
        name: "What would you like to thank Yuvraj for",
        children: [
          {
            name: "Special Academy Pizza",
            information:
              "Pastrami pork belly ball tip andouille corned beef jerky shankle landjaeger. Chicken chuck porchetta picanha, ham brisket tenderloin venison meatloaf landjaeger jowl.",
            price: "$25"
          }
        ]
      },
      {
        name: "What have you learn from Yuvraj",
        children: [
          {
            name: "Special Academy Pizza",
            information:
              "Pastrami pork belly ball tip andouille corned beef jerky shankle landjaeger. Chicken chuck porchetta picanha, ham brisket tenderloin venison meatloaf landjaeger jowl.",
            price: "$25"
          }
        ]
      },
      {
        name: "Whats the one thing Yuvraj needs to improve upon?",
        children: [
          {
            name: "Special Academy Pizza",
            information:
              "Pastrami pork belly ball tip andouille corned beef jerky shankle landjaeger. Chicken chuck porchetta picanha, ham brisket tenderloin venison meatloaf landjaeger jowl.",
            price: "$25"
          }
        ]
      },
      {
        name: "Say something privately to Yuvraj",
        children: [
          {
            name: "Special Academy Pizza",
            information:
              "Pastrami pork belly ball tip andouille corned beef jerky shankle landjaeger. Chicken chuck porchetta picanha, ham brisket tenderloin venison meatloaf landjaeger jowl.",
            price: "$25"
          }
        ]
      }
    ];
  }

  ionViewWillEnter() {
    this.storage.get("token").then(token => {
      this.authToken = token;
      this.getUserProfile(this.frdId);
      this.reloadTabData();
    });
  }
  reloadTabData(){
    if(this.section == "trait"){
      this.getLoginUserTraits(this.authToken);
      this.getMasterTraitList();
    }else if(this.section == "badges"){
      this.getAvailableBadgesCnt();
      this.getGivenBadgesCnt();
      this.getReceivedBadges();
    }else if(this.section == "testimonials"){
      this.userTestimonialSettings();
    }
  }

  doRefresh(refresher) {
    //this.getLoginUserTraits(this.authToken);
    this.traitService
      .getLoginUserTraits(this.authToken, this.profileId)
      .subscribe(data => {
        this.allTraits = data.response;
        if (data.response) {
          data.response.map(singleTrait => {
            this.myTraitsArray.push(singleTrait.usertraitid);
          });
        }
        this.traitService.hideLoading();
        if (this.allTraits.length == 0) {
          this.noTrait = true;
        } else {
          this.noTrait = false;
        }
        refresher.complete();
      });
  }

  // user profile functionality start ---------------------------------------------------
  getUserProfile(frdId) {
    let data = {
      id: frdId
    };
    this.traitService.getUserProfile(data, this.authToken).subscribe(data => {
      this.frdInfo = data.response;
      this.frdInfo.id = frdId;
    });
  }

  openProfilePage() {
    this.navCtrl.push("MyProfilePage", {
      frdId: this.frdId
    });
  }
  // user profile functionality start ---------------------------------------------------

  // Tab functionality start ---------------------------------------------------
  selectedTabChanged(e) {
    console.log(e._value);
    if (e._value == "badges") {
      this.getAvailableBadgesCnt();
      this.getGivenBadgesCnt();
      this.getReceivedBadges();
    } else if (e._value == "testimonials") {
      this.userTestimonialSettings();
    }
  }

  changeTab(tabName) {
    this.section = tabName;
  }

  // Tab functionality end ---------------------------------------------------

  addTrait() {
    this.navCtrl.push(HomePage, {
      dataFor: "addTraitForFrd",
      frdInfo: this.frdInfo,
      profileRef: this
    });
  }

  getMasterTraitList() {
    let masterTraitsStr = localStorage.getItem("activeTraits");
    let allTraitsData = JSON.parse(masterTraitsStr);
    if (allTraitsData != null && allTraitsData.length > 5) {
      this.master_list = allTraitsData;
    } else {
      this.traitService.getAllTrais(this.authToken).subscribe(data => {
        this.master_list = data.response;
      });
    }
  }

  getLoginUserTraits(token) {
    this.myTraitsArray = [];
    this.traitService
      .getLoginUserTraits(token, this.profileId)
      .subscribe(data => {
        this.allTraits = data.response;
        if (data.response) {
          data.response.map(singleTrait => {
            this.myTraitsArray.push(singleTrait.usertraitid);
          });
        }
        this.traitService.hideLoading();
        if (this.allTraits.length == 0) {
          this.noTrait = true;
        } else {
          this.noTrait = false;
        }
      });
  }

  openTraitsList() {
    this.navCtrl.push("TraitsListPage");
  }

  giveVoteToFriend(trait, typeofvote) {
    this.traitService.showLoading();
    var id;
    if (this.profileId == null || this.profileId == undefined) {
      id = 0;
    } else {
      id = this.profileId.id;
    }
    let data = {
      traitIdentifier: trait.traituniqueid,
      traitId: trait.traitid,
      userTraitId: trait.usertraitid,
      voteType: typeofvote,
      isAnonymous: this.traitService.isAnonymousMode() ? 1 : 0 //[1 = Anonymous, 0 = Public ]
    };
    this.traitService.giveVote(data, this.authToken).subscribe(data => {
      this.traitService.hideLoading();
      //alert(JSON.stringify(data));
      if (data.status != "error") {
        this.getLoginUserTraits(this.authToken);
      }
    });
  }
  openTraitDetails(trait) {
    this.navCtrl.push("TraitDetailsPage", {
      trait: trait,
      frdInfo: this.frdInfo,
      myTraitsArray: this.myTraitsArray
    });
  }

  filterTraits() {
    let str = this.search_string;
    if (str.length > 3 && str.trim() != "") {
      this.traitsMasterList = this.master_list.filter(item => {
        return item.traitname.toLowerCase().indexOf(str.toLowerCase()) > -1;
      });
      let customTrait = {
        traitname: str,
        traitdescription: null,
        traiticonpath: null,
        traituniqueid: str + "_NewCustom"
      };
      this.traitsMasterList.push(customTrait);
    } else {
      this.traitsMasterList = [];
    }
  }

  addCustomTrait(traitname) {
    var profileId;
    let custom_Trait = [];
    var traitObj;
    if (this.profileId == null || this.profileId == undefined) {
      profileId = 0;
    } else {
      profileId = this.profileId.id;
    }
    if (typeof traitname == "string") {
      traitObj = {
        traitname: traitname,
        traitgivenfor: profileId,
        //typeofvote: 0,
        isAnonymous: this.traitService.isAnonymousMode() ? 1 : 0
      };
      custom_Trait.push(traitObj);
    } else {
      traitname.map(singleTraitName => {
        traitObj = {
          traitname: singleTraitName,
          traitgivenfor: profileId,
          //typeofvote: 0,
          isAnonymous: this.traitService.isAnonymousMode() ? 1 : 0
        };
        custom_Trait.push(traitObj);
      });
    }

    this.traitService
      .addTraitToPage(custom_Trait, this.authToken)
      .subscribe(data => {
        console.log(data);
        if (data.status != "error") {
          this.search_string = "";
          this.cancelSearch();
          this.getLoginUserTraits(this.authToken);
        }
        if (data.customResponse) {
          if (
            data.customResponse.isWaitingForApproval &&
            data.customResponse.isWaitingForApproval == 1
          ) {
            this.traitService.presentSuccessToast(
              "Trait is waiting for approval"
            );
          } else {
            this.traitService.presentSuccessToast("Trait is accepted");
          }
        }
      });
  }

  cancelSearch() {
    this.traitsMasterList = [];
  }

  traitLongPressed(traitDetails) {
    if (!this.frdProfile) {
      this.selectedItem = traitDetails.usertraitid;
      let actionSheet = this.actionsheetCtrl.create({
        title: traitDetails.traitname,
        cssClass: "action-sheets-basic-page",
        buttons: [
          {
            text: "Delete Trait",
            icon: "",
            handler: () => {
              this.deleteTrait(traitDetails);
            }
          },
          {
            text: traitDetails.isHidden ? "Show Trait" : "Hide Trait",
            icon: "",
            handler: () => {
              this.hideTrait(traitDetails);
            }
          },
          {
            text: traitDetails.isTraitCountHidden ? "Show Count" : "Hide Count",
            icon: "",
            handler: () => {
              this.hideCount(traitDetails);
            }
          },
          {
            role: "cancel", // will always sort to be on the bottom
            handler: () => {
              this.actionSheetCancel();
            }
          }
        ]
      });
      actionSheet.present();
    }
  }
  actionSheetCancel() {
    this.selectedItem = null;
  }

  deleteTrait(traitDetails) {
    let alert = this.alertCtrl.create({
      title: "Confirm Delete",
      message: "Do you want to delete " + traitDetails.traitname + " ?",
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
            this.deleteTraitConfirmed(traitDetails);
          }
        }
      ]
    });
    alert.present();
  }

  deleteTraitConfirmed(traitDetails) {
    let trait_data = {
      userTraitId: traitDetails.usertraitid
    };
    this.traitService
      .deleteTrait(trait_data, this.authToken)
      .subscribe(data => {
        this.traitService.presentSuccessToast(
          traitDetails.traitname + " deleted successfully"
        );
        this.getLoginUserTraits(this.authToken);
      });
  }

  hideTrait(traitDetails) {
    let trait_data = {
      userTraitId: traitDetails.usertraitid,
      isHidden: traitDetails.isHidden ? 0 : 1
    };
    this.traitService.hideTrait(trait_data, this.authToken).subscribe(data => {
      this.getLoginUserTraits(this.authToken);
    });
  }

  hideCount(traitDetails) {
    let trait_data = {
      userTraitId: traitDetails.usertraitid,
      hideStatus: traitDetails.isTraitCountHidden ? 0 : 1
    };
    this.traitService
      .hideTraitCount(trait_data, this.authToken)
      .subscribe(data => {
        this.getLoginUserTraits(this.authToken);
      });
  }

  // Badge started ------------------------------------------------------------------------

  getAvailableBadgesCnt() {
    this.traitService.getAvailableBadgesCnt(this.authToken).subscribe(data => {
      this.badgeProvider.setAvailableBadgesCnt(data);
      this.availableBadgesCnt = this.badgeProvider.getAvailableBadgesCnt();
    });
  }
  getGivenBadgesCnt() {
    this.traitService.getGivenBadgesCnt(this.authToken).subscribe(data => {
      this.givenBadgesCnt = data;
    });
  }
  getReceivedBadges() {
    this.traitService
      .getReceivedBadges(this.authToken, this.frdId)
      .subscribe(data => {
        data.badgeReceivedList.map(singleBadge => {
          singleBadge.badgeGivenInfoList.map(singleBadgeGivenBy => {
            if (singleBadgeGivenBy.isAccepted == 0) {
              //console.log(singleBadge);
              singleBadge["isAccepted"] = false;
            }
          });
        });
        this.receivedBadgesObj = data.badgeReceivedList;
        console.log(JSON.stringify(this.receivedBadgesObj));
      });
  }

  openBadgesFor(pageName, mode) {
    this.navCtrl.push("BadgeDetailsPage", {
      pageFor: pageName,
      frdInfo: this.frdInfo,
      pageMode: mode,
      isAnonymous: this.traitService.isAnonymousMode() ? 1 : 0
    });
  }

  openBadgeInfo(badgeInfo) {
    this.navCtrl.push("BadgeInfoPage", {
      badgeInfo: badgeInfo,
      frdInfo: this.frdInfo,
      forPage: "myBadge"
    });
  }
  // Badge End ------------------------------------------------------------------------

  // Testimonial started ------------------------------------------------------------------------
  userTestimonialSettings() {
    this.traitService
      .userTestimonialSettings(this.authToken)
      .subscribe(data => {
        if(data.response){
          this.myTstm = data.response;
        }
      });
  }

  openTstmMaster() {
    this.navCtrl.push("TstmMasterPage",{frdInfo:this.frdInfo});
  }

  toggleSection(i) {
    this.myTstm[i].open = !this.myTstm[i].open;
  }

  // Testimonial End ------------------------------------------------------------------------
}
