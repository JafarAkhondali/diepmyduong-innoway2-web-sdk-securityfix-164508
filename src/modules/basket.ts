import { Base } from './base';
import { Api } from '../api';

declare var _,$:any;

export class Basket extends Base {

    events = {
        ON_CHANGE: 'on_change'
    }

    totalPrice = 0;


    get items(){
        return JSON.parse(localStorage.getItem('innoway2.basket')) || [];
    }

    set items(data){
        localStorage.setItem('innoway2.basket',JSON.stringify(data));
        this.countBasket();
        $(this).trigger(this.events.ON_CHANGE,{items: data});
    }

    constructor(){
        super("basket");
        this.countBasket();
    }

    get(index){
        return this.items[index];
    }

    getAll(){
        return this.items;
    }

    add(item){
        console.log("add product",item);
        var items = this.items;
        try{
            items.forEach((i,index) =>{
                if(i.id == item.id){
                    if(_.isEqual(i.toppings.sort(),item.toppings.sort())){
                        console.log('add existed');
                        items[index].amount += item.amount;
                        this.items = items;
                        throw new Error('existed');
                    }
                }
            })
            console.log("add new");
            items.push(item);
            this.items = items;
        }catch(err){
            return;
        }
    }

    remove(index){
        var items = this.items;
        items.splice(index,1);
        this.items = items;
    }

    update(index,amount){
        var items = this.items;
        items[index].amount = amount;
        this.items = items;
    }

    clear(){
        this.items = [];
    }

    async checkout(data){
        var billService = Api.module('bill');
        var items = this.items;
        if(items.length === 0){
            throw new Error("Empty Basket");
        }
        data.items = items.map(i =>{
            return {
                "product_id": i.id,
                "amount": i.amount,
                "topping_value_ids": i.toppings
            }
        });
        data.channel_id = "facebook";
        var bill = await billService.sendBill(data);
        this.clear();
        return bill;
    }

    countBasket(){
        var items = this.items;
        this.totalPrice = 0;
        items.forEach(i =>{
            i.totalPrice = (i.price + i.toppingTotalPrice) * i.amount;
            this.totalPrice += i.totalPrice || 0;
        })
        return this.totalPrice;
    }
}