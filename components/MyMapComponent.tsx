'use client';
import React, { useRef, useEffect, useState } from "react";
import setCurrentLocationMarker from "@/components/setCurrentLocationMarker";
import createInfoWindowContent from "@/components/createInfoWindowContent";
import CurrentLocationButton from "@/components/currentLocation";
import styles from './searchbutton.module.css'

const MyMapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  
  const mapStyles = [
    {
      elementType: "geometry",
      stylers: [{ color: "#E5E4E4" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#886771" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "b8b6b6" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#be859f" }],
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current) {
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
            zoomControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            mapTypeId: "roadmap",
            styles: mapStyles, // ここでカスタムスタイルを適用
            gestureHandling: "greedy"
          });
          setMap(newMap);

          if (location) {
            setCurrentLocationMarker(newMap, location);
          }

          const input = document.getElementById("pac-input") as HTMLInputElement;
          if (input) {
            const searchBox = new google.maps.places.SearchBox(input);

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
                place.geometry.location.lat()
                const infoWindow = new google.maps.InfoWindow({
                  content: createInfoWindowContent(place.geometry.location.lat(), place.geometry.location.lng()), // デフォルト値を設定
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
              if (latLng && window !== undefined) {
                const confirmPin = window.confirm("ここにピンを指しますか？");
                if (confirmPin) {
                  const newMarker = new google.maps.Marker({
                    position: latLng,
                    map: newMap,
                  });

                  const infoWindowContent = createInfoWindowContent(latLng.lat(), latLng.lng());
                  const infoWindow = new google.maps.InfoWindow({
                    content: infoWindowContent,
                    pixelOffset: new google.maps.Size(0, -50),
                  });

                  newMarker.addListener("click", () => {
                    infoWindow.open(newMap, newMarker);
                  });

                  newMap.panTo(latLng);
                }
              }
            });
          } else {
            console.error("Failed to find the search box input element.");
          }
        },
        (error) => {
          console.error("Error retrieving location: ", error);
          const fallbackLocation = { lat: -33.8688, lng: 151.2093 };
          const newMap = new google.maps.Map(mapRef.current!, {
            center: fallbackLocation,
            zoom: 13,
            mapTypeId: "roadmap",
            styles: mapStyles, // ここでカスタムスタイルを適用
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
      <input id="pac-input" className={styles.controls} type="text" placeholder="Search" />
      <div ref={mapRef} className="min-h-screen w-screen" />
      <CurrentLocationButton map={map} currentLocation={currentLocation} />
    </div>
  );
};

export { MyMapComponent };
