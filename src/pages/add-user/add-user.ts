import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, ViewController, ModalController, ToastController } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TraitService } from '../../services/traits.service';

@IonicPage()
@Component({
	selector: 'page-add-user',
	templateUrl: 'add-user.html',
})

export class AddUserPage {
	@ViewChild('fileInput') fileInput;
	isReadyToSave: boolean;
	item: any;
	form: FormGroup;
	constructor(
	public navCtrl: NavController, 
	public viewCtrl: ViewController, 
	formBuilder: FormBuilder,
	public authService: AuthService, 
	public traitService: TraitService, 
	public toastCtrl: ToastController,
	public modalCtrl: ModalController
	){
		this.form = formBuilder.group({
		fullname: ['', Validators.required],
		emailaddress: ['', Validators.required],
		mobilenumber: ['', Validators.required],
		countrycode : '91'
		});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AddUserPage');
	}

	addUser(){
		if (this.form.value.emailaddress != '' && this.form.value.fullname != '' && this.form.value.mobilenumber != '') {
			this.traitService.showLoading();
			this.authService.addUser([this.form.value]).subscribe(data => {
				console.log(data); 
				this.traitService.hideLoading();
				if (data.status == 'success') {
					this.form.reset();
					this.traitService.presentSuccessToast('user added');
					this.viewCtrl.dismiss().catch(() => { });
				} else {
					this.traitService.presentSuccessToast('Failed to add!');
				}
			});
		}else{
			alert('Error');
		}
	}
	
}
