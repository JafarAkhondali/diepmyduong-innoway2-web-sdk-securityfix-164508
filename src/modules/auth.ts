import { Base } from './base';
import { Api } from '../api';

declare var $:any;
export class Auth extends Base {
    constructor(){
        super("auth");
    }
    events:any = {
        AUTH_STATE_CHANGE: "on_auth_change"
    }

    private _authState:boolean;
    userInfo:any
    
    set authenticated(state:boolean){
        this._authState = state;
        $(this).trigger(this.events.AUTH_STATE_CHANGE,this._authState);
    }

    async getAuthState(){
        if(this._authState === undefined){
            let token = await this.getAccessToken();
            let user = await this.loginWithToken(token);
            if(user){
                return true;
            }else{
                return false;
            }
        }else{
            return this._authState;
        }
    }

    async getAnonymouseToken(brand_id:string){
        let query = { brand_id }
        
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/get_anonymouse_token',query),
            "method": "GET"
        }
        let res:any = await this.exec(settings);
        let row = res.results.object;
        return row;
    }

    async loginWithToken(token:string){
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/login_with_token'),
            "method": "GET",
            "headers": {
                access_token: token
            }
        }
        try {
            let res:any = await this.exec(settings)
            let row = res.results.object
            this.userInfo = row
            Api.setAccessToken(token)
            this.authenticated = true
            return row
        }catch(err){
            this.authenticated = false
            return null
        }
        
    }

    async LoginWithEmailAndPassword(email,password){
        let access_token = await this.getAccessToken()
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/login'),
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                access_token: access_token
            },
            "data": JSON.stringify({
                email,
                password
            })
        }
        try {
            let res:any = await this.exec(settings)
            let row = res.results.object
            this.userInfo = row.user
            Api.setAccessToken(row.access_token)
            this.authenticated = true
            return row
        }catch(err){
            this.authenticated = false
            throw err
        }
    }

    async logout(){
        var brand_token = await Api.module('brand').getBrandToken();
        Api.setAccessToken(brand_token);
        this.userInfo = undefined;
        this.authenticated = false;
        return true;
    }
}