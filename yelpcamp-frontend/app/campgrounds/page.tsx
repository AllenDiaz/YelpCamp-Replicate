'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { campgroundAPI } from '@/lib/api';
import { useToastStore, useAuthStore } from '@/lib/store';
import MapCluster from '@/components/MapCluster';

interface Campground {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: Array<{ url: string }>;
  geometry: {
    coordinates: [number, number];
  };
}

export default function CampgroundsPage() {
  const [campgrounds, setCampgrounds] = useState<Campground[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useToastStore((state) => state.showToast);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const fetchCampgrounds = async () => {
      try {
        const response = await campgroundAPI.getAll();
        setCampgrounds(response.data.campgrounds || []);
      } catch (error: any) {
        showToast('Failed to load campgrounds', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampgrounds();
  }, [showToast]);

  // Transform campgrounds for map
  const geoJSONFeatures = Array.isArray(campgrounds) ? campgrounds.map((camp) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: camp.geometry.coordinates,
    },
    properties: {
      popupMarkup: `<a href="/campgrounds/${camp._id}"><strong>${camp.title}</strong></a><p>${camp.location}</p>`,
      id: camp._id,
    },
  })) : [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-secondary-600">Loading campgrounds...</p>
        </div>
      </div>
    );
  }

  const mapApiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || ''; 
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Map - Always display, even with no campgrounds */}
      <MapCluster
        campgrounds={geoJSONFeatures}
        apiKey={mapApiKey}
      />

      {/* Header */}
      <div className="flex justify-between items-center my-6">
        <h1 className="text-3xl font-bold text-secondary-800">All Campgrounds</h1>
        {isAuthenticated && (
          <Link
            href="/campgrounds/new"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Add Campground
          </Link>
        )}
      </div>

      {/* Campgrounds List */}
      <div className="space-y-6">
        {campgrounds.length === 0 ? (
          <p className="text-center text-secondary-600 py-12">
            No campgrounds found. Be the first to add one!
          </p>
        ) : (
          campgrounds.map((campground) => (
            <div
              key={campground._id}
              className="glass-card rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-1/3">
                  <img
                    src={
                      campground.images.length > 0
                        ? campground.images[0].url
                        : 'https://res.cloudinary.com/douqbebwk/image/upload/v1600103881/YelpCamp/lz8jjv2gyynjil7lswf4.png'
                    }
                    alt={campground.title}
                    className="w-full h-64 object-cover"
                  />
                </div>

                {/* Content */}
                <div className="md:w-2/3 p-6">
                  <h2 className="text-2xl font-bold mb-2 text-secondary-800">{campground.title}</h2>
                  <p className="text-secondary-700 mb-3">{campground.description}</p>
                  <p className="text-sm text-secondary-500 mb-4">
                    📍 {campground.location}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-accent-600">
                      ${campground.price}/night
                    </span>
                    <Link
                      href={`/campgrounds/${campground._id}`}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
