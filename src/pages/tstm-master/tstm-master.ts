import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { TraitService } from "../../services/traits.service";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: "page-tstm-master",
  templateUrl: "tstm-master.html"
})
export class TstmMasterPage {
  authToken;
  allTstm;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private traitService: TraitService,
    private storage: Storage
  ) {}

  ionViewWillEnter() {
    this.storage.get("token").then(token => {
      this.authToken = token;
      this.getTstmMasterList();
    });
  }

  getTstmMasterList() {
    //this.traitService.showLoading();
    this.traitService.getTstmMasterList(this.authToken).subscribe(data => {
      console.log(data);
      this.allTstm = data.response;
      this.traitService.hideLoading();
    });
  }

  settingChange() {
    console.log(1);
    //this.traitService.showLoading();
    let payload = [
      {
        testimonialid: 10,
        isactive: 1
      }
    ];
    this.traitService
      .changeMyTestimonialSettings(this.authToken, payload)
      .subscribe(data => {
        console.log(data);
        this.allTstm = data.response;
        this.traitService.hideLoading();
      });
  }
}
