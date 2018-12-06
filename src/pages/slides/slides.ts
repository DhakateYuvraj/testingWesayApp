import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Slides } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { FcmProvider } from '../../providers/fcm/fcm';
import { TraitService } from '../../services/traits.service';
import { Storage } from "@ionic/storage"; 
 
@IonicPage()
@Component({  
  selector: 'page-slides',
  templateUrl: 'slides.html',
})
export class SlidesPage {
  @ViewChild(Slides) slides: Slides; 
 
	public currentIndex = 0;  
	public fcmDeviceId;
	public token;
	constructor(
	public navCtrl: NavController,
	public navParams: NavParams,
	public viewCtrl: ViewController, 
	public traitService: TraitService,
	private storage: Storage,
	public fcm: FcmProvider) {
		this.storage.get('token').then((token) => {
			this.getFcmToken();
		});
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad SlidesPage');
  }

  slideChanged(){  
    this.currentIndex = this.slides.getActiveIndex();
    // console.log('Current index is', this.currentIndex); 
  }

  close(){
    this.viewCtrl.dismiss().catch(() => {});  
  }

  skip(){
    this.navCtrl.setRoot(TabsPage);
  }

  continue(){
    this.navCtrl.setRoot(TabsPage);
  }
	getFcmToken(){
		this.fcmDeviceId = this.fcm.getToken();
		this.fcmTokenSend(this.fcmDeviceId)
		setTimeout(this.fcmTokenSend(this.fcmDeviceId), 5000);	
	}
	
	fcmTokenSend(fcmDeviceId){
		let fcmTokenInfo = { "deviceregistrationid": fcmDeviceId}
		this.traitService.fcmTokenSend(this.token,fcmTokenInfo).subscribe(data => {
		})
	}

}
