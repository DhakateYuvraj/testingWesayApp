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
	public comments;
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
		this.getUserProfile(this.frdId)
	}	


  ionViewDidLoad() {
    console.log('ionViewDidLoad TraitDetailsPage');
  }
  
	ionViewWillEnter() {
		this.storage.get('token').then((token) => {
			this.authToken = token;
			this.getTraitDetails(this.traitDetails,this.authToken);
			this.getTraitComments(this.traitDetails);
		});
	}
	
	getTraitDetails(trait,token){
		let taitId = trait.usertraitid ? trait.usertraitid : trait.userTraitId;
		let trait_data = {
			"userTraitId" : taitId
		}
		this.traitService.getTraitDetails(trait_data, this.authToken).subscribe(data => {
			console.log(JSON.stringify(data.response));
			if (data.status == 'success') {
				this.traitDetails = data.response.userTraitDetailsResponsePojo;
				this.myRatingRound = this.traitDetails.rating;
				this.publicVotes = data.response.publicVotes;
			}else{
				alert('Error');
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
	
	commentLikeDislike(commentId,likeDislike){
		console.log(commentId);
		let trait_data = {
			commentId: commentId,
			like: likeDislike
		}
		this.traitService.commentLikeDislike(trait_data, this.authToken).subscribe(data => {
			if (data.status == 'success') {
				alert(JSON.stringify(data));
				this.getTraitComments(this.traitDetails)
			}
		});
	}
	addNewComment(){
		let trait_data = {
			comment: this.newComment,
			traitId: this.traitDetails.userTraitId,
			traitIdentifier: this.traitDetails.traitUniqueid
		}
		this.traitService.commentAdd(trait_data, this.authToken).subscribe(data => {
			if (data.status == 'success') {
				this.newComment=null
				this.getTraitComments(this.traitDetails)
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
				this.getTraitComments(this.traitDetails)
			}
		});
	}
	presentPopover(myEvent) {
		let popover = this.popoverCtrl.create('TraitDetailsMenuPage',{trait:this.traitDetails,traitDetails:this.traitDetails});
		popover.present({
			ev: myEvent
		});
	}
	
	giveVoteToFriend(trait, typeofvote) {
		let data = {			
			isAnonymous: this.isAnonymous ? 1 : 0,
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
			this.frdInfo = data.response
		  }
		})
	}
	
	acceptTrait(status){
		alert(status);
	}
}
