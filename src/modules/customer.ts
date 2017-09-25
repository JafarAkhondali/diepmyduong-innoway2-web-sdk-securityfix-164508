import { Crud } from './crud';
import { Api } from '../api';
import { Vendor,Timeout } from '../utils/helper';

declare let window,AccountKit,$:any;


export class Customer extends Crud {

    private _authenticated = undefined;
    set authenticated(state:boolean){
        this._authenticated = state;
        $(this).trigger(this.events.AUTH_STATE_CHANGE,this._authenticated);
    }
    public info:any = {};
    public verify_token:string;

    constructor(){
        super("customer");
        this.events = Object.assign({
            AUTH_STATE_CHANGE: 'on_auth_change'
        },this.events);
    }

    private async getVerifyToken(){
        let access_token = await this.getAccessToken()
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/get_verify_token'),
            "headers": {
                "access_token": access_token,
            },
            "method": "GET"
        }
        let res:any = await this.exec(settings);
        let row = res.results.object;
        return row.verify_token;
    }

    async AKitVerify(authStateInfo){
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url("/verify_phone"),
            "method": "POST",
            "headers": {
                "access_token": this.verify_token,
                "content-type": "application/json",
            },
            "processData": false,
            "data": JSON.stringify(authStateInfo)
        }

        let res:any = await this.exec(settings);
        let row = res.results.object;
        Api.setAccessToken(row.access_token);
        this.loginWithToken();
        return row;
    }

    async AKitInit(){
        this.verify_token = await this.getVerifyToken();
        let tokenInfo = await Api.module('info').getTokenInfo(this.verify_token);
        let options = tokenInfo.payload;
        if(typeof AccountKit === "undefined" || typeof AccountKit.init === "undefined"){
            let accountkitSrc = "https://sdk.accountkit.com/"+options.locale+"/sdk.js";
            await Vendor.loadScript(accountkitSrc,{id: "accoutkit_sdk"});
            while(typeof AccountKit === "undefined" || typeof AccountKit.init === "undefined" ){
                await Timeout(500);
            }
            AccountKit.init({
                appId:    options.app_id, 
                state:    options.state, 
                version:  options.version,
                fbAppEventsEnabled:true
            });
        }
        return options;
    }

    AKitLogin(countryCode,phoneNumber){
        return new Promise((resolve,reject)=>{
            AccountKit.login('PHONE', {
                countryCode: countryCode, 
                phoneNumber: phoneNumber
            },(response) => {
                if (response.status === "PARTIALLY_AUTHENTICATED") {
                    this.AKitVerify({
                        state: response.state,
                        code: response.code
                    }).then(user =>{
                        resolve(user);
                    }).catch(err=>{
                        reject(err);
                    })
                } else if (response.status === "NOT_AUTHENTICATED") {
                    reject({
                        code: 500,
                        type: "NOT_AUTHENTICATED",
                        message: "NOT AUTHENTICATED"
                    })
                }else if (response.status === "BAD_PARAMS") {
                    reject({
                        code: 500,
                        type: "BAD_PARAMS",
                        message: "BAD PARAMS"
                    })
                }
            });
        })    
    }

    async loginWithToken(){
        let access_token = await this.getAccessToken()
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/login_with_token'),
            "headers": {
                "access_token": access_token,
            },
            "method": "GET"
        }
        try {
            let res:any = await this.exec(settings);
            let row = res.results.object;
            this.info = row;
            this.authenticated = true;
            return row;
        }catch(err){
            this.authenticated = false;
            throw new Error('unAuthenticated');
        }
    }

    async logout(){
        let brand_token = await Api.module('brand').getBrandToken();
        Api.setAccessToken(brand_token);
        this.info = {};
        this.authenticated = false;
        return true;
    }

    async getPromotions(id:string,query:any = {}){
        let access_token = await this.getAccessToken()
        query = this._paserQuery(query);
        let settings = {
          "async": true,
          "crossDomain": true,
          "url": this.url(`/${id}/promotion`,query),
          "method": "GET",
          "headers": {
              "access_token": access_token
          }
        }
        let res:any = await this.exec(settings);
        let rows = res.results.objects.rows
        return rows;
    }

}