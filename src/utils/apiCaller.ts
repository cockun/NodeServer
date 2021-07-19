import axios from "axios";
import { verify } from "jsonwebtoken";
import { MomoReq } from "../request/MomoReq";

const API_URL_MOMO = "https://test-payment.momo.vn/gw_payment/transactionProcessor";

export async function callApiMomo(endpoint:string, method = "GET", body:MomoReq) {
   
  if(method ==="POST"){
    try{
     return await axios.post( `${API_URL_MOMO}`,  body)
    }catch(e){
      return null;
    }
  }
 
}