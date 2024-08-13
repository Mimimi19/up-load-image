'use client';
import React, { useRef, useEffect, useState } from "react";
import setCurrentLocationMarker from "@/components/setCurrentLocationMarker";
import createInfoWindowContent from "@/components/createInfoWindowContent";
import CurrentLocationButton from "@/components/currentLocation";

const MyMapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [latLng, setLatLng] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);

          const newMap = new google.maps.Map(mapRef.current!, {
            center: location,
            zoom: 13,
            mapTypeId: "roadmap",
          });
          setMap(newMap);

          if (location) {
            setCurrentLocationMarker(newMap, location);
          }

          const input = document.getElementById("pac-input") as HTMLInputElement;
          const searchBox = new google.maps.places.SearchBox(input);
          newMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

          newMap.addListener("bounds_changed", () => {
            searchBox.setBounds(newMap.getBounds() as google.maps.LatLngBounds);
          });

          let markers: google.maps.Marker[] = [];

          searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();

            if (!places || places.length === 0) {
              return;
            }

            markers.forEach((marker) => marker.setMap(null));
            markers = [];

            const bounds = new google.maps.LatLngBounds();

            places.forEach((place) => {
              if (!place.geometry || !place.geometry.location) return;

              const icon = {
                url: place.icon!,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
              };

              const marker = new google.maps.Marker({
                map: newMap,
                icon,
                title: place.name,
                position: place.geometry.location,
              });

              const infoWindow = new google.maps.InfoWindow({
                content: createInfoWindowContent(0, 0), // デフォルト値を設定
                pixelOffset: new google.maps.Size(0, -50),
              });

              marker.addListener("click", () => {
                infoWindow.open(newMap, marker);
              });

              if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });
            newMap.fitBounds(bounds);
          });

          // ピンを指した時に緯度と経度を表示
          newMap.addListener("click", (event: google.maps.MapMouseEvent) => {
            const latLng = event.latLng;
            if (!latLng) return;

            const confirmPin = window.confirm("ここにピンを指しますか？");
            if (confirmPin) {
              const newMarker = new google.maps.Marker({
                position: latLng,
                map: newMap,
              });

              const infoWindow = new google.maps.InfoWindow({
                content: createInfoWindowContent(latLng.lat(), latLng.lng()),
                pixelOffset: new google.maps.Size(0, -50),
              });

              newMarker.addListener("click", () => {
                infoWindow.open(newMap, newMarker);
                // URLにリダイレクト
                window.location.href = "./postDetail";
              });

              // 緯度と経度を更新
              setLatLng({
                lat: latLng.lat(),
                lng: latLng.lng()
              });

              newMap.panTo(latLng);
            }
          });

        },
        (error) => {
          console.error("Error retrieving location: ", error);
          const fallbackLocation = { lat: -33.8688, lng: 151.2093 };
          const newMap = new google.maps.Map(mapRef.current!, {
            center: fallbackLocation,
            zoom: 13,
            mapTypeId: "roadmap",
          });
          setMap(newMap);

          setCurrentLocationMarker(newMap, fallbackLocation);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, [mapRef]);

  return (
    <div>
      <input id="pac-input" className="controls" type="text" placeholder="Search Box" />
      <div ref={mapRef} className="min-h-screen w-screen" />
      <CurrentLocationButton map={map} currentLocation={currentLocation} />
      <div>
        <ul>
          <li>緯度: <span>{latLng?.lat ?? '-'}</span></li>
          <li>経度: <span>{latLng?.lng ?? '-'}</span></li>
        </ul>
      </div>
    </div>
  );
};

export { MyMapComponent };