import { Component } from "@angular/core";
import { HomePage } from "../home/home";
import { ProfilePage } from "../profile/profile";
import { FriendsListPage } from "../friends-list/friends-list";
import { SettingsPage } from "../settings/settings";

@Component({
  selector: "page-tabs",
  templateUrl: "tabs.html"
})
export class TabsPage {
  Home = HomePage;
  Profile = ProfilePage;
  FriendsList = FriendsListPage;
  Settings = SettingsPage;
}
