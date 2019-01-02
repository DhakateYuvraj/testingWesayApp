import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { TraitService } from "../../services/traits.service";

@IonicPage()
@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage {
  public authToken: any;
  public settingData: any;
  public onlyMyContact: any;
  public noCount: any;
  public askMe: any;
  public WhoCanSee: any;
  public obja = {};
  public settingObj = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private traitService: TraitService,
    private storage: Storage,
    public modalCtrl: ModalController
  ) {
    this.storage.get("token").then(token => {
      this.authToken = token;
      this.getSettings(this.authToken);
    });
  }

  doRefresh(refresher) {
    this.traitService.getSettings(this.authToken).subscribe(data => {
      this.settingData = data.response;
      refresher.complete();
    });
  }

  getSettings(token) {
    this.traitService.showLoading();
    this.traitService.getSettings(token).subscribe(data => {
      this.settingData = data.response;
      this.traitService.hideLoading();
    });
  }

  settingChange(setting) {
    this.traitService.showLoading();

    this.settingObj = {
      categoryvalue: setting.categoryvalue ? 1 : 0,
      categoryid: setting.categoryId,
      uniqueid: setting.uniqueid
    };
    this.traitService
      .updateSettings(this.authToken, this.settingObj)
      .subscribe(data => {
        this.traitService.hideLoading();
        if (data.status == "success") {
          this.traitService.presentSuccessToast("Setting update successfuly");
        } else {
          //for (var i = 0; i < this.settingData.length; i++) {
          //if(this.settingData[i].uniqueid == this.settingObj.uniqueid){
          //this.settingData[i].categoryvalue = !this.settingData[i].categoryvalue;
          //}
          //}
        }
      });
  }
}
