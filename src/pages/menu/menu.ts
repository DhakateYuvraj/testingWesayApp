import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AuthService } from '../../services/auth.service';
 
@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {  

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private authService: AuthService) {
  }

  ionViewDidLoad() {  
    console.log('ionViewDidLoad MenuPage');
  }

  close(){
    this.viewCtrl.dismiss().catch(() => {});  
  }

  logout(){
    this.authService.logout();
    this.navCtrl.setRoot(LoginPage);
  }

}
