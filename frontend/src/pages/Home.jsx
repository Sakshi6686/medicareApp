import React, { useEffect,useState , useContext} from "react";
import 'antd/dist/antd.css';
import axios from "axios";
import Layout from "../component/layout";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import { Col, Row } from "antd";
import Doctor from "../component/Doctor";
import { hideLoading, showLoading } from "../redux/alertSlice";
import { SearchContext } from "../context/SearchContext";

function Home(){
  const dispatch=useDispatch();
  const {user}=useSelector((state)=>state.user)
  const [doctors,setDoctors]=useState([]);
  const { searchResults } = useContext(SearchContext); 
 const getData=async()=>{
  try{
    const res=await axios.post("/api/user/get-user-info-by-id",{},{
      headers:{
        Authorization: 'Bearer '+localStorage.getItem("token")
      }
    });
    console.log("home res.data.data ",res.data.data)
    if(res.data.success){
      dispatch(setUser(res.data.data))
      console.log("user in home route",user);
    
}



  } catch(err){
    console.log(err);
  }

}
const getDoctors=async()=>{
  try{
    dispatch(showLoading())
    const res=await axios.get("/api/user/get-all-approved-doctors",{
      headers:{
        Authorization: 'Bearer '+localStorage.getItem("token")
      }
    });
    dispatch(hideLoading())
    console.log("home doc res.data.data ",res.data.data)
    if(res.data.success){
      console.log(res.data.data);
    setDoctors(res.data.data)
      console.log("doctor in home route",doctors);
    
}



  } catch(err){
    dispatch(hideLoading())
    console.log(err);
  }

}


useEffect(() => {

  getData();
  getDoctors();
}, []);
return (
  <Layout>
      <Row gutter={20}>
        {searchResults.length > 0 ? (
          // If there are search results, render them
          searchResults.map((doctor) => (
            <Col key={doctor._id} span={8} xs={24} sm={24} lg={8}>
              <Doctor doctor={doctor} />
            </Col>
          ))
        ) : (
          
          doctors.map((doctor) => (
            <Col key={doctor._id} span={8} xs={24} sm={24} lg={8}>
              <Doctor doctor={doctor} />
            </Col>
          ))
        )}
      </Row>
    </Layout>
);
}

export default Home;
 