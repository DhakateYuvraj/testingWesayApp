import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-resend-otp',
  templateUrl: 'resend-otp.html',
})
export class ResendOtpPage {

  public email;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResendOtpPage');
  }

  resendOTP(email) {
    this.authService.resendOTP(email).subscribe(data => {
      if (data.status == 'success') {
        this.navCtrl.push('OtpPage');
      } else {
        alert(JSON.stringify(data));
      }
    });
  }

}
