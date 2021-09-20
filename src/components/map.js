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

  // const kakao = (window as any).kakao

  const onClickPagenation = (e) => {
    console.log(e.target.value);
    setPagination(parseInt(e.target.value));
  };

  const markerContents = (place) => {
    // console.log(place);
    return `
      <div class="overlaybox">
        <div>${place.place_name}</div>
        <div>${place.road_address_name}</div>
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
      if (closeInfowindowArray.length < 15) {
        addININFOFO(infoWindow);
      }
      function removeININFOFO() {
        for (let i = 0; i < closeInfowindowArray.length; i++) {
          closeInfowindowArray[i].close();
        }
      }
      window.kakao.maps.event.addListener(marker, "click", function () {
        removeININFOFO();
        infoWindow.open(map, marker);
      });
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
              <div>{item.name}</div>
              <div>{item.address}</div>
              <a href={item.kakaoUrl}>바로가기</a>
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
    padding: 10px;
    border: 1px solid none;
    border-radius: 10px;
    box-shadow: 0 0.15rem 1.75rem 0 rgb(34 39 46 / 15%);
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
    border: 1px solid skyblue;
    border-radius: 5px;
    box-shadow: 0 0.15rem 1.75rem 0 rgb(34 39 46 / 15%);
  }
  .pagination-active {
    color: white;
    background-color: skyblue;
  }
  .overlaybox {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 10px;
    width: 200px;
    height: 30px;
    font-size: 5px;
  }
`;

export default KaKaoMap;
