import { Crud } from './crud';
import { Api } from '../api';

export class Bill extends Crud {

    constructor(){
    	super("bill");
    }

    async sendBill(data){
        
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/send_bill'),
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "access_token": this.access_token,
            },
            "processData": false,
            "data": JSON.stringify(data)
        }

        var res:any = await this.exec(settings);
        var row = res.results.object;
        return row;
    }

}