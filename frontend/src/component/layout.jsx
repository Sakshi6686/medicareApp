import React from 'react'
import 'antd/dist/antd.css';
function Layout ({children}){
  return (
    <div className='main p-2'>
        <div className='d-flex layout'>
            <div className='sidebar'></div>
            <div className='content'>
                <div className='header'>
                    header 
                </div>
                <div className='body'>
                    {children}
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default Layout
