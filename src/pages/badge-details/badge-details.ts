import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BadgesListPage } from '../badges-list/badges-list';
import { Storage } from "@ionic/storage";
import { TraitService } from '../../services/traits.service';


@IonicPage()
@Component({
  selector: 'page-badge-details',
  templateUrl: 'badge-details.html',
})
export class BadgeDetailsPage {
	public pageFor = 'availableBadges';
	public availableBadgesObj;
	constructor(
	public navCtrl: NavController, 
	public navParams: NavParams, 
	private storage: Storage,
	private traitService: TraitService) {
		this.pageFor = navParams.get('pageFor');	//availableBadges  --or--  givenBadges
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad Badges');	
	}
	
	
	ionViewWillEnter() {
		this.storage.get('token').then((token) => {
			this.traitService.showLoading();
			this.getBadgeInfo(token);
		});	
	}

	getBadgeInfo(token){
		this.traitService.getAvailableBadges(token).subscribe(data => {
			this.traitService.hideLoading();	
			console.log(JSON.stringify(data))
			this.availableBadgesObj = data.userBadgeList;
		})
	}
	
	openBadgesMasterList(){
		this.navCtrl.push('BadgesListPage');
	}
	
	
	
	
	
	
}
