import axios from "axios";
import { MomoReq } from "../request/MomoReq";

const API_URL = "http://35.247.162.235/api";

export async function callApi(endpoint:string, method = "GET", body:MomoReq) {
   
  if(method ==="POST"){
    try{
     return await axios.post( `${API_URL}/${endpoint}`,  {data:body})
    }catch(e){
      return null;
    }
  }
 
}