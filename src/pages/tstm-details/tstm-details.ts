import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  NavParams,
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { FormControl } from "@angular/forms";
import { TraitService } from "../../services/traits.service";

@IonicPage()
@Component({
  selector: 'page-tstm-details',
  templateUrl: 'tstm-details.html',
})
export class TstmDetailsPage {
	public authToken;
	public testimonialId;
	public frdInfo;
	public tstmDetails;
	public newTstm;
	public isAnonymous;
	
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private traitService: TraitService,
		private storage: Storage
	) {  
		this.testimonialId = navParams.get("testimonialId");
		this.frdInfo =  navParams.get("frdInfo");
		this.isAnonymous = this.traitService.isAnonymousMode() ? 1 : 0
	}
  
  ionViewWillEnter() {
    this.storage.get("token").then(token => {
      this.authToken = token;
      this.getTstmDetails(this.testimonialId);
    });
  }
  
  getTstmDetails(testimonialId){
	console.log(testimonialId);
    this.traitService.showLoading();
	let payload = {
		"userid":this.frdInfo.id ? this.frdInfo.id : 0 ,
		"testimonialid":testimonialId
	}
	this.traitService.getTstmDetails(this.authToken, payload).subscribe(data => {
      this.traitService.hideLoading();
	  this.tstmDetails = data.response;
    });
  }
  
  giveTestimonialToFriend(){
	let payload = {
		"testimonialId": this.testimonialId,
		"testimonial": this.newTstm,
		"tstmGivenFor": this.frdInfo.id,
		"isAnonymous": this.isAnonymous
	};
	
	this.traitService.giveTestimonialToFriend(this.authToken, payload).subscribe(data => {
      console.log(data);
	  this.getTstmDetails(this.testimonialId)
  });
	
  }

}
