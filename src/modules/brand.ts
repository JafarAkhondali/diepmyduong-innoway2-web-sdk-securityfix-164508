import { Crud } from './crud';
import { Api } from '../api';
import { Config } from '../config';
import { Vendor,Timeout } from '../utils/helper';

declare var window,AccountKit:any;


export class Brand extends Crud {

    constructor(){
    	super("brand");
    }

    private async getBrandToken(){
        var query = {
            brand_id: Config.get('brand_id')
        }
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/get_brand_token',query),
            "method": "GET"
        }
        var res:any = await this.exec(settings);
        var row = res.results.object;
        return row.brand_token;
    }
}