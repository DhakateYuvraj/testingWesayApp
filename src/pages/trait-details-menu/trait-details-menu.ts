import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams } from 'ionic-angular';
import { TraitService } from '../../services/traits.service';
import { Storage } from "@ionic/storage";

/**
 * Generated class for the TraitDetailsMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-trait-details-menu',
  templateUrl: 'trait-details-menu.html',
})
export class TraitDetailsMenuPage {
	public traitDetails;
	public authToken;
	public homeRef;
	
  constructor(public viewCtrl: ViewController,public navCtrl: NavController, private traitService: TraitService, private storage: Storage,  public navParams: NavParams) {
		this.traitDetails = navParams.get('traitDetails');
		this.homeRef = navParams.get('homeRef');
		console.log(this.traitDetails);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TraitDetailsMenuPage');
  }
   ionViewWillEnter() {
    this.storage.get('token').then((token) => {
		this.authToken = token;
    });
  }
	
	hideUnhideTrait(){
		let trait_data = {
			userTraitId: this.traitDetails.userTraitId,
			isHidden: this.traitDetails.isHidden ? 0 : 1
		}
		this.traitService.hideTrait(trait_data, this.authToken).subscribe(data => {
			//alert(JSON.stringify(data));
			this.viewCtrl.dismiss();
			this.homeRef.getTraitData();
			if (data.status == 'success') {
				//this.getTraitDetails(trait,this.authToken);
			}
		});
	}
  
	hideUnhideCount(trait){
    //this.traitService.loading.present();
		let trait_data = {
			userTraitId: this.traitDetails.userTraitId,
			hideStatus: this.traitDetails.isTraitCountHidden ? 0 : 1
		}
		this.traitService.hideTraitCount(trait_data, this.authToken).subscribe(data => {
			this.viewCtrl.dismiss();
			this.homeRef.getTraitData();
			//this.traitService.loading.dismiss();
			//alert(JSON.stringify(data));
			if (data.status == 'success') {
				//this.getTraitDetails(trait,this.authToken);
			}
		});
	}

	deleteTrait(trait){
    /*
	//this.traitService.loading.present();
		let trait_data = {
			traituniqueid: trait.traituniqueid,
			traitname: trait.traitname,
			traitgivenfor: '0'
		}
		this.traitService.deleteTrait(trait_data, this.authToken).subscribe(data => {
			//this.traitService.loading.dismiss();
			alert(JSON.stringify(data));
			if (data.status == 'success') {
				//this.getTraitDetails(trait,this.authToken);
			}
		});
		*/
	}
	
}
