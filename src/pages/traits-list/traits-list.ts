import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FormControl } from '@angular/forms';
//import { ProfilePage } from '../profile/profile';

import { TraitService } from '../../services/traits.service';

@IonicPage()
@Component({
  selector: 'page-traits-list',
  templateUrl: 'traits-list.html',
})
export class TraitsListPage {
  tabBarElement: any;
  @ViewChild('searchInput') myInput;
  searchControl: FormControl; 
  search_string;

  public loading;

  allTraitsData = [];
  traitsMasterList = [];

  selectedTraits = [];

  segment: string = "positive";
  i: any = 0;

  search_Pos;
  authToken;
  userId;
  dataFor;
	frdInfo;
	profileRef;

  constructor(
  public navCtrl: NavController, 
  public navParams: NavParams,
    private traitService: TraitService, 
	private loadingCtrl: LoadingController,
    private storage: Storage) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');

    this.userId = this.navParams.get('id');
    if(this.userId == undefined || this.userId == ''){
      this.userId = 0;
    } 

    this.storage.get('token').then((token) => {
      this.authToken = token;
      this.getAllTraits(token);
    });

    this.searchControl = new FormControl();

	this.dataFor = navParams.get('dataFor');
	this.frdInfo = navParams.get('frdInfo');
	this.profileRef = navParams.get('profileRef');  
  }

  ionViewWillEnter() {
    if (this.tabBarElement != null || this.tabBarElement != undefined) {
      this.tabBarElement.style.display = 'none';
    }
  }

  ionViewWillLeave() {
    if (this.tabBarElement != null || this.tabBarElement != undefined) {
      this.tabBarElement.style.display = 'flex';
    }
  }

  ionviewDidLoad() {
    this.searchControl.valueChanges.debounceTime(300).subscribe(search => {
      this.filterTraits();
    });
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({ spinner: 'bubbles' });
    this.traitService.showLoading();
  }

  loadNewTraits() {
    /* let currentTraitsV = localStorage.getItem('currentTraitsV');
    let previousTraitsV = localStorage.getItem('currentTraitsV');
    if(currentTraitsV && currentTraitsV == previousTraitsV){
      return false;
    }
    return true; */
    let x = localStorage.getItem('activeTraits') ? localStorage.getItem('activeTraits') : null;
    if (x == null) {
      return true;
    } else {
      return false;
    }

  }

  getAllTraits(token) {
    if (this.loadNewTraits()) {
      //this.presentLoadingDefault();
	  this.traitService.showLoading()
      this.traitService.getAllTrais(token).subscribe(data => {
        // console.log(data);
        this.allTraitsData = data.response;
        this.traitsMasterList = data.response;
        localStorage.setItem('activeTraits', JSON.stringify(this.allTraitsData))
        this.traitsMasterList = this.allTraitsData;
        this.traitService.hideLoading();
      });
    } else {
      let x = localStorage.getItem('activeTraits') ? localStorage.getItem('activeTraits') : '[]'
      this.allTraitsData = JSON.parse(x);
      this.traitsMasterList = this.allTraitsData;
      this.allTraitsData = this.allTraitsData;
    }
  }

  addSelected(trait) {
    this.selectedTraits.push({ 
		traitname: trait.traitname, 
		traitgivenfor: this.userId, 
		typeofvote: 0,
		isAnonymous :  this.traitService.isAnonymousMode() ? 1 : 0
	});
  }

  addToPage() {
    if(this.dataFor == 'addTraitForFrd'){
		var traitNames =[];		
		this.selectedTraits.map(singleTrait => {
			traitNames.push(singleTrait.traitname);			
		})		
		this.profileRef.addCustomTrait(traitNames);
		this.navCtrl.pop();
		this.navCtrl.pop();
	}else{
		this.traitService.addTraitToPage(this.selectedTraits, this.authToken).subscribe(data => {
		  console.log(data);
		  if (data.status != "error") {
			// this.navCtrl.setRoot(ProfilePage);
			this.navCtrl.pop();
		  }
		})
	}
  }

  filterTraits() {
    let str = this.search_string;
    if (str && str.trim() != '') {
      this.traitsMasterList = this.allTraitsData.filter((item) => {
        return ((item.traitname.toLowerCase().indexOf(str.toLowerCase()) > -1));
      });
      let customTrait = { traitname: str, traitdescription: null, traiticonpath: null, traituniqueid: str + "_NewCustom" } 
      this.traitsMasterList.push(customTrait);
    }else{
		this.traitsMasterList = this.allTraitsData;
	}
  }

}

