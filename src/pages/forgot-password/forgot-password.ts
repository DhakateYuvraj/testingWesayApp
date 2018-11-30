import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TraitService } from '../../services/traits.service';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
	form: FormGroup;

  constructor( 
	public formBuilder: FormBuilder,
	public navCtrl: NavController, 
	public traitService: TraitService,
	public authService: AuthService,  
	public navParams: NavParams) {
		this.form = formBuilder.group({
			emailaddress: ['',  Validators.compose([Validators.minLength(8),Validators.maxLength(50), Validators.required])]
		});	
	}
	

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  submitEmail(){
	if (this.form.value.emailaddress != '') {
		this.traitService.showLoading();
		this.authService.forgotpasswordviaemail(this.form.value).subscribe(data => {
			this.traitService.hideLoading();
			if (data.status == 'success') {
				this.traitService.presentSuccessToast('Please check your email for OTP');
				this.authService.saveToken(data.auth_token);
				this.navCtrl.push('ResetPasswordPage');
			} else {
				this.traitService.presentSuccessToast(data.message);
				//alert(JSON.stringify(data.response));
			}
		});
	} else {
		this.traitService ? this.traitService.presentSuccessToast('All Field Required') : null;
	}

  }
  
}
