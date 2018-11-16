import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { TraitService } from '../../services/traits.service';

/**
 * Generated class for the BadgesListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-badges-list',
  templateUrl: 'badges-list.html',
})
export class BadgesListPage {
	@ViewChild('searchInput') myInput;
	searchControl: FormControl; 
	search_string;
	selectedBadges = [];
	token;
	
	
	
	public badgeMasterList = [{badgeName:'badge name'}];
	public allBadgesData = [{badgeName:'badge name'},{badgeName:'badge name 1'},{badgeName:'badge name 2'},{badgeName:'badge name 3'}];
	
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		private storage: Storage,
		private traitService: TraitService) {
			this.searchControl = new FormControl();		
		}

	ionViewDidLoad() {
		console.log('ionViewDidLoad Badges');	
	}
	
	
	ionViewWillEnter() {
		this.storage.get('token').then((token) => {
			this.token = token;
			this.getBadgesMasterList();
		});	
	}
	
	getBadgesMasterList(){
		this.traitService.getBadgesMasterList(this.token).subscribe(data => {
		this.badgeMasterList = data.userBadgeList
		})
	}
	
	
	
	filterBadges() {
		let str = this.search_string;
		if (str && str.trim() != '') {
		  this.badgeMasterList = this.allBadgesData.filter((item) => {
			return ((item.badgename.toLowerCase().indexOf(str.toLowerCase()) > -1));
		  });
		  //let customTrait = { traitname: str, traitdescription: null, traiticonpath: null, traituniqueid: str + "_NewCustom" } 
		  //this.badgeMasterList.push(customTrait);
		}else{
			this.badgeMasterList = this.allBadgesData
		}
	}


	addSelected(badge) {
		this.selectedBadges.push({ badgename: badge.badgename});
	}
	
	addToPage(){
		alert(JSON.stringify(this.selectedBadges));
	}
}
