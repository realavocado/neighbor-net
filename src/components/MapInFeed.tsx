import { useCollection } from "@nandorojo/swr-firestore";
import { Map, Marker, Popup, PopupEvent } from "react-map-gl";
import { IoLocationSharp } from "react-icons/io5";
import { Col, Row, Button, useTheme, Text, Card } from "@nextui-org/react";
import { useState } from "react";

interface MapInFeedInterface {
  longitude: number;
  latitude: number;
}

export default function MapInFeed(props: MapInFeedInterface) {
  const { type, isDark } = useTheme();
  const token =
    "pk.eyJ1IjoibGVvc20wNyIsImEiOiJjbGVicjdueHgxMmoxM25xZ2JqZWVkbTFjIn0.nv1GEej-EtMR1ouVUYVM_w";
  const height = typeof window === 'undefined' ? 100 : window.innerHeight;

  return (
    <>
      <Map
        initialViewState={{
          longitude: props.longitude,
          latitude: props.latitude,
          zoom: 16,
        }}
        // style={{ width: "100%", height: "50hv"}}
        mapStyle={
          isDark
            ? "mapbox://styles/mapbox/dark-v11"
            : "mapbox://styles/mapbox/light-v11"
        }
        mapboxAccessToken={token}
        padding={{right: 0, top: 0, left: 0, bottom: height/2}}
        // projection={"globe"}
      >
        <Marker
          key = "marker"
          longitude={props.longitude}
          latitude={props.latitude}
          anchor="bottom-left"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
          }}
        >
        </Marker>
      </Map>
    </>
  );
}
