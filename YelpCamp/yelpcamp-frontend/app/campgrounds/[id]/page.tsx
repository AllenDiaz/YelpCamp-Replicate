'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { campgroundAPI, reviewAPI } from '@/lib/api';
import { useToastStore, useAuthStore } from '@/lib/store';
import ImageCarousel from '@/components/ImageCarousel';
import MapSingle from '@/components/MapSingle';
import StarRating from '@/components/StarRating';
import { useForm } from 'react-hook-form';

interface Review {
  _id: string;
  rating: number;
  body: string;
  author: {
    _id: string;
    username: string;
  };
}

interface Campground {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: Array<{ url: string; filename: string }>;
  geometry: {
    coordinates: [number, number];
  };
  author: {
    _id: string;
    username: string;
  };
  reviews: Review[];
}

interface ReviewForm {
  rating: number;
  body: string;
}

export default function CampgroundDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [campground, setCampground] = useState<Campground | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const showToast = useToastStore((state) => state.showToast);
  const { user, isAuthenticated } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewForm>();

  useEffect(() => {
    const fetchCampground = async () => {
      try {
        const response = await campgroundAPI.getById(params.id as string);
        setCampground(response.data);
      } catch (error: any) {
        showToast('Failed to load campground', 'error');
        router.push('/campgrounds');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampground();
  }, [params.id, showToast, router]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this campground?')) return;

    try {
      await campgroundAPI.delete(params.id as string);
      showToast('Campground deleted successfully', 'success');
      router.push('/campgrounds');
    } catch (error: any) {
      showToast('Failed to delete campground', 'error');
    }
  };

  const onSubmitReview = async (data: ReviewForm) => {
    try {
      const response = await reviewAPI.create(params.id as string, {
        ...data,
        rating,
      });
      showToast('Review added successfully', 'success');
      
      // Add new review to state
      if (campground) {
        setCampground({
          ...campground,
          reviews: [...campground.reviews, response.data],
        });
      }
      
      reset();
      setRating(0);
    } catch (error: any) {
      showToast('Failed to add review', 'error');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviewAPI.delete(params.id as string, reviewId);
      showToast('Review deleted successfully', 'success');
      
      // Remove review from state
      if (campground) {
        setCampground({
          ...campground,
          reviews: campground.reviews.filter((r) => r._id !== reviewId),
        });
      }
    } catch (error: any) {
      showToast('Failed to delete review', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!campground) return null;

  const isOwner = user && campground.author._id === user._id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <h1 className="text-3xl font-bold mb-4">Campground Detail</h1>
          
          {/* Image Carousel */}
          <ImageCarousel images={campground.images} />

          {/* Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="text-2xl font-bold mb-2">{campground.title}</h2>
            <p className="text-gray-700 mb-4">{campground.description}</p>
            
            <div className="space-y-2 text-gray-600">
              <p>📍 Location: {campground.location}</p>
              <p>👤 Submitted by: {campground.author.username}</p>
              <p className="text-xl font-bold text-blue-600">
                ${campground.price}/night
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Link
                href="/campgrounds"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                All Campgrounds
              </Link>
              
              {isOwner && (
                <>
                  <Link
                    href={`/campgrounds/${campground._id}/edit`}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Map */}
          <MapSingle
            longitude={campground.geometry.coordinates[0]}
            latitude={campground.geometry.coordinates[1]}
            title={campground.title}
            apiKey={process.env.NEXT_PUBLIC_MAPTILER_API_KEY || ''}
          />

          {/* Review Form */}
          {isAuthenticated && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-4">
              <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
              
              <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <StarRating rating={rating} onChange={setRating} />
                  {rating === 0 && (
                    <p className="mt-1 text-sm text-red-600">
                      Please select a rating
                    </p>
                  )}
                </div>

                {/* Review Body */}
                <div>
                  <label
                    htmlFor="body"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Review
                  </label>
                  <textarea
                    id="body"
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.body ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...register('body', {
                      required: 'Review text is required',
                    })}
                  />
                  {errors.body && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.body.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={rating === 0}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="mt-4 space-y-4">
            {campground.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <StarRating rating={review.rating} readonly />
                    <p className="text-sm text-gray-600 mt-1">
                      by {review.author.username}
                    </p>
                  </div>
                  
                  {user && review.author._id === user._id && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-gray-700">{review.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
