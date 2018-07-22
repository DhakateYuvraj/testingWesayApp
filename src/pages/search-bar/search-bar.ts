import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'page-search-bar',
  templateUrl: 'search-bar.html'
})
export class SearchBarPage {
  @ViewChild('searchInput') myInput ;

  searchControl: FormControl;
  searchTerm: string = '';
  items: any = "";
  searching: any = false;
  public searchlist: any;
  public filteredItems: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController ) {

    this.searchControl = new FormControl();
 
    this.getData();

  }

  ionViewDidLoad() {

    this.filterItems();
    this.searchControl.valueChanges.debounceTime(300).subscribe(search => {

      //  this.items = this.searchlist; 
      this.filterItems();
    }); 
  } 

  ionViewDidEnter() { 
    setTimeout(() => {
      this.myInput.setFocus();
    },50);
}

  getData() { 
    // this.productService.getAllProducts().subscribe(data => { 
    //   if (!data.success) {
    //     console.log(data);
    //   } else {
    //     this.items = data.product; 
    //   }
    // });

  }

  filterItems() {

    // let str = this.searchTerm;

    // if (str && str.trim() != '') {
    //   this.filteredItems = this.items.filter((item) => {  
    //     if(item.productname.indexOf(str.toLowerCase()) >= 0 ||
    //       item.productname.indexOf(str.toUpperCase()) >= 0 ) { 
    //       return true
    //     }
    //     return false
    //   })
    // }

  }


  cancelSearch() {
    this.viewCtrl.dismiss();
  }

  navigateToDetail(id: number) {
    this.navCtrl.push('ProductProfilePage', {id: id});
  }

}
