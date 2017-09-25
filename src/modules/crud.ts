import { Base } from './base'
import { Api } from '../api';

declare let $,_:any;

export class Crud extends Base{
    
    constructor(module){
        super(module);
    }
    _items = []

    get items(){
        return this._items;
    }

    set items(items){
        this._items = items;
        $(this).trigger(this.events.ON_CHANGE,{
            items: this._items
        });
    }
    // itemIndexs = {};
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

    private onChange(){
        
    }
    
    async getAll(){
        if(this.items.length > 0){
            return this.items;
        }else{
            return await this.getAllWithQuery();
        }
    } 

    async getAllWithQuery(query:any = {}){
        let access_token = await this.getAccessToken()
        query = this._paserQuery(query);
        let settings = {
          "async": true,
          "crossDomain": true,
          "url": this.url("",query),
          "method": "GET",
          "headers": {
              "access_token": access_token
          }
        }
        let res:any = await this.exec(settings);
        this.pagination = res.pagination;
        this.currentPageCount = res.results.objects.count;
        let rows = res.results.objects.rows
        this.items = rows;
        return rows;
    }

    async get(id:string,query:any = {}){
        let access_token = await this.getAccessToken()
        query = this._paserQuery(query);
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/'+id,query),
            "method": "GET",
            "headers": {
                "access_token": access_token
            }
        }
        
        let res:any = await this.exec(settings);
        let row = res.results.object;
        return row;
    }

    async update(id:string,data:any){
        let access_token = await this.getAccessToken()
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/'+id),
            "method": "PUT",
            "headers": {
                "content-type": "application/json",
                "access_token": access_token
            },
            "processData": false,
            "data": JSON.stringify(data)
        }
        let res:any = await this.exec(settings);
        let row = res.results.object;
        let index = _.findIndex(this.items, {id: id});
        if(index > -1){
            this.items[index] = row;
            this.items = this.items
        }
        return row;
    }

    async delete(id:string){
        let access_token = await this.getAccessToken()
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/'+id),
            "method": "DELETE",
            "headers": {
                "content-type": "application/json",
                "access_token": access_token
            }
        }
        let res:any = await this.exec(settings);
        let deleted = _.remove(this.items, function (item) {
            return item.id == id;
        });
        this.items = this.items;
        return deleted;
    }

    async add(data:any){
        let access_token = await this.getAccessToken()
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url(),
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "access_token": access_token
            },
            "processData": false,
            "data": JSON.stringify(data)
        }
        let res:any = await this.exec(settings);
        let row = res.results.object;
        this.items.push(row);
        this.items = this.items
        return row;
    }

    async deleteAll(ids:string[]){
        let access_token = await this.getAccessToken()
        let query = this._paserQuery({items: ids })
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/',query),
            "method": "DELETE",
            "headers": {
                "content-type": "application/json",
                "access_token": access_token
            }
        }
        let res:any = await this.exec(settings);
        let row = res.results.object;
        let deleted = _.remove(this.items, function (item) {
            return _.indexOf(ids, item.id) !== -1
        });
        this.items = this.items;
        return deleted;
    }

    protected _paserQuery(query:any = {}){
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
        if(query.items){
            query.items = encodeURIComponent(JSON.stringify(query.items));
        }
        return query;
    }
}