import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, Content } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { Storage } from "@ionic/storage";
import { TraitService } from '../../services/traits.service';
import jQuery from "jquery";
import { ContactsProvider } from '../../providers/contacts/contacts';

declare var $: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
	@ViewChild("contentRef") contentHandle: Content;
	@ViewChild('searchInput') myInput;
	searchControl: FormControl;

	public search_string;
	popularTraits = [];
	masterTraits = [];
	checkedTraits = [];
	checkedTraitsTemp = [];
	scrollHt: number = 0;
	topOrBottom;
	contentBox;
	tabBarHeight;
	master_list;
	authToken;
	public allContacts: any;
	masterTraitsSearch = [];
	contacttobefound = '';
	contactsfound = [];
	search = false;
	isContactSync = false;

	constructor(
	public navCtrl: NavController, 
	public modalCtrl: ModalController, 
	private traitService: TraitService,
	private storage: Storage,
	private contactsProvider : ContactsProvider,
	private contacts: Contacts){
		this.storage.get('token').then((token) => {
			this.authToken = token;			
			this.getPopularTraits(token);
			this.getMasterTraitList();
			this.searchControl = new FormControl();
			this.contactsProvider.syncContacts() ? this.traitService.presentSuccessToast('Contacts sync') : this.traitService.presentSuccessToast('Error in contacts sync');
		});
	}

	/* fetchDeviceContact() {
		let options = {
			filter: "",
			multiple: true,
			hasPhoneNumber: true
		};
		this.contacts.find(["*"], options).then((res) => {
			this.traitService.addContacts(res, this.authToken).subscribe(data => {
				console.log(data)
			});
		}).catch((err) => {
			console.log('err', err);
		});
	} */


  getPopularTraits(token) {
    this.traitService.showLoading;
    this.traitService.getListOfPopularTraits(token).subscribe(data => {
      this.popularTraits = data.response;
      this.traitService.hideLoading();
    })
  }

  getMasterTraitList() {
    let masterTraitsStr = localStorage.getItem('masterTraits');
    let masterTraits = JSON.parse(masterTraitsStr);
    if (masterTraits != null && masterTraits.length > 5) {
      this.masterTraits = masterTraits;
    } else {
      this.traitService.getAllTrais(this.authToken).subscribe(data => {
        this.masterTraits = data.response;
      });
    }
  }


  ionviewDidLoad() {
    this.searchControl.valueChanges.debounceTime(300).subscribe(search => {
      this.filterTraits();
    });
  }


  masterListAddSelectClass() {
    let TIME_IN_MS = 5;
    setTimeout(() => {
      jQuery('.singleTraits').removeClass('checkedStyle');
      jQuery('.masterListStyle').removeClass('checkedStyle');
      for (var i = 0; i < this.checkedTraits.length; i++) {
        jQuery('.singleTraits.' + this.checkedTraits[i].traituniqueid).addClass('checkedStyle');
        jQuery('.masterListStyle.' + this.checkedTraits[i].traituniqueid).addClass('checkedStyle');
      }
    }, TIME_IN_MS);
  }

  filterTraits() {
    let str = this.search_string;
    this.masterTraitsSearch = [];
    if ((str.length > 3) && (str.trim() != '')) {
      this.masterTraitsSearch = this.masterTraits.filter((item) => {
        return ((item.traitname.toLowerCase().indexOf(str.toLowerCase()) > -1));
      });
      let customTrait = { traitname: str, traitdescription: null, traiticonpath: null, traituniqueid: str + "_NewCustom" }
      this.masterTraitsSearch.push(customTrait);
      this.masterListAddSelectClass();
    }
  }

  openProfilePage() {
    // this.navCtrl.setRoot(ProfilePage); 
    this.navCtrl.parent.select(1);
  }


  openTraitsList() {
    this.navCtrl.push('TraitsListPage');
  }

  openWalkthrough() {
    let addModal2 = this.modalCtrl.create('SlidesPage');
    addModal2.onDidDismiss(() => {
      return false;
    });
    addModal2.present();
  }

  updateCheckedOptions(traitObj, event) {
    let traitData = {
      traitname: traitObj.traitname,
      traituniqueid: traitObj.traituniqueid,
      traitgivenfor: "0",
	  isAnonymous : 0
    }
    if (!jQuery("." + traitObj.traituniqueid).hasClass("checkedStyle")) {
      if (this.checkedTraitsTemp.indexOf(traitObj.traituniqueid) == -1) {
        this.checkedTraits.push(traitData);
        this.checkedTraitsTemp.push(traitObj.traituniqueid);
      }
    } else {
      for (var i = 0; i < this.checkedTraits.length; i++) {
        if (this.checkedTraits[i].traituniqueid == traitObj.traituniqueid) {
          this.checkedTraits.splice(i, 1);
          this.checkedTraitsTemp.splice(i, 1);
          break;
        }
      }
    }
    this.masterListAddSelectClass();
  }




  addToPage() {
    this.traitService.addTraitToPage(this.checkedTraits, this.authToken).subscribe(data => {
      //alert(JSON.stringify(data));
      if (data.status != "error") {
        this.openProfilePage();
      }
    })
  }


  ionViewDidEnter() {
    this.topOrBottom = this.contentHandle._tabsPlacement;
    this.contentBox = document.querySelector(".scroll-content")['style'];

    if (this.topOrBottom == "top") {
      this.tabBarHeight = this.contentBox.marginTop;
    } else if (this.topOrBottom == "bottom") {
      this.tabBarHeight = this.contentBox.marginBottom;
    }
  }

}
