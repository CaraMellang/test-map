import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";

// declare global {
//   interface Window{
//     kakao: any;
//   }
// }

function KaKaoMap({ toggle }) {
  const container = useRef(null); //지도를 담을 영역의 DOM 레퍼런스
  const [menuList, setMenuList] = useState([]);
  const [paginationNumber, setPagination] = useState(1);
  let closeInfowindowArray = [];

  // const kakao = (window as any).kakao

  const onClickPagenation = (e) => {
    console.log(e.target.value);
    setPagination(e.target.value);
  };

  const markerContents = (place) => {
    // console.log(place);
    return `
      <div style="padding:5px;font-size:12px;">
        <div>${place.place_name}</div>
        <div>${place.road_address_name}</div>
      </div>
    `;
  };

  let infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
  const options = {
    //지도를 생성할 때 필요한 기본 옵션
    center: new window.kakao.maps.LatLng(37.561839718913, 126.955438711359), //지도의 중심좌표.
    // center: new window.kakao.maps.LatLng(33.450701, 126.570667), js에서는 저렇게 표현
    level: 13, //지도의 레벨(확대, 축소 정도)
  };

  const searchOptions = {
    page: parseInt(paginationNumber),
  };
  useEffect(() => {
    let map = new window.kakao.maps.Map(container.current, options); //지도 생성 및 객체 리턴
    let ps = new window.kakao.maps.services.Places(); // 장소 검색 객체를 생성합니다

    function placesSearchCB(data, status) {
      console.log(data);
      console.log(paginationNumber);
      setMenuList([]); //페이지네이션 초기화
      // pagination.gotoPage(paginationNumber);
      if (status === window.kakao.maps.services.Status.OK) {
        // for (let s = 0; s < pagination.last; s++) {
        for (let i = 0; i < data.length; i++) {
          setMenuList((prev) => [
            ...prev,
            {
              name: data[i].place_name,
              address: data[i].address_name,
              kakaoUrl: data[i].place_url,
            },
          ]);
          displayMarker(data[i]);
        }
      }
    }

    // 키워드로 장소를 검색합니다
    // console.log(ps);
    if (toggle === true) {
      ps.keywordSearch("백신 접종센터", placesSearchCB, searchOptions);
    }

    // 지도에 마커를 표시하는 함수입니다
    function displayMarker(place) {
      // 마커를 생성하고 지도에 표시합니다
      let marker = new window.kakao.maps.Marker({
        map: map,
        position: new window.kakao.maps.LatLng(place.y, place.x),
      });

      let infoWindow = new window.kakao.maps.InfoWindow({
        map: map,
        position: new window.kakao.maps.LatLng(place.y, place.x),
        content: markerContents(place),
        // removable: true,
      });
      infoWindow.close();
      // 마커에 클릭이벤트를 등록합니다
      function addININFOFO(data) {
        closeInfowindowArray.push(data);
      }
      function removeININFOFO() {
        for (let i = 0; i < closeInfowindowArray.length; i++) {
          closeInfowindowArray[i].close();
        }
      }
      if (closeInfowindowArray.length < 15) {
        addININFOFO(infoWindow);
      }
      window.kakao.maps.event.addListener(marker, "click", function () {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        removeININFOFO();
        if (infoWindow.getMap()) {
          console.log("ggss");
          infoWindow.close();
        } else {
          console.log("gg");
          infoWindow.open(map, marker);
        }
      });
    }
  }, [toggle, paginationNumber]);

  return (
    <MapWrap className="map-wrap">
      <div
        className="map"
        style={{
          width: "80%",
          height: "80vh",
        }}
        ref={container}
      ></div>
      <div className="menu-wrap">
        <div className="menu-over">
          {menuList.map((item, index) => (
            <div className="menu" key={index}>
              <div>{item.name}</div>
              <div>{item.address}</div>
              <a href={item.kakaoUrl}>바로가기</a>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button onClick={onClickPagenation} value={1}>
            1
          </button>
          <button onClick={onClickPagenation} value={2}>
            2
          </button>
          <button onClick={onClickPagenation} value={3}>
            3
          </button>
        </div>
      </div>
    </MapWrap>
  );
}

const MapWrap = styled.div`
  /* position: relative; */
  display: flex;
  height: 80vh;
  .menu-wrap {
    /* position: absolute; */
    display: flex;
    flex-direction: column;
    height: 95%;
    width: 20%;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    padding: 2rem;
  }
  .menu-over {
    overflow: auto;
  }
  .menu-over::-webkit-scrollbar {
    width: 5px;
  }
  .menu-over::-webkit-scrollbar-thumb {
    background-color: #2f3542;
    border-radius: 10px;
  }
  .menu-over::-webkit-scrollbar-track {
    background-color: grey;
    border-radius: 10px;
  }
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default KaKaoMap;
