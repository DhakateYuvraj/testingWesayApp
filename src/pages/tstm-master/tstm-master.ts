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
  public authToken;
  public allTstm;
  public frdInfo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private traitService: TraitService,
    private storage: Storage
  ) {
    this.frdInfo = navParams.get("frdInfo");
  }

  ionViewWillEnter() {
    this.storage.get("token").then(token => {
      this.authToken = token;
      this.getTstmMasterList();
    });
  }
  doRefresh(refresher) {
    this.traitService.getTstmMasterList(this.authToken).subscribe(data => {
      this.allTstm = data.response;
      refresher.complete();
    });
  }

  getTstmMasterList() {
    //this.traitService.showLoading();
    this.traitService.getTstmMasterList(this.authToken).subscribe(data => {
      //this.traitService.hideLoading();
      this.allTstm = data.response;
    });
  }

  settingChange(tstm) {
    this.traitService.showLoading();
    let payload = [
      {
        testimonialid: tstm.id,
        isactive: tstm.isActiveForUser ? 1 : 0
      }
    ];
    this.traitService.changeMyTestimonialSettings(this.authToken, payload).subscribe(data => {
        this.traitService.hideLoading();
        this.getTstmMasterList();
      });
  }
}
