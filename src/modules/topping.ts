import { Crud } from './crud';
import { Api } from '../api';

export class Topping extends Crud {

    constructor(){
    	super("topping");
    }

    async getValues(id){
        var toppingValueService = Api.module('topping_value');
        return await toppingValueService.getAllWithQuery({
            filter: { topping_id: id} 
        })
    }
}