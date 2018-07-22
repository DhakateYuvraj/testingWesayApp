import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchBarPage } from './search-bar';

@NgModule({
  declarations: [
    SearchBarPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchBarPage),
  ],
})
export class SearchBarPageModule {}
