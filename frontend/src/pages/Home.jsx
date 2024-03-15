import React, { useEffect } from "react";
import 'antd/dist/antd.css';
import axios from "axios";
import Layout from "../component/layout";
function Home(){
const getData=async()=>{
  try{
    const res=await axios.post("/api/user/get-user-info-by-id",{},{
      headers:{
        Authorization: 'Bearer '+localStorage.getItem("token")
      }
    });
    console.log(res.data.data)

  } catch(err){
    console.log(err);
  }

}

useEffect(() => {
  getData();
}, []);
return (
  <Layout>
    <h1>HomePage</h1>
  </Layout>
);
}

export default Home;
 