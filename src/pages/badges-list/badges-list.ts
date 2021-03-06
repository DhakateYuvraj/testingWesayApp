import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
	
	public badgeMasterList = [{badgename:'badge name'},{badgename:'badge name 1'},{badgename:'badge name 2'},{badgename:'badge name 3'}];
	public allBadgesData = [{badgename:'badge name'},{badgename:'badge name 1'},{badgename:'badge name 2'},{badgename:'badge name 3'}];
	
	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.searchControl = new FormControl();		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BadgesListPage');
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
