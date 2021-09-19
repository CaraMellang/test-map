import React, { useEffect, useState } from "react";
import KaKaoMap from "./map.js";

interface HomeProps {
  name: string;
  hi: string;
};
const Home = ({name,hi} : HomeProps) => {
  const [mapLoading, setMapLoading] = useState(true);

    useEffect(()=>{
    //   const script = document.createElement('script');
  
    // script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_APPKEY}`;
    // script.addEventListener('load',()=>{
    //   setMapLoading(false)
    // })
    // document.body.appendChild(script);
  
  
    // return () => {
    //   document.body.removeChild(script);
    // }
    })
  return (
    <div>
      <div>{name}</div>
      <div>{hi}</div>
      
      <KaKaoMap />
    </div>
  );
};

Home.defaultProps ={
hi:"난 디폴트 안뇽!"
}

export default Home;
