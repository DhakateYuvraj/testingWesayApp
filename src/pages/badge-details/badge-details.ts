import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BadgesListPage } from '../badges-list/badges-list';

@IonicPage()
@Component({
  selector: 'page-badge-details',
  templateUrl: 'badge-details.html',
})
export class BadgeDetailsPage {
	public pageFor = 'availableBadges';
	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.pageFor = navParams.get('pageFor');	//availableBadges  --or--  givenBadges
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad Badges');
	}

	openBadgesMasterList(){
		this.navCtrl.push('BadgesListPage');
	}
}
