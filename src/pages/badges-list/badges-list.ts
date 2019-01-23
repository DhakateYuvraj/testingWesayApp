import { Component, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { TraitService } from "../../services/traits.service";
import { BadgeProvider } from "../../providers/badge/badge";

@IonicPage()
@Component({
  selector: "page-badges-list",
  templateUrl: "badges-list.html"
})
export class BadgesListPage {
  @ViewChild("searchInput") myInput;
  searchControl: FormControl;
  search_string;
  selectedBadge;
  oldBadge;
  token;

  public badgeMasterList = [{ badgename: "badge name" }];
  public allBadgesData = [];
  public frdInfo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private traitService: TraitService,
    private badgeProvider: BadgeProvider
  ) {
    this.searchControl = new FormControl();
    this.frdInfo = navParams.get("frdInfo");
    this.oldBadge = navParams.get("badge");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad Badges");
  }

  ionViewWillEnter() {
    this.storage.get("token").then(token => {
      this.token = token;
      this.getBadgesMasterList();
    });
  }

  getBadgesMasterList() {
    this.traitService.getBadgesMasterList(this.token).subscribe(data => {
      this.badgeMasterList = data.userBadgeList;
    });
  }

  filterBadges() {
    let str = this.search_string;
    if (str && str.trim() != "") {
      this.badgeMasterList = this.allBadgesData.filter(item => {
        return item.badgename.toLowerCase().indexOf(str.toLowerCase()) > -1;
      });
      //let customTrait = { traitname: str, traitdescription: null, traiticonpath: null, traituniqueid: str + "_NewCustom" }
      //this.badgeMasterList.push(customTrait);
    } else {
      this.badgeMasterList = this.allBadgesData;
    }
  }

  addToPage() {

	  
	let badgeData = {
		"newBadgeId":this.selectedBadge,
		//"userBadgeCountId":this.oldBadge.userBadgeCountid,
		"badgeId":this.oldBadge.badgeId,
	};
	
	
	
    this.traitService.chooseBadge(this.token,badgeData).subscribe(data => {
      this.navCtrl.pop();
    });
	
	
	
	
	
	
	
  }
}
