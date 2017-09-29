import { Crud } from './crud';
import { Api } from 'api';
import { Firebase } from './firebase'
import { Auth } from './auth'

export class Media extends Crud {

    constructor(){
    	super("media");
    }

    get storage(){
        let firebaseService:Firebase = Api.module('firebase')
        return firebaseService.storage
    }

    get auth(){
        return Api.module('auth') as Auth
    }

    upload(data,on_progress = function(snapshot){}){
        let { file , metadata } = data
        let brand_id = this.auth.userInfo.brand_id
        let ref = this.storage.ref(`media/${brand_id}`)
        let uploadTask = ref.put(file,metadata)
        return new Promise((resolve,reject)=>{
            uploadTask.on('state_changed', on_progress, function(error) {
                reject(error)
            }, function() {
                resolve(uploadTask.snapshot)
            });
        })
        
    }

}