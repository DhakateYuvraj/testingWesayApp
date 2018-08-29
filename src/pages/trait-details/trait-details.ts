import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, PopoverController } from 'ionic-angular';
import { TraitService } from '../../services/traits.service';
import { Storage } from "@ionic/storage";
@IonicPage()
@Component({
  selector: 'page-trait-details',
  templateUrl: 'trait-details.html',
})
export class TraitDetailsPage {
	public trait;
	public authToken;
	public traitDetails;
	public sliderValue = 5;
	public loading;
	public comments;
  
	constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private traitService: TraitService, private loadingCtrl: LoadingController) {
		this.trait = navParams.get('trait');
		if(!this.trait){
		this.trait= {
			"traitid": null,
			"traitname": "Extroverted",
			"traituniqueid": "3bed0feaa5fd53b04f7c7fc50cf905e0e3f0d2fc",
			"traitdescripion": null,
			"traiticonpath": null,
			"positive": 1,
			"negetive": 0,
			"nutral": 0,
			"traittype": "predefined",
			"isannonymous": 0,
			"ishidden": 0,
			"typeofvote": 0,
			"fullname": null,
			"creationdate": null,
			"mytraitcontibution": 0,
			"mypositive": "n",
			"mynegetive": "n",
			"myneutral": "n"
		}
		}
    this.presentLoadingDefault();
	}

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({ spinner: 'bubbles' });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TraitDetailsPage');
  }
  ionViewWillEnter() {
    this.storage.get('token').then((token) => {
		this.authToken = token;
		this.getTraitDetails(this.trait,this.authToken);
		this.getTraitComments(this.trait);
    });
  }
	getTraitDetails(trait,token){
    //this.loading.present();
		let trait_data = {
			traituniqueid: trait.trait_id,
			traitname: trait.traitname,
			traitgivenfor: '0'
		}
		this.traitService.getTraitDetails(trait_data, this.authToken).subscribe(data => {
			//this.loading.dismiss();
			alert(JSON.stringify(data));
			if (data.status == 'success') {
				this.traitDetails = data.response
				this.sliderValue = this.traitDetails.sliderValue
			}else{
				alert('Dummy Data');
				this.traitDetails = {avgScore:4,sliderValue:5,hideTrait:0,hideCount:0,comments:{from:"Yuvraj Dhakte",time:"11:50AM",date:"12/12/12",text:"dummy comment"}}
				this.sliderValue = this.traitDetails.sliderValue
			}
		});	
	}
	
	hideTrait(trait){
    //this.loading.present();
		let trait_data = {
			traituniqueid: trait.trait_id,
			traitname: trait.traitname,
			traitgivenfor: '0'
		}
		this.traitService.hideTrait(trait_data, this.authToken).subscribe(data => {
			//this.loading.dismiss();
			if (data.status == 'success') {
				this.getTraitDetails(trait,this.authToken);
			}
		});
	}

	hideCount(trait){
    //this.loading.present();
		let trait_data = {
			traituniqueid: trait.trait_id,
			traitname: trait.traitname,
			traitgivenfor: '0'
		}
		this.traitService.hideTraitCount(trait_data, this.authToken).subscribe(data => {
			//this.loading.dismiss();
			if (data.status == 'success') {
				this.getTraitDetails(trait,this.authToken);
			}
		});
	}

	deleteTrait(trait){
    //this.loading.present();
		let trait_data = {
			traituniqueid: trait.trait_id,
			traitname: trait.traitname,
			traitgivenfor: '0'
		}
		this.traitService.deleteTrait(trait_data, this.authToken).subscribe(data => {
			//this.loading.dismiss();
			if (data.status == 'success') {
				this.getTraitDetails(trait,this.authToken);
			}
		});
	}
	
	sliderChange(trait){
		let trait_data = {
			traituniqueid: trait.trait_id,
			traitname: trait.traitname,
			traitgivenfor: '0',
			sliderValue: this.sliderValue,
		}
		this.traitService.customPoints(trait_data, this.authToken).subscribe(data => {
			if (data.status == 'success') {
				this.getTraitDetails(trait,this.authToken);
			}
		});
	}
	
	getTraitComments(trait){
		let trait_data = {
			comment: "string",
			commentId: 0,
			parentCommentId: 0,
			traitId: 405//trait.trait_id
		}
		this.traitService.commentList(trait_data, this.authToken).subscribe(data => {
			if (data.status == 'success') {
				console.log(data.response);
				this.comments = data.response
			}
		});
	}
	commentLikeDislike(commentId,likeDislike){
		console.log(commentId);
		let trait_data = {
			commentId: commentId,
			like: likeDislike
		}
		this.traitService.commentLikeDislike(trait_data, this.authToken).subscribe(data => {
			if (data.status == 'success') {
				alert(JSON.stringify(data));
				this.getTraitComments(this.trait)
			}
		});
	}
	

}
