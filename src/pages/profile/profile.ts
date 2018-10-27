import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, NavParams, Content, AlertController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FormControl } from '@angular/forms';
import { TraitDetailsPage } from '../trait-details/trait-details';
import { TraitService } from '../../services/traits.service';

declare var $: any;

@Component({
	selector: 'page-profile',
	templateUrl: 'profile.html'
})
export class ProfilePage {
	@ViewChild("contentRef") contentHandle: Content;
	@ViewChild('searchInput') myInput;
	searchControl: FormControl;
	scrollHt: number = 0;
	topOrBottom;
	contentBox;
	tabBarHeight;
	section = 'trait';
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
	anonymousMode;
	information: any[];
	availableBadges;
	availableBadgesCnt;
	  
	constructor(
	public navCtrl: NavController, 
	public modalCtrl: ModalController,
	private traitService: TraitService,
	private storage: Storage, 
	private alertCtrl: AlertController, 
	public navParams: NavParams
	) {
		this.frdInfo = navParams.get('frdInfo');
		if (this.frdInfo !== undefined) {
			this.frdId = this.frdInfo.id;
			this.profileId = { id: this.frdId };
			this.frdProfile = true;
		}else{
			this.frdId = 0;
			this.profileId = null;
			this.frdProfile = false;
			this.frdInfo = {fullname : "MyName Dont hv Data"}
		}
		this.getUserProfile(this.frdId)
		this.searchControl = new FormControl(); 
		
		this.information = [{"name":"What is your first impression of Yuvraj","children":[{"name":"Special Academy Pizza","information":"Pastrami pork belly ball tip andouille corned beef jerky shankle landjaeger. Chicken chuck porchetta picanha, ham brisket tenderloin venison meatloaf landjaeger jowl.","price":"$25"}]},{"name":"What's the nicest thing about Yuvraj","children":[{"name":"Special Academy Pizza","information":"Pastrami pork belly ball tip andouille corned beef jerky shankle landjaeger. Chicken chuck porchetta picanha, ham brisket tenderloin venison meatloaf landjaeger jowl.","price":"$25"}]},{"name":"What would you like to thank Yuvraj for","children":[{"name":"Special Academy Pizza","information":"Pastrami pork belly ball tip andouille corned beef jerky shankle landjaeger. Chicken chuck porchetta picanha, ham brisket tenderloin venison meatloaf landjaeger jowl.","price":"$25"}]},{"name":"What have you learn from Yuvraj","children":[{"name":"Special Academy Pizza","information":"Pastrami pork belly ball tip andouille corned beef jerky shankle landjaeger. Chicken chuck porchetta picanha, ham brisket tenderloin venison meatloaf landjaeger jowl.","price":"$25"}]},{"name":"Whats the one thing Yuvraj needs to improve upon?","children":[{"name":"Special Academy Pizza","information":"Pastrami pork belly ball tip andouille corned beef jerky shankle landjaeger. Chicken chuck porchetta picanha, ham brisket tenderloin venison meatloaf landjaeger jowl.","price":"$25"}]},{"name":"Say something privately to Yuvraj","children":[{"name":"Special Academy Pizza","information":"Pastrami pork belly ball tip andouille corned beef jerky shankle landjaeger. Chicken chuck porchetta picanha, ham brisket tenderloin venison meatloaf landjaeger jowl.","price":"$25"}]}];
		
	}
	
	
	
	toggleSection(i) {
		this.information[i].open = !this.information[i].open;
	}

	toggleItem(i, j) {
		this.information[i].children[j].open = !this.information[i].children[j].open;
	}
  
	
	ionViewWillEnter() {
		this.storage.get('token').then((token) => {
			this.traitService.showLoading();
			this.authToken = token;
			this.getLoginUserTraits(token);
			this.getMasterTraitList();
		});
		
	}

	getMasterTraitList() {
		let masterTraitsStr = localStorage.getItem('activeTraits');
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
		this.traitService.getLoginUserTraits(token, this.profileId).subscribe(data => {
			this.allTraits = data.response;
			this.traitService.hideLoading();
			if (this.allTraits.length == 0) {
				this.noTrait = true;
			}
		});
		
		
this.traitService.getAvailableBadges(this.authToken).subscribe(data => {
alert(JSON.stringify(data))
this.availableBadges = data
})
this.traitService.getAvailableBadgesCnt(this.authToken).subscribe(data => {
alert(JSON.stringify(data))
this.availableBadgesCnt = data
})
		
	}

