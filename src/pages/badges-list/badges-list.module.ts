import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { BadgesListPage } from "./badges-list";

@NgModule({
  declarations: [BadgesListPage],
  imports: [IonicPageModule.forChild(BadgesListPage)]
})
export class BadgesListPageModule {}
