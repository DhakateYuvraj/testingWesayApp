import { Injectable } from '@angular/core';

@Injectable()
export class BadgeProvider {	
	public availableBadges;
	public availableBadgesCnt;
	public badgesEmptySlots;
	
	constructor(){
		console.log('Hello BadgeProvider Provider');
	}
  
	getAvailableBadges(){
		return this.availableBadges;
	}
	setAvailableBadges(data){
		this.availableBadges = data;
	}
	
	setAvailableBadgesCnt(data){
		this.availableBadgesCnt = data;
	}
	getAvailableBadgesCnt(){
		return this.availableBadgesCnt;
	}
	
	setBadgesEmptySlots(data){
		this.badgesEmptySlots = data;
	}
	
	getBadgesEmptySlots(){
		return this.badgesEmptySlots;
	}

}
