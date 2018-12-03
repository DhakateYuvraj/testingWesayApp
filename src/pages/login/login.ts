import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';
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
	  private toastCtrl: ToastController, 
	  public navCtrl: NavController, 
	  public navParams: NavParams, 
	  public formBuilder: FormBuilder, 
	  public modalCtrl: ModalController,
	  private loadingCtrl: LoadingController, 
	  private fb: Facebook
	) {
		this.form = formBuilder.group({
			emailaddress: ['', Validators.compose([Validators.minLength(8),Validators.maxLength(50), Validators.required])],
			password: ['', Validators.compose([Validators.minLength(8),Validators.maxLength(15), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])]
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
    let addModal = this.modalCtrl.create('SignupPage');
    addModal.onDidDismiss(() => {
      return false;
    });
    addModal.present();
  }

  resendOTP() {
    this.navCtrl.push('ResendOtpPage');
  }


  forgotPassword() {
    this.navCtrl.push('ForgotPasswordPage');
  }

	login() {
	//alert(0);
	//alert(1);
	//alert(this.form.value.emailaddress);
	//alert(this.form.value.password);
		if (this.form.value.emailaddress != "" || this.form.value.password != "") {
		this.traitService.showLoading;
			this.presentLoadingDefault();
			this.loading.present();
	//alert(2);
	//alert(JSON.stringify(this.form.value));
			this.authService.loginUser(this.form.value).subscribe(data => {

				this.traitService.hideLoading();
			this.loading.dismiss();

				if (data.status == 'success') {
			this.traitService.presentSuccessToast('login Successfully !');
			this.authService.saveToken(data.auth_token);
			this.navCtrl.setRoot('SlidesPage');
				} else {
				
	//alert(8);
					this.traitService.presentSuccessToast(data.email);
					this.traitService.presentSuccessToast(data.passowrd);
				}
			});
		} else {
		//alert(9);
			this.traitService.presentSuccessToast('Failed to login !');
		}
		//alert(10);
	}
  onInputBlue(event){
	  console.log(event);
  }

}
