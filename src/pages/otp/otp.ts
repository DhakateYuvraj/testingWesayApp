import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController,ViewController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {
  form: FormGroup;

  constructor(private authService: AuthService, public navCtrl: NavController,private toastCtrl: ToastController, public navParams: NavParams,formBuilder: FormBuilder,public viewCtrl: ViewController) {
	  	  this.form = formBuilder.group({
			otp: [''],
	  });
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
			this.presentSuccessToast('Welcome to weSay');
			//this.authService.saveToken(data.auth_token)
			this.navCtrl.setRoot('SlidesPage'); 
		} else {
		this.presentSuccessToast(data.message);
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
      position: 'top'
    });
    toast.present(); 
  }

  cancel() {
    this.viewCtrl.dismiss().catch(() => { }); 
  }
}
