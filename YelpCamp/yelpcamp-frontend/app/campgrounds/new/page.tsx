'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { campgroundAPI } from '@/lib/api';
import { useToastStore } from '@/lib/store';

interface CampgroundForm {
  title: string;
  location: string;
  price: number;
  description: string;
}

export default function NewCampgroundPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const router = useRouter();
  const showToast = useToastStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CampgroundForm>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const onSubmit = async (data: CampgroundForm) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      // Backend expects data nested under 'campground' key
      formData.append('campground[title]', data.title);
      formData.append('campground[location]', data.location);
      formData.append('campground[price]', data.price.toString());
      formData.append('campground[description]', data.description);

      // Append multiple images
      if (selectedFiles) {
        Array.from(selectedFiles).forEach((file) => {
          formData.append('image', file);
        });
      }

      const response = await campgroundAPI.create(formData);
      showToast('Campground created successfully!', 'success');
      const campgroundId = response.data.campground?._id || response.data._id;
      router.push(`/campgrounds/${campgroundId}`);
    } catch (error: any) {
      showToast(
        error.response?.data?.message || 'Failed to create campground',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">New Campground</h1>

        <div className="bg-surface rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.title ? 'border-error' : 'border-border'
                }`}
                {...register('title', {
                  required: 'Title is required',
                })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-error">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.location ? 'border-error' : 'border-border'
                }`}
                {...register('location', {
                  required: 'Location is required',
                })}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-error">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Campground Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-secondary-500">₱</span>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.price ? 'border-error' : 'border-border'
                  }`}
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' },
                  })}
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-error">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.description ? 'border-error' : 'border-border'
                }`}
                {...register('description', {
                  required: 'Description is required',
                })}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Images */}
            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Images
              </label>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-sm text-secondary-500">
                You can select multiple images
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:bg-secondary-400"
              >
                {isLoading ? 'Creating...' : 'Create Campground'}
              </button>
              <Link
                href="/campgrounds"
                className="px-6 py-2 bg-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-400 transition text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
