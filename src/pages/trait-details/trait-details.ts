import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
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
	public comments;
	public newComment;
	public newReplyComment = ""
	public replyTo = 0
	public profileId;
	public frdInfo;
	public newTrait = false;
	public frdId;
	public frdProfile ;
	
	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				private storage: Storage, 
				private traitService: TraitService, 
				public popoverCtrl: PopoverController){
					
		this.trait = navParams.get('trait');
		this.frdInfo = navParams.get('frdInfo');
		
		if(!this.trait){
			this.trait= {
				"traitid": null,
				"traitname": "Extroverted",
				"traituniqueid": "0",
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
		
		if (this.frdInfo !== undefined && this.frdInfo.id) {
			this.frdId = this.frdInfo.id;
			this.profileId = { id: this.frdId };
			this.frdProfile = true;
		}else{
			this.frdId = 0;
			this.profileId = null;
			this.frdProfile = false;
			this.frdInfo = {fullname : "MyName Dont hv Data"}
		}
		this.getUserProfile(this.frdId)
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
		let trait_data = {
			"userTraitId" : trait.usertraitid
		}
		this.traitService.getTraitDetails(trait_data, this.authToken).subscribe(data => {
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
	
	sliderChange(trait,scoreClicked){
		this.sliderValue = scoreClicked
		let trait_data = {
			userTraitId : trait.traitid,
			traitIdentifier: trait.traituniqueid,
			rating: this.sliderValue,
		}
		this.traitService.customPoints(trait_data, this.authToken).subscribe(data => {
			alert(JSON.stringify(data));
			if (data.status == 'success') {
				this.getTraitDetails(trait,this.authToken);
			}
		});
	}
	
	getTraitComments(trait){
		let trait_data = {
			comment: "string",
			traitId: trait.traitid,
			traitIdentifier: trait.traituniqueid
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
	addNewComment(){
		let trait_data = {
			comment: this.newComment,
			traitId: this.trait.traitid,
			traitIdentifier: this.trait.traituniqueid
		}
		this.traitService.commentAdd(trait_data, this.authToken).subscribe(data => {
			if (data.status == 'success') {
				this.newComment=null
				this.getTraitComments(this.trait)
			}
		});
	}
	
	replyToComment(commentId){
		if(this.replyTo === commentId){
			this.replyTo = 0;
		}else{
			this.replyTo = commentId
		}
	}
	
	addNewReplyComment(commentId){
		let trait_data = {
			comment: this.newReplyComment,
			traitId: commentId
		}
		this.traitService.commentReply(trait_data, this.authToken).subscribe(data => {
			alert(JSON.stringify(data));
			if (data.status == 'success') {
				alert(JSON.stringify(data));
				this.getTraitComments(this.trait)
			}
		});
	}
	presentPopover(myEvent) {
		let popover = this.popoverCtrl.create('TraitDetailsMenuPage',{trait:this.trait,traitDetails:this.traitDetails});
		popover.present({
			ev: myEvent
		});
	}
	
	giveVoteToFriend(trait, typeofvote) {
		let id;
		if (this.profileId == null || this.profileId == undefined) {
			id = 0;
		} else {
			id = this.profileId.id;
		}
		let data = {
			traitIdentifier : trait.traituniqueid,
			traitId : trait.traitid,
			vote : typeofvote,
			modeOfVote : 0 //[1 = Anonymous, 0 = Public ]
		}	
		this.traitService.giveVote(data, this.authToken).subscribe(data => {
			if (data.status != "error") {
				this.getTraitDetails(trait,this.authToken);
			}
		})
	}
	
	getUserProfile(frdId){
		let data = {
			id:frdId
		}
		this.traitService.getUserProfile(data, this.authToken).subscribe(data => {
		//alert(JSON.stringify(data));
		  if (data.status != "error") {
			this.frdInfo = data.response
		  }
		})
	}
	
	acceptTrait(status){
		alert(status);
	}
}
