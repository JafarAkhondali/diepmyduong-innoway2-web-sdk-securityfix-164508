import { Api } from '../api';
import { URL } from '../utils/helper';
import { Config } from '../config';

declare var $:any;

export class Base {

    items = [];
    itemIndexs = {};
    currentPageCount = 0;
    pagination = {
        current_page: 0,
        limit: 20,
        next_page: 2,
        prev_page: 0
    };
    module = "";
    
    events = {
        ON_CHANGE: "on_change"
    }

	constructor(module){
        this.module = module;
    }

    get access_token(){
        return Api.getAccessToken();
    }

    exec(settings){
        return Api.exec(settings);
    }

    getAll(){
        return new Promise((resolve,reject)=>{
            if(this.items.length > 0){
                resolve(this.items);
            }else{
                this.getAllWithQuery().then(items =>{
                    resolve(items);
                }).catch(err => {
                    reject(err);
                })
            }
        })
    }

    getAllWithQuery(query:any = {}){
        if(query.filter){
            query.filter = encodeURIComponent(JSON.stringify(query.filter));
        }
        if(query.order){
            query.order = encodeURIComponent(JSON.stringify(query.order));
        }
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": Api.Url(this.module,query),
          "method": "GET",
        }
        return new Promise((resolve,reject)=>{
            this.exec(settings).then((res:any) =>{
                this.pagination = res.pagination
                this.currentPageCount = res.results.objects.count
                var rows = res.results.objects.rows
                rows.forEach(row => {
                    if(this.itemIndexs[row.id]){
                        this.items[this.itemIndexs[row.id]] = row;
                    }else{
                        this.itemIndexs[row.id] = this.items.length;
                        this.items.push(row);
                    }
                });
                $(this).trigger(this.events.ON_CHANGE,{
                    items: this.items
                });
                resolve(rows);
            }).catch(err => {
                reject(err);
            })
        })
        
    }

    get(id:string){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": Api.Url(this.module+'/'+id),
            "method": "GET"
        }
        return new Promise((resolve,reject)=>{
            if(this.itemIndexs[id]){
                return this.items[this.itemIndexs[id]];
            }else{
                this.exec(settings).then((res:any)=>{
                    var row = res.results.object;
                    this.itemIndexs[row.id] = this.items.length;
                    this.items.push(row);
                    $(this).trigger(this.events.ON_CHANGE,{
                        items: this.items
                    });
                    resolve(row);
                }).catch(err =>{
                    reject(err);
                })
            }
        })
    }

    update(id:string,data:any){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": Api.Url(this.module+'/'+id),
            "method": "PUT",
            "headers": {
                "content-type": "application/json"
            },
            "processData": false,
            "data": JSON.stringify(data)
        }

        return new Promise((resolve,reject)=>{
            this.exec(settings).then((res:any)=>{
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
                resolve(row);
            }).catch(err =>{
                reject(err);
            })
        })
    }

    delete(id:string){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": Api.Url(this.module+'/'+id),
            "method": "DELETE",
            "headers": {
                "content-type": "application/json"
            }
        }
        return new Promise((resolve,reject)=>{
            this.exec(settings).then((res:any)=>{
                if(this.itemIndexs[id]){
                    this.items.splice(this.itemIndexs[id],1);
                    this.reIndexItems();
                    $(this).trigger(this.events.ON_CHANGE,{
                        items: this.items
                    });
                }
                resolve(res);
            }).catch(err =>{
                reject(err);
            })
        })
    }

    add(data:any){
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": Api.Url(this.module),
            "method": "POST",
            "headers": {
                "content-type": "application/json"
            },
            "processData": false,
            "data": JSON.stringify(data)
        }
        return new Promise((resolve,reject)=>{
            this.exec(settings).then((res:any)=>{
                var row = res.results.object;
                this.itemIndexs[row.id] = this.items.length;
                this.items.push(row);
                $(this).trigger(this.events.ON_CHANGE,{
                    items: this.items
                });
                resolve(row);
            }).catch(err =>{
                reject(err);
            })
        })
    }

    private reIndexItems(){
        this.itemIndexs = {};
        this.items.forEach((item,index) => {
            this.itemIndexs[item.id] = index;
        });
    }

}