import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { TraitService } from '../../services/traits.service';


@IonicPage()
@Component({
  selector: 'page-badge-info',
  templateUrl: 'badge-info.html',
})
export class BadgeInfoPage {

	public badgeInfo;
	public isAnonymous;
	public frdProfile = false;


	constructor(
	public navCtrl: NavController, 
	public navParams: NavParams, 
	private storage: Storage,
	private traitService: TraitService, 
	public popoverCtrl: PopoverController) {
		this.badgeInfo = navParams.get('badgeInfo');
		this.isAnonymous = this.traitService.isAnonymousMode() ? 1 : 0;	
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad BadgeInfoPage');
  }
	presentPopover(myEvent) {
		let popover = this.popoverCtrl.create('BadgeDetailsMenuPage',{badgeInfo:this.badgeInfo,homeRef: this});
		popover.present({
			ev: myEvent
		});
	}

}
