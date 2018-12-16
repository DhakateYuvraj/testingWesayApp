import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';
import { TraitService } from '../../services/traits.service';
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-badge-details-menu',
  templateUrl: 'badge-details-menu.html',
})
export class BadgeDetailsMenuPage {
	public badgeInfo;
	public authToken;
	public homeRef;
	public isBadgeHidden;
	
  constructor(
  public viewCtrl: ViewController,
  public navCtrl: NavController, 
  private traitService: TraitService, 
  private storage: Storage,  
  public navParams: NavParams) {
	this.badgeInfo = navParams.get('badgeInfo');
	this.homeRef = navParams.get('homeRef');
  }

  
   ionViewWillEnter() {
    this.storage.get('token').then((token) => {
		this.authToken = token;
    });
  }
  
  hideUnhideBadge(){	
	let badgeData = {
		userBadgeid: this.badgeInfo.badgeId,
		isHidden: 1
	}
	console.log(badgeData);
	//this.traitService.hideUnhideBadge(this.authToken, badgeData).subscribe(data => {
		this.viewCtrl.dismiss();
		this.homeRef.getBadgeData("back");
	//}); 
  }
  deleteBadge(){
	let badgeData = {
		userBadgeid: this.badgeInfo.badgeId
	}
	this.traitService.deleteBadge(this.authToken, badgeData).subscribe(data => {
		this.viewCtrl.dismiss();
		this.homeRef.getBadgeData("back");
	});  
  }
  
  
  
  
}
