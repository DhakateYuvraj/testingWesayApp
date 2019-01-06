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
  public genericSetting;

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
    this.storage.get("genericSetting").then(setting => {
      this.genericSetting = JSON.parse(setting);
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
	let totalActiveTstm = 0;
	
	this.allTstm.forEach(function (tstm) {
		if(tstm.isActiveForUser){
			totalActiveTstm += 1;
		}
	});
	
	if(totalActiveTstm <= this.genericSetting.noOfTstmQuestion ){ 
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
	}else{
          this.traitService.presentSuccessToast(
            `you can select only ${this.genericSetting.noOfTstmQuestion} testimonials`
          );
		  let tempAllTstm =[]
		this.allTstm.forEach(function (tempTstm) {
			if(tempTstm.tstmQuestion == tstm.tstmQuestion){
				tempTstm.isActiveForUser = false;
			}
			tempAllTstm.push(tempTstm);
		});
		  this.allTstm = tempAllTstm;
	}
  }
}
