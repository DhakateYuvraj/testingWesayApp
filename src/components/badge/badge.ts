import { Component, Input } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";

@Component({
  selector: "badge",
  templateUrl: "badge.html",
  inputs: ["badgesObj"]
})
export class BadgeComponent {
  @Input() badgesObj: any;
  text: string;
  badges: any;

  constructor(public nav: NavController, public navParams: NavParams) {
    this.badges = navParams.get("badgesObj");
    console.log("Hello BadgeComponent Component", this.badges);
    this.text = "Hello World";
  }
}
