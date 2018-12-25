import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from "@ionic/storage";
import { TraitService } from '../../services/traits.service';


@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {
  feedbackForm: FormGroup;
  private authToken;
  
  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams,
    private formBuilder: FormBuilder,
	private traitService: TraitService,
	private storage: Storage) {
      this.feedbackForm = formBuilder.group({
        likeConcept: "",
		helpYouselfOptions:"",
		helpYouselfText:"",
        isFriendly: "",
        whatYouLikeMost:"",
        isBuggy:"",
		isBuggyText:"",
        performance:"",
        recommendToFrd:"",
        NewFeaturesToSee:"",
        otherSuggestions:""
      });

		this.storage.get('token').then((token) => {
			this.authToken = token;
		});	  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');
  }

	sendFeedback(){
		if(this.feedbackForm.value.likeConcept  ||
			this.feedbackForm.value.helpYouselfOptions ||
			this.feedbackForm.value.helpYouselfText ||
			this.feedbackForm.value.isFriendly ||
			this.feedbackForm.value.whatYouLikeMost ||
			this.feedbackForm.value.isBuggy ||
			this.feedbackForm.value.isBuggyText ||
			this.feedbackForm.value.performance ||
			this.feedbackForm.value.recommendToFrd ||
			this.feedbackForm.value.NewFeaturesToSee ||
			this.feedbackForm.value.otherSuggestions
			){
			this.traitService.showLoading();
			let feedbackFormObj = {
				"q1": this.feedbackForm.value.likeConcept ? this.feedbackForm.value.likeConcept: null,
				"q2": [this.feedbackForm.value.helpYouselfOptions ? this.feedbackForm.value.helpYouselfOptions : null,this.feedbackForm.value.helpYouselfText ? this.feedbackForm.value.helpYouselfText : null],
				"q3": this.feedbackForm.value.isFriendly ? this.feedbackForm.value.isFriendly : null,
				"q4": this.feedbackForm.value.whatYouLikeMost ? this.feedbackForm.value.whatYouLikeMost : null,
				"q5": [this.feedbackForm.value.isBuggy ? this.feedbackForm.value.isBuggy : null,this.feedbackForm.value.isBuggyText ? this.feedbackForm.value.isBuggyText : null],
				"q6": this.feedbackForm.value.performance ? this.feedbackForm.value.performance : null,
				"q7": this.feedbackForm.value.recommendToFrd ? this.feedbackForm.value.recommendToFrd : null,
				"q8": this.feedbackForm.value.NewFeaturesToSee ? this.feedbackForm.value.NewFeaturesToSee : null,
				"q9": this.feedbackForm.value.otherSuggestions ? this.feedbackForm.value.otherSuggestions : null
			};
			this.traitService.saveFeedback(this.authToken,feedbackFormObj).subscribe(data => {
				console.log(data.response);
				if(data.status == "success"){
					this.traitService.presentSuccessToast('Thank you!');
				}else{
					this.traitService.presentSuccessToast('Error!!! Please try again.');
				}
				this.traitService.hideLoading();
			});
		}else{
			this.traitService.presentSuccessToast('Please fill the form.');
		}
	}




}
