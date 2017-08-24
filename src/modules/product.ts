import { Crud } from './crud';
import { Api } from '../api';

export class Product extends Crud {

    constructor(){
    	super("product");
    }

    async getToppings(id){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/'+id+'/toppings'),
            // "headers": {
            //     "access_token": this.access_token,
            // },
            "method": "GET"
        }
        var res:any = await this.exec(settings);
        var row = res.results.object;
        var rows = res.results.objects.rows
        var toppings = [];
        var toppingService = Api.module('topping');
        var l = rows.length;
        for(var i = 0; i < l ; i++){
            var topping = await toppingService.get(rows[i].topping_id)
            toppings.push(topping);
        }
        return toppings;
    }

}