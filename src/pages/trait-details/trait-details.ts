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
	public authToken;
	public publicVotes
	public traitDetails;
	public sliderValue = 5;
	public comments = [];
	public newComment;
	public newReplyComment = ""
	public replyTo = 0
	public profileId;
	public frdInfo;
	public newTrait = false;
	public frdId;
	public frdProfile ;
	public isAnonymous;
	public myRatingRound;
	public showCount = true;
	
	constructor(public navCtrl: NavController, 
				public navParams: NavParams, 
				private storage: Storage, 
				private traitService: TraitService, 
				public popoverCtrl: PopoverController){
					
		this.traitDetails = navParams.get('trait');
		this.frdInfo = navParams.get('frdInfo');
		this.isAnonymous = navParams.get('isAnonymous');
		
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
		//this.getUserProfile(this.frdId)
	}	


  ionViewDidLoad() {
    console.log('ionViewDidLoad TraitDetailsPage');
  }
  
	ionViewWillEnter() {
		this.storage.get('token').then((token) => {
			this.authToken = token;
			this.getTraitDetails(this.traitDetails,this.authToken);
			this.getTraitComments(this.traitDetails);
			this.getUserProfile(this.frdId)
		});
	}
	
	getTraitDetails(trait,token){
		if(trait){
			let taitId = trait.usertraitid ? trait.usertraitid : trait.userTraitId;
			let trait_data = {
				"userTraitId" : taitId,
				"userId":this.frdId
			}
			this.traitService.getTraitDetails(trait_data, this.authToken).subscribe(data => {
				console.log(JSON.stringify(data.response));
				if (data.status == 'success') {
					this.traitDetails = data.response.userTraitDetailsResponsePojo;
					this.myRatingRound = this.traitDetails.rating;
					this.publicVotes = data.response.publicVotes;
					if(this.frdProfile && this.traitDetails.isTraitCountHidden){
						this.showCount = false
					}
				}else{
					alert('Error');
				}
			});	
		}
	}
	getTraitData(param){
		this.getTraitDetails(this.traitDetails,this.authToken)
		if(param && param == "back"){
			this.navCtrl.pop();
		}
	}
	getTraitComments(trait){
		if(trait){
			this.comments=[];
			let trait_data = {
				//comment: "string",
				//traitIdentifier: trait.traituniqueid,
				userTraitId : trait.usertraitid ? trait.usertraitid : trait.userTraitId
			}
			this.traitService.commentList(trait_data, this.authToken).subscribe(data => {
				if (data.status == 'success') {
					//console.log(data.response);
					/*
					data.response.map(singleComment => {
						console.log(singleComment);
						singleComment.commentDate = this.traitService.calcuateTime(singleComment.commentDate)
						this.comments.push(singleComment)
					})
					*/
					this.comments = data.response
				}
			});
		}
	}
	
	sliderChange(trait,scoreClicked){
		if(trait){
			this.sliderValue = scoreClicked
			let trait_data = {
				userTraitId : trait.usertraitid ? trait.usertraitid : trait.userTraitId,
				traitIdentifier: trait.traituniqueid ? trait.traituniqueid : trait.traitUniqueid,
				isAnonymous: this.traitService.isAnonymousMode() ? 1 : 0,
				rating: this.sliderValue
			}
			this.traitService.customPoints(trait_data, this.authToken).subscribe(data => {
				//alert(JSON.stringify(data));
				if (data.status == 'success') {
					this.getTraitDetails(trait,this.authToken);
				}
			});
		}
	}
	
	commentLikeDislike(commentId,likeDislike){
		console.log(commentId);
		let trait_data = {
			commentId: commentId,
			like: likeDislike,			
			userTraitId : this.traitDetails.usertraitid ? this.traitDetails.usertraitid : this.traitDetails.userTraitId,
			traitIdentifier: this.traitDetails.traituniqueid ? this.traitDetails.traituniqueid : this.traitDetails.traitUniqueid,
		}
		this.traitService.commentLikeDislike(trait_data, this.authToken).subscribe(data => {
			if (data.status == 'success') {
				//alert(JSON.stringify(data));
				this.getTraitComments(this.traitDetails)
			}
		});
	}
	addNewComment(parentCommentId){
		this.replyTo = parentCommentId ? parentCommentId : 0;
		let trait_data = {
			comment: this.newComment ? this.newComment : this.newReplyComment,
			userTraitId: this.traitDetails.usertraitid ? this.traitDetails.usertraitid : this.traitDetails.userTraitId,
			parentCommentId: this.replyTo,
			traitIdentifier: this.traitDetails.traituniqueid ? this.traitDetails.traituniqueid : this.traitDetails.traitUniqueid
		}
		this.traitService.commentAdd(trait_data, this.authToken).subscribe(data => {
			if (data.status == 'success') {
				this.newComment="";
				this.newReplyComment="";
				this.getTraitComments(this.traitDetails);
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

	presentPopover(myEvent) {
		let popover = this.popoverCtrl.create('TraitDetailsMenuPage',{traitDetails:this.traitDetails,homeRef: this,readOnly:false});
		popover.present({
			ev: myEvent
		});
	}
	infoPopover(myEvent) {
		let popover = this.popoverCtrl.create('TraitDetailsMenuPage',{traitDetails:this.traitDetails,homeRef: this,readOnly:true});
		popover.present({
			ev: myEvent
		});
	}
	
	giveVoteToFriend(trait, typeofvote) {
		let data = {
			isAnonymous: this.traitService.isAnonymousMode() ? 1 : 0,
			traitIdentifier: trait.traitUniqueid,
			userTraitId: trait.userTraitId,
			voteType: typeofvote			
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
			this.frdInfo = data.response;
			this.frdInfo.frdId = 0;
			this.frdId = 0;
		  }
		})
	}
	
	acceptTrait(status){
		alert(status);
	}
}
