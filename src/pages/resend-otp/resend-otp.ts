import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-resend-otp',
  templateUrl: 'resend-otp.html',
})
export class ResendOtpPage {
  form: FormGroup;

  constructor(private authService: AuthService, public navCtrl: NavController,private toastCtrl: ToastController, public navParams: NavParams,formBuilder: FormBuilder) {
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
			this.presentSuccessToast('OTP sent to your email');
		} else {
		this.presentSuccessToast('Failed to generate OTP!');
		}
		});
    } else {
     this.presentSuccessToast('All Field Required');
    }
  }

  presentSuccessToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present(); 
  }

}
