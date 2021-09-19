import React, { useRef, useEffect } from "react";

// declare global {
//   interface Window{
//     kakao: any;
//   }
// }

function KaKaoMap() {
  const container = useRef(null); //지도를 담을 영역의 DOM 레퍼런스
  // const kakao = (window as any).kakao

  var infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
  const options = {
    //지도를 생성할 때 필요한 기본 옵션
    center: new window.kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
    // center: new window.kakao.maps.LatLng(33.450701, 126.570667), js에서는 저렇게 표현
    level: 3, //지도의 레벨(확대, 축소 정도)
  };

  useEffect(() => {
    let map = new window.kakao.maps.Map(container.current, options); //지도 생성 및 객체 리턴
    var ps = new window.kakao.maps.services.Places();

    // 키워드로 장소를 검색합니다
    console.log(ps);
    ps.keywordSearch(
      "코로나19",
      function placesSearchCB(data, status, pagination) {
        if (status === window.kakao.maps.services.Status.OK) {
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
          // LatLngBounds 객체에 좌표를 추가합니다
          var bounds = new window.kakao.maps.LatLngBounds();

          for (var i = 0; i < data.length; i++) {
            displayMarker(data[i]);
            bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x));
          }

          // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
          map.setBounds(bounds);
        }
      }
    );

    // 키워드 검색 완료 시 호출되는 콜백함수 입니다

    // 지도에 마커를 표시하는 함수입니다
    function displayMarker(place) {
      // 마커를 생성하고 지도에 표시합니다
      var marker = new window.kakao.maps.Marker({
        map: map,
        position: new window.kakao.maps.LatLng(place.y, place.x),
      });

      // 마커에 클릭이벤트를 등록합니다
      window.kakao.maps.event.addListener(marker, "click", function () {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent(
          '<div style="padding:5px;font-size:12px;">' +
            place.place_name +
            '<div style="padding:5px;font-size:12px;">' +
            "실험중" +
            "</div>" +
            "</div>"
        );
        infowindow.open(map, marker);
      });
    }
  }, []);

  return (
    <div
      className="map"
      style={{ width: "500px", height: "500px" }}
      ref={container}
    ></div>
  );
}

export default KaKaoMap;
