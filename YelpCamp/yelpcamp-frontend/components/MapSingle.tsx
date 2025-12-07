'use client';

import { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

interface MapSingleProps {
  longitude: number;
  latitude: number;
  title: string;
  apiKey: string;
}

export default function MapSingle({ longitude, latitude, title, apiKey }: MapSingleProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    maptilersdk.config.apiKey = apiKey;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [longitude, latitude],
      zoom: 10,
    });

    new maptilersdk.Marker({ color: '#FF0000' })
      .setLngLat([longitude, latitude])
      .setPopup(
        new maptilersdk.Popup().setHTML(`<h3 class="font-bold">${title}</h3>`)
      )
      .addTo(map.current);

    return () => {
      if (map.current) map.current.remove();
    };
  }, [longitude, latitude, title, apiKey]);

  return <div ref={mapContainer} className="w-full h-[300px] rounded-lg" />;
}
