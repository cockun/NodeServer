export class Result<T> {

    public err? : string |null ;
    public data: T | null;



    constructor ( data :T|undefined|null , err? : string|undefined){
        this.err = err;
        if(data ){
            this.data = data ;
        }else{
            this.data = null ;
        }
     
    } 

}