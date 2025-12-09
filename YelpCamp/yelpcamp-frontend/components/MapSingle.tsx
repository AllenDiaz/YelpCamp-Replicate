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
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !mapContainer.current) return;

    if (!apiKey || apiKey === 'your_maptiler_api_key_here') {
      console.error('MapTiler API key is missing or invalid');
      return;
    }

    initialized.current = true;
    maptilersdk.config.apiKey = apiKey;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/openstreetmap/style.json?key=${apiKey}`,
      center: [longitude, latitude],
      zoom: 10,
    });

    map.current.on('load', () => {
      new maptilersdk.Marker({ color: '#FF0000' })
        .setLngLat([longitude, latitude])
        .setPopup(
          new maptilersdk.Popup().setHTML(`<h3 class="font-bold">${title}</h3>`)
        )
        .addTo(map.current);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        initialized.current = false;
      }
    };
  }, [longitude, latitude, title, apiKey]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[300px] rounded-lg shadow-lg bg-gray-200"
      style={{ minHeight: '300px' }}
    />
  );
}
