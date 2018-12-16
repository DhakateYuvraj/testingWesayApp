import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController  } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { TraitService } from '../../services/traits.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {
	public authToken;
	public profileData ={
		"location":null,
		"profession":null,
		"workAtStudiesIn":null,
		"aboutMe":null,
		"mywebsite":null,
		"gender":null
	};
	public frdId = 0;
	
    public photos
	public base64Image
	
	constructor(
		public camera: Camera,
		public storage: Storage, 
		public navCtrl: NavController, 
		public traitService: TraitService, 
		public navParams: NavParams,
		public actionsheetCtrl: ActionSheetController,
		public crop: Crop) {
			this.frdId = navParams.get('frdId') ? navParams.get('frdId') : 0;
		}


	ionViewWillEnter() {
		this.storage.get('token').then((token) => {
			this.authToken = token;
			this.getProfileData(this.frdId);
		});		
	}
	
	ionViewDidLoad() {
		console.log('ionViewDidLoad MyProfilePage');
	}
	
	getProfileData(friendId){
		this.traitService.showLoading();
		this.traitService.getProfileData(this.authToken, {"userid":friendId}).subscribe(data => {
			this.profileData = data
			this.traitService.hideLoading();
		});
	}
	
	updateMyProfile(){
		let profileData = {
			"location":this.profileData.location,
			"profession":this.profileData.profession,
			"workAtStudiesIn":this.profileData.workAtStudiesIn,
			"aboutMe":this.profileData.aboutMe,
			"mywebsite":this.profileData.mywebsite,
			"gender":this.profileData.gender
		}
		this.traitService.showLoading();
		this.traitService.updateMyProfile(this.authToken, profileData).subscribe(data => {
			this.traitService.hideLoading();
		});
	}
	
	back(){
		this.navCtrl.pop();
	}
	
	openeditprofile() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Option',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Take photo',
          role: 'destructive',
          icon: 'ios-camera-outline',
          handler: () => {
            this.captureImage(false);
          }
        },
        {
          text: 'Choose photo from Gallery',
          icon:'ios-images-outline',
          handler: () => {
            this.captureImage(true);
          }
        },
      ]
    });
    actionSheet.present();
  }


  captureImage(useAlbum: boolean) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      ...useAlbum ? {sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM} : {}
    }

	this.camera.getPicture(options).then((imageData) => {
		//this.base64Image = 'data:image/jpeg;base64,' + imageData;
		this.crop.crop(imageData, {quality: 75})
		.then(
			newImage => {this.base64Image = 'data:image/jpeg;base64,' + newImage; },
			error => console.error('Error cropping image', error)
		);
	}, (err) => {
		alert(JSON.stringify(err))
	});

  }
  
}
