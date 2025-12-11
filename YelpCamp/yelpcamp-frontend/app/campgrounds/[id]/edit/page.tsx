'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

interface Campground {
  _id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  images?: Array<{ url: string; filename: string }>;
  geometry?: {
    type: string;
    coordinates: number[];
  };
  author?: {
    _id: string;
    username: string;
  };
  reviews?: string[];
}

export default function EditCampgroundPage() {
  const params = useParams();
  const router = useRouter();
  const [campground, setCampground] = useState<Campground | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [deleteImages, setDeleteImages] = useState<string[]>([]);
  const showToast = useToastStore((state) => state.showToast);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CampgroundForm>();

  useEffect(() => {
    const fetchCampground = async () => {
      try {
        const response = await campgroundAPI.getById(params.id as string);
        const data = response.data.campground;
        setCampground(data);
        
        // Populate form
        setValue('title', data.title);
        setValue('location', data.location);
        setValue('price', data.price);
        setValue('description', data.description);
      } catch (error: any) {
        showToast('Failed to load campground', 'error');
        router.push('/campgrounds');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampground();
  }, [params.id, setValue, showToast, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const toggleDeleteImage = (filename: string) => {
    setDeleteImages((prev) =>
      prev.includes(filename)
        ? prev.filter((f) => f !== filename)
        : [...prev, filename]
    );
  };

  const onSubmit = async (data: CampgroundForm) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('location', data.location);
      formData.append('price', data.price.toString());
      formData.append('description', data.description);

      // Append new images
      if (selectedFiles) {
        Array.from(selectedFiles).forEach((file) => {
          formData.append('image', file);
        });
      }

      // Append images to delete
      deleteImages.forEach((filename) => {
        formData.append('deleteImages[]', filename);
      });

      await campgroundAPI.update(params.id as string, formData);
      showToast('Campground updated successfully!', 'success');
      router.push(`/campgrounds/${params.id}`);
    } catch (error: any) {
      showToast(
        error.response?.data?.message || 'Failed to update campground',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-secondary-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!campground) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Edit Campground</h1>

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
                <span className="absolute left-3 top-2 text-secondary-500">$</span>
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

            {/* Current Images */}
            {campground.images && campground.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Current Images (check to delete)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {campground.images.map((image) => (
                    <div key={image.filename} className="relative">
                      <img
                        src={image.url}
                        alt={image.filename}
                        className="w-full h-32 object-cover rounded"
                      />
                      <label className="flex items-center mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={deleteImages.includes(image.filename)}
                          onChange={() => toggleDeleteImage(image.filename)}
                          className="mr-2"
                        />
                        <span className="text-sm">Delete</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Images */}
            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Add New Images
              </label>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:bg-secondary-400"
              >
                {isSubmitting ? 'Updating...' : 'Update Campground'}
              </button>
              <Link
                href={`/campgrounds/${params.id}`}
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
