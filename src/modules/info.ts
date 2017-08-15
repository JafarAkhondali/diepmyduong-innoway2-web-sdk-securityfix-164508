import { Base } from './base';

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
        var res:any = await this.exec(settings);
        var row = res.results.object;
        return row;
    }
}