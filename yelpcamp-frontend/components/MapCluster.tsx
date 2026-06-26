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

        new maptilersdk.Popup({
          className: 'custom-popup',
          closeButton: true,
          closeOnClick: true,
        })
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
    <>
      <style jsx global>{`
        /* Light mode styles */
        .custom-popup .maplibregl-popup-content,
        .custom-popup .maptiler-popup-content {
          background-color: #ffffff !important;
          padding: 12px !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        
        .custom-popup .maplibregl-popup-tip,
        .custom-popup .maptiler-popup-tip {
          border-top-color: #ffffff !important;
        }
        
        .custom-popup a {
          color: #3b82f6 !important;
          text-decoration: none !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          display: block !important;
        }
        
        .custom-popup a:hover {
          color: #2563eb !important;
          text-decoration: underline !important;
        }
        
        .custom-popup p {
          margin: 4px 0 0 0 !important;
          color: #1f2937 !important;
          font-size: 14px !important;
        }
        
        .custom-popup .maplibregl-popup-close-button,
        .custom-popup .maptiler-popup-close-button {
          color: #1f2937 !important;
          font-size: 20px !important;
          font-weight: bold !important;
        }

        /* Dark mode styles */
        .dark .custom-popup .maplibregl-popup-content,
        .dark .custom-popup .maptiler-popup-content {
          background-color: #1f2937 !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2) !important;
        }
        
        .dark .custom-popup .maplibregl-popup-tip,
        .dark .custom-popup .maptiler-popup-tip {
          border-top-color: #1f2937 !important;
        }
        
        .dark .custom-popup a {
          color: #60a5fa !important;
        }
        
        .dark .custom-popup a:hover {
          color: #93c5fd !important;
        }
        
        .dark .custom-popup p {
          color: #d1d5db !important;
        }
        
        .dark .custom-popup .maplibregl-popup-close-button,
        .dark .custom-popup .maptiler-popup-close-button {
          color: #d1d5db !important;
        }
      `}</style>
      <div 
        ref={mapContainer} 
        className="w-full h-[500px] rounded-lg shadow-lg bg-gray-200"
        style={{ minHeight: '500px' }}
      />
    </>
  );
}
