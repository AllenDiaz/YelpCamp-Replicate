'use client';

import { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

interface MapClusterProps {
  campgrounds: any[];
  apiKey: string;
}

export default function MapCluster({ campgrounds, apiKey }: MapClusterProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !mapContainer.current) return;

    if (!apiKey || apiKey === 'your_maptiler_api_key_here') {
      console.error('MapTiler API key is missing or invalid:', apiKey);
      return;
    }

    console.log('Number of campgrounds to display:', campgrounds.length);
    
    initialized.current = true;
    maptilersdk.config.apiKey = apiKey;

    // Use OpenStreetMap style (no deprecation warnings)
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/openstreetmap/style.json?key=${apiKey}`,
      center: [120.9842, 14.5995], // Center of Philippines
      zoom: 3,
    });

    map.current.on('load', () => {
      // Add campgrounds as GeoJSON
      map.current.addSource('campgrounds', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: campgrounds,
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Cluster circles
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#3b82f6',
            10,
            '#8b5cf6',
            30,
            '#ec4899',
          ],
          'circle-radius': ['step', ['get', 'point_count'], 20, 10, 25, 30, 30],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
        },
      });

      // Cluster count
      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Noto Sans Regular'],
          'text-size': 14,
        },
        paint: {
          'text-color': '#ffffff',
        },
      });

      // Unclustered points
      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'campgrounds',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#3b82f6',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
        },
      });

      // Click on cluster to zoom
      map.current.on('click', 'clusters', (e: any) => {
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        });
        const clusterId = features[0].properties.cluster_id;
        map.current
          .getSource('campgrounds')
          .getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
            if (err) return;
            map.current.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });

      // Show popup on unclustered point click
      map.current.on('click', 'unclustered-point', (e: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const { popupMarkup } = e.features[0].properties;

        new maptilersdk.Popup()
          .setLngLat(coordinates)
          .setHTML(popupMarkup)
          .addTo(map.current);
      });

      map.current.on('mouseenter', 'clusters', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'clusters', () => {
        map.current.getCanvas().style.cursor = '';
      });
      map.current.on('mouseenter', 'unclustered-point', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'unclustered-point', () => {
        map.current.getCanvas().style.cursor = '';
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        initialized.current = false;
      }
    };
  }, [campgrounds, apiKey]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[500px] rounded-lg shadow-lg bg-gray-200"
      style={{ minHeight: '500px' }}
    />
  );
}