  deleteTrait(trait_id) {
    this.traitService.showLoading();
    let trait_data = {
      traituniqueid: trait_id,
      traitgivenfor: '0'
    }
    this.traitService.deleteTrait(trait_data, this.authToken).subscribe(data => {
      this.traitService.hideLoading();
      if (data.status == 'success') {
        this.getLoginUserTraits(this.authToken);
      }
    });
  }

  presentConfirm(trait_id) {
    this.alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Are you sure to delete ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteTrait(trait_id);
          }
        }
      ]
    });
    this.alert.present();
  }

  openTraitsList() {
    this.navCtrl.push('TraitsListPage');
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
		traitIdentifier : trait.traituniqueid,
		traitId : trait.traitid,
		vote : typeofvote,
		modeOfVote :  this.anonymousMode ? 1 : 0 //[1 = Anonymous, 0 = Public ]
	}
    //this.traitService.addTraitToPage(data, this.authToken).subscribe(data => {
	this.traitService.giveVote(data, this.authToken).subscribe(data => {
		this.traitService.hideLoading();
		alert(JSON.stringify(data)); 
		if (data.status != "error") {
			this.getLoginUserTraits(this.authToken);
		}
	})
}
  openTraitDetails(trait){
	this.navCtrl.push('TraitDetailsPage', {
		trait: trait,
		frdInfo: this.frdInfo
	});
  }

  filterTraits() { 
    let str = this.search_string;
    if ((str.length > 3) && (str.trim() != '')) {
      this.traitsMasterList = this.master_list.filter((item) => {
        return ((item.traitname.toLowerCase().indexOf(str.toLowerCase()) > -1));
      });
      let customTrait = { traitname: str, traitdescription: null, traiticonpath: null, traituniqueid: str + "_NewCustom" } 
      this.traitsMasterList.push(customTrait);  
    } else {
      this.traitsMasterList = []; 
    }
  }

  addCustomTrait(traitname){ 
    var id;
    if (this.profileId == null || this.profileId == undefined) { 
      id = 0;
    } else {
      id = this.profileId.id;
    }
    let custom_Trait = [{ traitname: traitname, traitgivenfor: id, typeofvote: 0 }];

    this.traitService.addTraitToPage(custom_Trait, this.authToken).subscribe(data => {
      console.log(data);
      if (data.status != "error") {
        this.search_string = '';
        this.cancelSearch();
        this.getLoginUserTraits(this.authToken); 
      }
    });
  }

	
	getUserProfile(frdId){
		let data = {
			id:frdId
		}
		this.traitService.getUserProfile(data, this.authToken).subscribe(data => {
		  if (data.status != "error") {
			//this.getLoginUserTraits(this.authToken);
		  }
		})
	}
	
	cancelSearch(){
		this.traitsMasterList = [];
	}
  
	openBadgesFor(pageName){
		this.navCtrl.push('BadgeDetailsPage', {
			pageFor: pageName
		});
	}
	
	changeVisibilityMode(){
		this.anonymousMode = !this.anonymousMode;
		if(this.anonymousMode){
			this.traitService.presentSuccessToast('Anonymous Mode');
		}else{
			this.traitService.presentSuccessToast('Private Mode');
		}
	}

	scrollingFun(e) {
		if (e.scrollTop > this.scrollHt) {
			$(".tabbar").css("display", "none");
			if (this.topOrBottom == "top") {
				this.contentBox.marginTop = 0;
			} else if (this.topOrBottom == "bottom") {
				this.contentBox.marginBottom = 0;
			}
		} else {
			$(".tabbar").css("display", "flex");
			if (this.topOrBottom == "top") {
				this.contentBox.marginTop = this.tabBarHeight;
			} else if (this.topOrBottom == "bottom") {
				this.contentBox.marginBottom = this.tabBarHeight;
			}
		}
		this.scrollHt = e.scrollTop;
	}
}
