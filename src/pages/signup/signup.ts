import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, ViewController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { OtpPage } from '../otp/otp';
import { NewOtpPage } from '../new-otp/new-otp';

import { AuthService } from '../../services/auth.service';
import { TraitService } from '../../services/traits.service';

@IonicPage()
@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html'
})
export class SignupPage {
	@ViewChild('fileInput') fileInput;
	public loading;
	isReadyToSave: boolean;
	item: any;
	form: FormGroup;
	
	passwordComplexity : string;
	retypePasswordMatch : string;

	constructor(
	public navCtrl: NavController, 
	public viewCtrl: ViewController, 
	formBuilder: FormBuilder,
	private authService: AuthService, 
	private traitService: TraitService, 
	private toastCtrl: ToastController,
	public modalCtrl: ModalController,
	private loadingCtrl: LoadingController
	) {
		this.form = formBuilder.group({
			profilePic: [''],
			fullname: ['', Validators.compose([Validators.minLength(3),Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
			emailaddress: ['',  Validators.compose([Validators.minLength(8),Validators.maxLength(50), Validators.required])],
			password: ['', Validators.compose([Validators.minLength(8),Validators.maxLength(15), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
			retypepassword: ['', Validators.compose([Validators.minLength(8),Validators.maxLength(15), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
			dateofbirth: ['', Validators.required],
			mobilenumber: ['', Validators.compose([Validators.minLength(8),Validators.maxLength(12), Validators.required])],
			gender: ['', Validators.required],
			countrycode: ['', Validators.required]
		});		
		this.form.valueChanges.subscribe((v) => {
			this.isReadyToSave = this.form.valid;
		});
		this.presentLoadingDefault();
	}

	presentLoadingDefault() {
		this.loading = this.loadingCtrl.create({spinner: 'bubbles'}); 
	}

	processWebImage(event) {
		let reader = new FileReader();
		reader.onload = (readerEvent) => {
			let imageData = (readerEvent.target as any).result;
			this.form.patchValue({ 'profilePic': imageData });
		};
		reader.readAsDataURL(event.target.files[0]);
	}

	getProfileImageStyle() {
		return 'url(' + this.form.controls['profilePic'].value + ')'
	}

	cancel() {
		this.viewCtrl.dismiss().catch(() => { }); 
	}

	done() {
		this.form.value.dateofbirth = '22/02/2017';
			if (this.form.value.emailaddress != '' && this.form.value.password != '' && this.form.value.retypepassword != '' && this.form.value.mobilenumber != '') {
				this.traitService.loading.present();
				this.authService.registerUser(this.form.value).subscribe(data => {
					this.traitService.loading.dismiss();
					if (data.status == 'success') {
						this.form.reset();
						this.traitService.presentSuccessToast('Please check your email for OTP');
						this.authService.saveToken(data.response.authtoken)
						this.navCtrl.setRoot(OtpPage);
					} else {
						this.traitService.presentSuccessToast('Failed to Registered!');
						alert(JSON.stringify(data.response));
					}
				});
		} else {
			this.traitService.presentSuccessToast('All Field Required');
		}
	}
	
	updatePass(){
		let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
		//console.log(this.form.value.password);
		this.passwordComplexity = "Invalid";
		let str = this.form.value.password
		if(str.length > 6 && str.match(/[a-z]/) && str.match(/[A-Z]/) && str.match(format)){
			this.passwordComplexity = "Valid password";
		}
		console.log(this.passwordComplexity);
	}
	
	updateRetypePass(){
		//console.log(this.form.value.retypepassword);
		this.retypePasswordMatch = "Didn't match";
		if(this.form.value.password === this.form.value.retypepassword){
			this.retypePasswordMatch = "password matched";
		}
		console.log(this.retypePasswordMatch);
	}
	
}

