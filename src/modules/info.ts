import { Base } from './base';
import { Api } from '../api';

export class Info extends Base {
    constructor(){
    	super("info");
    }

    async getTokenInfo(token:string = ""){
        var query = {
            access_token: token
        }
        
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('',query),
            "method": "GET"
        }
        console.log("SETTINGS",settings);
        var res:any = await this.exec(settings);
        console.log("RES",res);
        var row = res.results.object;
        return row;
    }
}