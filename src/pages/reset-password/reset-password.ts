import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TraitService } from '../../services/traits.service';
import { AuthService } from '../../services/auth.service';
import { SlidesPage } from '../slides/slides';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {

  constructor(
	public formBuilder: FormBuilder,
	public navCtrl: NavController, 
	public traitService: TraitService,
	public authService: AuthService,  
	public navParams: NavParams) {
		this.form = formBuilder.group({
			password: ['', Validators.compose([Validators.minLength(8),Validators.maxLength(15), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
			retypepassword: ['', Validators.compose([Validators.minLength(8),Validators.maxLength(15), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			otp: ['', Validators.required]
		});	
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }
  
  submitDetails(){
	  if (this.form.value.password != '' && this.form.value.retypepassword != '' && this.form.value.otp != '') {
			this.traitService.showLoading();
			this.authService.passwordretrievalidateotp(this.form.value).subscribe(data => {
				this.traitService.hideLoading();
				this.traitService.presentSuccessToast(data.message);
				this.navCtrl.setRoot('LoginPage');
			})
	  } else {
			this.traitService ? this.traitService.presentSuccessToast('All Field Required') : null;
		}
  }

}
