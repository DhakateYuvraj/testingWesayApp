import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { TraitService } from '../../services/traits.service';

@IonicPage()
@Component({
  selector: 'page-resend-otp',
  templateUrl: 'resend-otp.html',
})
export class ResendOtpPage {
  form: FormGroup;

  constructor(
  public authService: AuthService, 
  public traitService: TraitService, 
  public navCtrl: NavController,
  public toastCtrl: ToastController,
  public viewCtrl: ViewController, 
  public navParams: NavParams,
  formBuilder: FormBuilder) {
	  	  this.form = formBuilder.group({
			email: [''],
	  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpPage');
  }
  
  submitEmail(){
	 if (this.form.value.email != "") { 
		this.authService.resendOTP(this.form.value).subscribe(data => {
		//alert(JSON.stringify(data))
		if (data.status == 'success') {
			this.form.reset();
			this.traitService.presentSuccessToast('OTP sent to your email');
		} else {
		this.traitService.presentSuccessToast('Failed to generate OTP!');
		}
		});
    } else {
     this.traitService.presentSuccessToast('All Field Required');
    }
  }
  
  cancel() {
    this.viewCtrl.dismiss().catch(() => { }); 
  }

}
