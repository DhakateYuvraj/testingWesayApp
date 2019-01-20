import { Injectable } from "@angular/core";
import {
  Request,
  XHRBackend,
  RequestOptions,
  Response,
  Http
} from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";

@Injectable()
export class ConnectionService extends Http {
  constructor(backend: XHRBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  }

  request(url: string | Request): Observable<Response> {
    return super.request(url).catch((error: Response) => {
      console.log(error);
      if (error.status === 0) {
        console.log("staus 0");
        alert("Server is Down... Please try agin later!!!!");
      }else if(error.status === 500){
        alert("Please contact admin");		
	  }
      return Observable.throw(error);
    });
  }
}
