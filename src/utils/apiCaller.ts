import axios from "axios";

const API_URL = "http://35.247.162.235/api";

export async function callApi(endpoint, method = "GET", body) {
  if(method ==="GET"){
    try{
     return await axios.get( `${API_URL}/${endpoint}`,{params:  body})
    }catch(e){
      return null;
    }
  }
  
  if(method ==="POST"){
    try{
     return await axios.post( `${API_URL}/${endpoint}`,  {data:body})
    }catch(e){
      return null;
    }
  }

  if(method ==="UPDATE"){
    try{
     return await axios.put( `${API_URL}/${endpoint}`,   {data:body})
    }catch(e){
      return null;
    }
  }
  if(method ==="DELETE"){
    try{
     return await axios.delete( `${API_URL}/${endpoint}`,  {params:  body})
    }catch(e){
      return null;
    }
  }
 
}