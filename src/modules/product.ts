import { Crud } from './crud';
import { Api } from '../api';

export class Product extends Crud {

    constructor(){
    	super("product");
    }

    async getToppings(id){
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/'+id+'/toppings'),
            // "headers": {
            //     "access_token": this.access_token,
            // },
            "method": "GET"
        }
        let res:any = await this.exec(settings);
        let row = res.results.object;
        let rows = res.results.objects.rows
        let toppings = [];
        let toppingService = Api.module('topping');
        let l = rows.length;
        for(let i = 0; i < l ; i++){
            let topping = await toppingService.get(rows[i].topping_id)
            toppings.push(topping);
        }
        return toppings;
    }

    async addToppings(id,topping_ids){
        let access_token = await this.getAccessToken()

        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url(`/${id}/toppings`),
            "headers": {
                "content-type": "application/json",
                "access_token": access_token,
            },
            "method": "POST",
            "data": JSON.stringify({
                topping_ids
            })
        }
        let res:any = await this.exec(settings);
        let rows = res.results.object.rows
        return rows;
    }

    async updateToppings(id,topping_ids){
        let access_token = await this.getAccessToken()

        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url(`/${id}/toppings`),
            "headers": {
                "content-type": "application/json",
                "access_token": access_token,
            },
            "method": "PUT",
            "data": JSON.stringify({
                topping_ids
            })
        }
        let res:any = await this.exec(settings);
        let rows = res.results.object.rows
        return rows;
    }

}