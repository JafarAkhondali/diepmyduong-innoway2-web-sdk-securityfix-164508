import { Crud } from './crud';
import { Api } from '../api';

export class Customer extends Crud {

    constructor(){
    	super("customer");
    }

    async getVerifyToken(){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/get_verify_token'),
            "method": "GET"
        }
        var res:any = await this.exec(settings);
        var row = res.results.object;
        return row.verify_token;
    }

}