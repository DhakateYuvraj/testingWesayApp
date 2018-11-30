import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController,ViewController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { TraitService } from '../../services/traits.service';

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {
	form: FormGroup;
	public regPageParam;
	constructor(
	private authService: AuthService, 
	private traitService: TraitService, 
	public navCtrl: NavController,
	private toastCtrl: ToastController, 
	public navParams: NavParams,
	formBuilder: FormBuilder,
	public viewCtrl: ViewController
	){
		this.form = formBuilder.group({
			otp: [''],
		});
		this.regPageParam = navParams.get('regPageData');
		console.log(this.regPageParam.emailaddress);
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpPage');
  }
  
  valuateOtp(){
	 if (this.form.value.otp != "") { 
		this.authService.valuateOtp(this.form.value).subscribe(data => {
		//alert(JSON.stringify(data))
		if (data.status == 'success') {
			this.form.reset();
			this.traitService.presentSuccessToast('Welcome to weSay');
			//this.authService.saveToken(data.auth_token)
			this.navCtrl.setRoot('SlidesPage'); 
		} else {
		this.traitService.presentSuccessToast(data.message);
		}
		});
    } else {
     this.traitService.presentSuccessToast('All Field Required');
    }
  }
  
  resendOTP(){
		let reqPayload = {"emailaddress":this.regPageParam.emailaddress} 
		this.authService.resendOTP(reqPayload).subscribe(data => {
			if (data.status == 'success') {
				this.form.reset();
				this.traitService.presentSuccessToast('Please check your email for OTP');
			} else {
				this.traitService.presentSuccessToast(data.message);
			}
		});

  }

  cancel() {
    this.viewCtrl.dismiss().catch(() => { }); 
  }
}
