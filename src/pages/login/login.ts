import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { SlidesPage } from '../slides/slides';
import { AuthService } from '../../services/auth.service';
import { Facebook } from '@ionic-native/facebook';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	form: FormGroup;
	private isLoggedIn:boolean = false;
	private users: any;

  constructor(
	  private authService: AuthService, 
	  private toastCtrl: ToastController, 
	  public navCtrl: NavController, 
	  public navParams: NavParams, 
	  public formBuilder: FormBuilder, 
	  public modalCtrl: ModalController,
	  private fb: Facebook
	) {
		this.form = formBuilder.group({
			emailaddress: ['', Validators.compose([Validators.minLength(8),Validators.maxLength(50), Validators.required])],
			password: ['', Validators.compose([Validators.minLength(8),Validators.maxLength(15), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])]
		});

		fb.getLoginStatus()
		.then(res => {
			alert("getLoginStatus----->"+JSON.stringify(res));
			console.log(res.status);
			if(res.status === "connect") {
				this.isLoggedIn = true;
			} else {
				this.isLoggedIn = false;
			}
		})
		.catch(e => console.log(e));
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
		//.loginContainer console.log(window.screen.height*0.9);
	}
  
	facebookLogin() {
		this.fb.login(['public_profile', 'user_friends', 'email'])
		.then(res => {
			alert('facebookLogin===>'+JSON.stringify(res))
			if(res.status === "connected") {
				this.isLoggedIn = true;
				this.getUserDetail(res.authResponse.userID);
			} else {
				this.isLoggedIn = false;
			}
		})
		.catch(e => console.log('Error logging into Facebook', e));
	}

	getUserDetail(userid) {
		this.fb.api("/"+userid+"/?fields=id,email,name,picture,gender",["public_profile"])
		.then(res => {
			alert('getUserDetail--->'+JSON.stringify(res));
			this.users = res;
		})
		.catch(e => {
			console.log(e);
		});
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
          this.presentSuccessToast(data.message);
        }
      });
    } else {
      this.presentSuccessToast('Failed to login !');
    }
  }
  onInputBlue(event){
	  console.log(event);
  }

  presentSuccessToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}
