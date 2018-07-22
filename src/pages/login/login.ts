import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { SlidesPage } from '../slides/slides';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  form: FormGroup;
  //private contactlist: any[]; 

  constructor(private authService: AuthService, private toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder, public modalCtrl: ModalController) {
    this.form = formBuilder.group({
      emailaddress: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  navToSignup() {
    let addModal = this.modalCtrl.create('SignupPage');
    addModal.onDidDismiss(() => {
      return false;
    });
    addModal.present();
  }

  resendOTP() {
    this.navCtrl.push('ResendOtpPage');
  }

  login() {
    if (this.form.value.emailaddress != "" || this.form.value.password != "") {
      this.authService.loginUser(this.form.value).subscribe(data => {
        //console.log(data);
        if (data.status == 'success') {
          this.form.reset();
          this.presentSuccessToast('login Successfully !');
          this.authService.saveToken(data.auth_token)
          this.navCtrl.setRoot(SlidesPage);
        } else {
          this.presentSuccessToast('Failed to login !');
        }
      });
    } else {
      this.presentSuccessToast('Username and Password Required');
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
