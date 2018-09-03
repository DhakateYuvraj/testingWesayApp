import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, ViewController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { OtpPage } from '../otp/otp';

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

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder,
    private authService: AuthService, private toastCtrl: ToastController,public modalCtrl: ModalController,private loadingCtrl: LoadingController) {
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

    // Watch the form for changes, and
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
				this.loading.present();
				this.authService.registerUser(this.form.value).subscribe(data => {
					//alert(JSON.stringify(data); 
					this.loading.dismiss();
					if (data.status == 'success') {
						this.form.reset();
						this.presentSuccessToast('Please check your email for OTP');
						this.authService.saveToken(data.response.authtoken)
						this.navCtrl.setRoot(OtpPage);
					} else {
						this.presentSuccessToast('Failed to Registered!');
						alert(JSON.stringify(data.response));
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

}

