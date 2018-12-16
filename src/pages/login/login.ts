import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { SlidesPage } from '../slides/slides';
import { AuthService } from '../../services/auth.service';
import { TraitService } from '../../services/traits.service';
import { Facebook } from '@ionic-native/facebook';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	form: FormGroup;
	private isLoggedIn:boolean = false;
	private users: any;
	public loading;

  constructor(
	  private authService: AuthService, 
	  private traitService: TraitService, 
	  private loadingCtrl: LoadingController, 
	  public navCtrl: NavController, 
	  public navParams: NavParams, 
	  public formBuilder: FormBuilder, 
	  private fb: Facebook
	) {
		this.form = formBuilder.group({
			emailaddress: ['', Validators.compose([Validators.minLength(8),Validators.maxLength(50), Validators.required])],
			password: ['', Validators.compose([Validators.minLength(8), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}'), Validators.required])]
		});

		fb.getLoginStatus()
		.then(res => {
			if(res.status === "connect") {
				this.isLoggedIn = true;
			} else {
				this.isLoggedIn = false;
			}
		})
		.catch(e => console.log(e));
		this.presentLoadingDefault();
	}

	presentLoadingDefault() {
		this.loading = this.loadingCtrl.create({ spinner: 'bubbles' });
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
		.catch(e => alert(JSON.stringify(e)));
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
		
		this.navCtrl.push('SignupPage');
    // let addModal = this.modalCtrl.create('SignupPage');
    // addModal.onDidDismiss(() => {
    //   return false;
    // });
    // addModal.present();
  }

  resendOTP() {
    this.navCtrl.push('ResendOtpPage');
  }


  forgotPassword() {
    this.navCtrl.push('ForgotPasswordPage');
  }

	login() {
		if (this.form.value.emailaddress != "" || this.form.value.password != "") {
		this.traitService.showLoading;
			this.presentLoadingDefault();
			this.loading.present();
			this.authService.loginUser(this.form.value).subscribe(data => {

				this.traitService.hideLoading();
			this.loading.dismiss();

				if (data.status == 'success') {
			this.traitService.presentSuccessToast('Login Successful!');
			this.authService.saveToken(data.auth_token);
			this.navCtrl.setRoot('SlidesPage');
				} else {
					this.traitService.presentSuccessToast(data.message);
					//this.traitService.presentSuccessToast(data.passowrd);
				}
			});
		} else {
			this.traitService.presentSuccessToast('Failed to login !');
		}
	}
  onInputBlue(event){
	  console.log(event);
  }

}
