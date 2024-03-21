import React from 'react'
import Layout from '../component/layout'
import { Tabs } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useState ,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoading,showLoading } from '../redux/alertSlice'
import { setUser } from '../redux/userSlice'
const Notifications = () => {
    const navigate=useNavigate()
    // const [user,setUser]=useState({
        
    // });
    // useEffect(() => {
    //     const getUser=async()=>{
    //                 try{
    //                   console.log("hi");
    //                   const res=await axios.post("/api/user/get-user-info-by-id",{},{
    //                     headers:{
    //                       Authorization: 'Bearer '+localStorage.getItem("token")
    //                     }
    //                   });
                      
                       

    //                    console.log("res.data.data.user in notification",res.data.data.user);
    //                     setUser(res.data.data.user);
    //                                        console.log("user in noti",user);
    //                     console.log("username in notification",user.username);
                  
    //                 } catch(err){
    //                   console.log(err);
    //                 }
                  
    //               }
    //             getUser();
        
    //           }, []);
    //           useEffect(() => {
               
    //             console.log("User:", user);
            
               
    //             console.log("Username:", user.username);
    //         }, [user]); 
              
    const {user}=useSelector((state)=>state.user);
    const dispatch=useDispatch();
    const markAllAsSeen=async()=>{
      try{

        dispatch(showLoading());
        const res=await axios.post("/api/user/mark-all-notifications-as-seen",{userId:user._id},
        {headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`,
      },
  }
        );
        dispatch(hideLoading());
        if(res.data.success){
          toast.success(res.data.message)
            dispatch(setUser(res.data.data.updatedUser))
        }
        else{
          toast.error(res.data.message)
        }


    }
    catch(err){
      dispatch(hideLoading());
      toast.error("Something went wrong")

    }
              
              }
              const deleteAll=async()=>{
                try{
          
                  dispatch(showLoading());
                  const res=await axios.post("/api/user/delete-all-notifications",{userId:user._id},
                  {headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`,
                },
            }
                  );
                  dispatch(hideLoading());
                  if(res.data.success){
                    toast.success(res.data.message)
                      dispatch(setUser(res.data.data.updatedUser))
                  }
                  else{
                    toast.error(res.data.message)
                  }
          
          
              }
              catch(err){
                dispatch(hideLoading());
                toast.error("Something went wrong")
          
              }
                        
                        }
  return (
    <div>
      <Layout>
        <h1 className="page-title">Notifications</h1>
        <Tabs>
        <Tabs.TabPane tab="Unseen" key={0}>
        <div className="d-flex justify-content-end"><h1 className="anchor" onClick={markAllAsSeen}>Mark all as seen</h1></div>
        {user && user.unseenNotification && user.unseenNotification.map((notification) => (
    <div className="card p2" onClick={() => navigate(notification.onClickPath)}>
        <div className="card-text">{notification.message}</div>
    </div>
))}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Seen" key={1}>
         <div className="d-flex justify-content-end"><h1 className="anchor" onClick={deleteAll}>Delete all</h1></div>
         {user && user.seenNotification && user.seenNotification.map((notification) => (
    <div className="card p2" onClick={() => navigate(notification.onClickPath)}>
        <div className="card-text">{notification.message}</div>
    </div>
))}
         </Tabs.TabPane>
        </Tabs>
        
      </Layout>
    </div>
  )
}

export default Notifications
