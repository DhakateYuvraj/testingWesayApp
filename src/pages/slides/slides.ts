import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Slides } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
 
@IonicPage()
@Component({  
  selector: 'page-slides',
  templateUrl: 'slides.html',
})
export class SlidesPage {
  @ViewChild(Slides) slides: Slides; 
 
  public currentIndex = 0;  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SlidesPage');
  }

  slideChanged(){  
    this.currentIndex = this.slides.getActiveIndex();
    // console.log('Current index is', this.currentIndex); 
  }

  close(){
    this.viewCtrl.dismiss().catch(() => {});  
  }

  skip(){
    this.navCtrl.setRoot(TabsPage);
  }

  continue(){
    this.navCtrl.setRoot(TabsPage);
  }

}
