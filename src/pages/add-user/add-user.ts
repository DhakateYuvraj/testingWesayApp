import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, ViewController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';

/**
 * Generated class for the AddUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-user',
  templateUrl: 'add-user.html',
})
export class AddUserPage {
  @ViewChild('fileInput') fileInput;
  public loading;

  isReadyToSave: boolean;
  item: any;
  form: FormGroup;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder,
    private authService: AuthService, private toastCtrl: ToastController,public modalCtrl: ModalController,private loadingCtrl: LoadingController) {
	this.form = formBuilder.group({
		fullname: ['', Validators.required],
		emailaddress: ['', Validators.required],
		mobilenumber: ['', Validators.required],
		countrycode : '91'
	});
    this.presentLoadingDefault();
  }

  
  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({spinner: 'bubbles'}); 
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddUserPage');
  }

  addUser(){
	  if (this.form.value.emailaddress != '' && this.form.value.fullname != '' && this.form.value.mobilenumber != '') {
	  
		  
		this.loading.present();
		this.authService.addUser([this.form.value]).subscribe(data => {
		console.log(data); 
		this.loading.dismiss();
		if (data.status == 'success') {
		this.form.reset();
		this.presentSuccessToast('user added');
		this.viewCtrl.dismiss().catch(() => { });
		} else {
		this.presentSuccessToast('Failed to add!');
		}
		});

	  }else{
		  alert('Error');
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
