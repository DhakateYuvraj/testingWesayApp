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
	
  constructor(
  public viewCtrl: ViewController,
  public navCtrl: NavController, 
  private traitService: TraitService, 
  private storage: Storage,  
  public navParams: NavParams) {
	this.badgeInfo = navParams.get('badgeInfo');
	this.homeRef = navParams.get('homeRef');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TraitDetailsMenuPage');
  }
   ionViewWillEnter() {
    this.storage.get('token').then((token) => {
		this.authToken = token;
    });
  }
  
  hideUnhideBadge(id){
		 
  }
  deleteBadge(){
  
  }
  
  
  
  
}
