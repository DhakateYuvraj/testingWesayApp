import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { TraitService } from '../../services/traits.service';

@IonicPage()
@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html',
})
export class SettingsPage {
	public authToken: any;
	public settingData : any;
	public onlyMyContact: any;
	public noCount: any;
	public askMe: any;
	public WhoCanSee: any;  
	public obja = {};



	constructor(
	public navCtrl: NavController, 
	public navParams: NavParams, 
	private traitService: TraitService,
	private storage: Storage,
	public modalCtrl: ModalController
	){
		this.storage.get('token').then((token) => {
			this.authToken = token;
			this.getSettings(token);
		});
	}
	
	getSettings(token) {
		this.traitService.showLoading();
		this.traitService.getSettings(token).subscribe(data => {
			this.settingData = data.response;
			/*for (var i = 0; i < this.settingData.length; i++) {
				if(this.settingData[i].categoryname == 'Only allow my contacts to give me feedback'){
					this.onlyMyContact = this.settingData[i].categoryvalue;
				}else if(this.settingData[i].categoryname == 'Show my traits without showing counts'){
					this.noCount = this.settingData[i].categoryvalue;
				}else if(this.settingData[i].categoryname == 'Ask me before publishing a new trait on my page'){
					this.askMe = this.settingData[i].categoryvalue;
				}else if(this.settingData[i].categoryname == 'Control who can see my page'){
					this.WhoCanSee = this.settingData[i].categoryvalue;
				}
			}*/
			this.traitService.hideLoading();
		});
	}
	
	settingChange(settingObj){
		this.traitService.showLoading();
		settingObj.categoryvalue = settingObj.categoryvalue ? 1 : 0;
		this.traitService.updateSettings(this.authToken,settingObj).subscribe(data => {
			this.traitService.hideLoading();
			if(data.status == 'success'){
				this.traitService.presentSuccessToast('Setting update successfuly');
			}else{
				for (var i = 0; i < this.settingData.length; i++) {
					if(this.settingData[i].uniqueid == settingObj.uniqueid){
						//this.settingData[i].categoryvalue = !this.settingData[i].categoryvalue;
					}
				}
			}
		});
	}

}
