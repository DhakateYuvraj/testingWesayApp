import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {
  feedbackForm: FormGroup;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder) {
      this.feedbackForm = formBuilder.group({
        likeConcept: "",
        isFriendly: "",
        whatYouLikeMost:"",
        isBuggy:"",
        performance:"",
        recommendToFrd:"",
        NewFeaturesToSee:"",
        otherSuggestions:""
      });	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');
  }

  sendFeedback(){
    console.log();
  }




}
