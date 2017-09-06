import { Base } from './base'
import { Api } from '../api';

declare var $:any;

export class Crud extends Base{
    
    constructor(module){
        super(module);
    }

    items = [];
    itemIndexs = {};
    currentPageCount = 0;
    pagination = {
        current_page: 0,
        limit: 20,
        next_page: 2,
        prev_page: 0
    };
    
    events:any = {
        ON_CHANGE: "on_change"
    }
    
    async getAll(){
        if(this.items.length > 0){
            return this.items;
        }else{
            return await this.getAllWithQuery();
        }
    } 
    
    
    async getAllWithQuery(query:any = {}){
        query = this._paserQuery(query);
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": this.url("",query),
          "method": "GET",
          "headers": {
              "access_token": this.access_token
          }
        }
        var res:any = await this.exec(settings);
        this.pagination = res.pagination;
        this.currentPageCount = res.results.objects.count;
        var rows = res.results.objects.rows
        rows.forEach(row => {
            if(typeof this.itemIndexs[row.id] != 'undefined'){
                this.items[this.itemIndexs[row.id]] = row;
            }else{
                this.itemIndexs[row.id] = this.items.length;
                this.items.push(row);
            }
        });
        $(this).trigger(this.events.ON_CHANGE,{
            items: this.items
        });
        return rows;
    }

    async get(id:string,query:any = {}){
        query = this._paserQuery(query);
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/'+id,query),
            "method": "GET",
            "headers": {
                "access_token": this.access_token
            }
        }
        
        var res:any = await this.exec(settings);
        var row = res.results.object;
        if(typeof this.itemIndexs[id] != 'undefined'){
            this.items[this.itemIndexs[id]] = row;
        }else{
            this.itemIndexs[row.id] = this.items.length;
            this.items.push(row);
        }
        $(this).trigger(this.events.ON_CHANGE,{
            items: this.items
        });
        return row;
            
    }

    async update(id:string,data:any){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/'+id),
            "method": "PUT",
            "headers": {
                "content-type": "application/json",
                "access_token": this.access_token
            },
            "processData": false,
            "data": JSON.stringify(data)
        }
        var res:any = await this.exec(settings);
        var row = res.results.object;
        if(this.itemIndexs[row.id]){
            this.items[this.itemIndexs[row.id]] = row;
        }else{
            this.itemIndexs[row.id] = this.items.length;
            this.items.push(row);
        }
        $(this).trigger(this.events.ON_CHANGE,{
            items: this.items
        });
        return row;
    }

    async delete(id:string){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/'+id),
            "method": "DELETE",
            "headers": {
                "content-type": "application/json",
                "access_token": this.access_token
            }
        }
        var res:any = await this.exec(settings);
        if(this.itemIndexs[id]){
            this.items.splice(this.itemIndexs[id],1);
            this.reIndexItems();
            $(this).trigger(this.events.ON_CHANGE,{
                items: this.items
            });
        }
        return res;
    }

    async add(data:any){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url(),
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "access_token": this.access_token
            },
            "processData": false,
            "data": JSON.stringify(data)
        }
        var res:any = await this.exec(settings);
        var row = res.results.object;
        this.itemIndexs[row.id] = this.items.length;
        this.items.push(row);
        $(this).trigger(this.events.ON_CHANGE,{
            items: this.items
        });
        return row;
    }

    private reIndexItems(){
        this.itemIndexs = {};
        this.items.forEach((item,index) => {
            this.itemIndexs[item.id] = index;
        });
    }

    private _paserQuery(query:any = {}){
        if(query.filter){
            query.filter = encodeURIComponent(JSON.stringify(query.filter));
        }
        if(query.order){
            query.order = encodeURIComponent(JSON.stringify(query.order));
        }
        if(query.scopes){
            query.scopes = encodeURIComponent(JSON.stringify(query.scopes));
        }
        if(query.fields){
            query.fields = encodeURIComponent(JSON.stringify(query.fields));
        }
        return query;
    }
}