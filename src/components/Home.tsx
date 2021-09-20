import axios from "axios";
import React, { useEffect, useState } from "react";
import { transform } from "typescript";
import KaKaoMap from "./map.js";

interface HomeProps {
  name: string;
  hi: string;
};

const Home = ({name,hi} : HomeProps) => {
  const [toggle , setToggle]= useState(false)
  const onClickMarker = () =>{
    setToggle(prev => !prev)
  }

    useEffect(()=>{
      
    // const script = document.createElement("script");

    // script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_APPKEY}&autoload=false`;
    // document.head.appendChild(script);
    // console.log(window.kakao)
     
    // let dd = axios.get(`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_APPKEY}`)
    // console.log(dd)
    })
  return (
    <div >
      <div>{name}</div>
      <div>{hi} 
      <span>
        <button onClick={onClickMarker}>마커표시!</button>
        </span>
        </div>
      
      <KaKaoMap toggle={toggle} />
    </div>
  );
};

Home.defaultProps ={
hi:"난 디폴트 안뇽!"
}

export default Home;
