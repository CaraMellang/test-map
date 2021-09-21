import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";

// declare global {
//   interface Window{
//     kakao: any;
//   }
// }
// const kakao = (window as any).kakao

function KaKaoMap({ toggle }) {
  const container = useRef(null); //지도를 담을 영역의 DOM 레퍼런스
  const [menuList, setMenuList] = useState([]);
  const [paginationNumber, setPagination] = useState(1);
  let closeInfowindowArray = [];
  const pageList = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
  ];

  const onClickPagenation = (e) => {
    console.log(e.target.value);
    setPagination(parseInt(e.target.value));
    window.scrollTo(0, 0);
  };

  const markerContents = (place) => {
    // console.log(place);
    return `
      <div class="overlaybox">
        <div id="overlay-top">
          <div class="overlay-title">${place.place_name}</div>
         ${/*<div class="overlay-close">X</div> */ ""}
        </div>
        <div class="overlay-contents">
          <div class="overlay-road-address">${
            place.road_address_name ? place.road_address_name : "정보없음."
          }</div>
        </div>
        <div class="overlay-bottom">
          <a href=${
            place.place_url
          } class="overlay-info" target="_blank" rel="noreferrer">정보보기</a>
          <a href=https://map.kakao.com/link/to/${
            place.id
          } class="overlay-link-to" target="_blank" rel="noreferrer">길찾기</a>
        </div>
      </div>
    `;
  };

  // let infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
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
      // console.log(data);
      setMenuList([]); //페이지 메뉴 초기화
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
              id: data[i].id,
            },
          ]);
          displayMarker(data[i]);
        }
      }
    }

    // 키워드로 장소를 검색합니다
    // console.log(ps);
    if (true) {
      ps.keywordSearch("백신 접종센터", placesSearchCB, searchOptions);
    }

    // 지도에 마커를 표시하는 함수입니다
    function displayMarker(place) {
      // 마커를 생성하고 지도에 표시합니다
      let marker = new window.kakao.maps.Marker({
        map: map,
        position: new window.kakao.maps.LatLng(place.y, place.x),
      });
      let customOverlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(place.y, place.x),
        content: markerContents(place),
        xAnchor: 0.5,
        yAnchor: 1.4,
      });
      // console.log(customOverlay);
      function addININFOFO(data) {
        closeInfowindowArray.push(data);
      }
      function removeININFOFO(customOverlay) {
        for (let i = 0; i < closeInfowindowArray.length; i++) {
          closeInfowindowArray[i].setMap(null);
        }
      }
      if (closeInfowindowArray.length < 15) {
        addININFOFO(customOverlay);
      }
      // dd.addEventListener("click", function () {
      //   closeSetMap(customOverlay);
      // });

      window.kakao.maps.event.addListener(marker, "click", function () {
        removeININFOFO(customOverlay);
        // console.log(customOverlay);
        if (customOverlay.getMap()) {
          customOverlay.setMap(null);
        } else {
          customOverlay.setMap(map);
        }
      });

      // let infoWindow = new window.kakao.maps.InfoWindow({
      //   map: map,
      //   position: new window.kakao.maps.LatLng(place.y, place.x),
      //   content: markerContents(place),
      //   removable: true,
      // });
      // infoWindow.close();
      // // 마커에 클릭이벤트를 등록합니다
      // function addININFOFO(data) {
      //   closeInfowindowArray.push(data);
      // }
      // if (closeInfowindowArray.length < 15) {
      //   addININFOFO(infoWindow);
      // }
      // function removeININFOFO() {
      //   for (let i = 0; i < closeInfowindowArray.length; i++) {
      //     closeInfowindowArray[i].close();
      //   }
      // }
      // window.kakao.maps.event.addListener(marker, "click", function () {
      //   removeININFOFO();
      //   infoWindow.open(map, marker);
      // });
    }
  }, [toggle, paginationNumber]);

  return (
    <MapWrap className="map-wrap">
      <div
        className="map"
        style={{
          width: "70%",
          height: "80vh",
        }}
        ref={container}
      ></div>
      <div className="menu-wrap">
        <div className="menu-over">
          {menuList.map((item, index) => (
            <div className="menu" key={index}>
              <div className="menu-title">{item.name}</div>
              <div className="menu-address">({item.address})</div>
              <div className="menu-item-bot">
                <a
                  className="menu-bot-item item-1"
                  href={item.kakaoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  정보보기
                </a>
                <a
                  className="menu-bot-item item-2"
                  href={`https://map.kakao.com/link/to/${item.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  길찾기
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="pagination">
          {pageList.map((item, index) => (
            <button
              key={index}
              className={`page-button ${
                paginationNumber === index + 1 && "pagination-active"
              }`}
              onClick={onClickPagenation}
              value={index + 1}
            >
              {item.id}
            </button>
          ))}
        </div>
      </div>
    </MapWrap>
  );
}

const MapWrap = styled.div`
  position: relative;
  display: flex;
  gap: 0.5rem;
  height: 80vh;
  a {
    text-decoration: none;
    display: block;
  }
  a:link {
    color: black;
  }
  a:visited {
    color: black;
  }
  .map {
    border: 1px solid none;
    border-radius: 20px;
    box-shadow: 0 0.15rem 1.75rem 0 rgb(34 39 46 / 15%);
  }
  .menu-wrap {
    /* position: absolute; */
    display: flex;
    flex-direction: column;
    width: 30%;
    top: 0;
    right: 0;
    bottom: 0;
    border: 1px solid none;
    border-radius: 20px;
    box-shadow: 0 0.15rem 1.75rem 0 rgb(34 39 46 / 15%);
    z-index: 100;
  }
  .menu-over {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    overflow: auto;
  }
  .menu {
    border: 1px solid none;
    border-radius: 10px;
    box-shadow: 0 0.15rem 1.75rem 0 rgb(34 39 46 / 15%);
  }
  .menu-title {
    text-align: center;
    background-color: #3a3e4a;
    padding: 10px;
    padding-bottom: 5px;
    color: white;
    border-right: 1px solid black;
    border-radius: 10px 10px 0 0;
  }
  .menu-address {
    text-align: center;
    font-size: 14px;
    background-color: #3a3e4a;
    padding-bottom: 10px;
    color: white;
  }
  .menu-item-bot {
    display: flex;
    text-align: center;
    font-weight: bold;
  }
  .menu-bot-item {
    background-color: #fae100;
    width: 50%;
    padding: 5px;
    border: 1px solid none;
    border-radius: 0 0 10px 10px;
  }
  .item-1 {
    border: 1px solid none;
    border-right: 1px solid #3a3e4a;
    border-radius: 0 0 0 10px;
  }
  .item-2 {
    border: 1px solid none;
    border-left: 1px solid #3a3e4a;
    border-radius: 0 0 10px 0;
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
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }
  .page-button {
    background-color: white;
    border: 1px solid #3a3e4a;
    border-radius: 5px;
    box-shadow: 0 0.15rem 1.75rem 0 rgb(34 39 46 / 15%);
  }
  .pagination-active {
    color: white;
    background-color: #3a3e4a;
  }
  .overlaybox {
    display: flex;
    background-color: white;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
    border: 1px solid none;
    border-radius: 10px;
    gap: 2px;
  }
  #overlay-top {
    display: flex;
    background-color: #3a3e4a;
    padding: 10px;
    color: white;
    border: 1px solid none;
    border-radius: 10px 10px 0 0;
    gap: 10px;
  }
  .overlay-title {
    /* background-color: #3a3e4a; */
    padding: 10px;
  }
  .overlay-close {
    background-color: #e1e1e1;
    padding: 10px;
    align-items: center;
    padding-left: 15px;
    padding-right: 15px;
    color: black;
    border: 1px solid none;
    border-radius: 10px;
  }
  .overlay-contents {
    text-align: center;
    padding: 5px;
  }
  .overlay-road-address {
    background-color: white;
    padding: 10px;
    color: black;
    font-weight: bold;
    border: 1px solid none;
    border-radius: 5px;
    box-shadow: 0 0.15rem 1.75rem 0 rgb(34 39 46 / 15%);
  }
  .overlay-bottom {
    display: flex;
    padding-top: 5px;
    padding-left: 5px;
    padding-right: 5px;
    padding-bottom: 5px;
    gap: 10px;
  }
  .overlay-bottom > a {
    width: 50%;
    padding: 10px;
    background-color: #fae100;
    border: 1px solid none;
    border-radius: 5px;
    text-align: center;
    text-decoration: none;
    font-weight: bold;
  }
  .overlay-bottom > a:link {
    color: black;
  }
  .overlay-bottom > a:visited {
    color: black;
  }
`;

export default KaKaoMap;
