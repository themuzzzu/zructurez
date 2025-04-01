import { useState } from "react";
import { BusinessCardRating } from "./BusinessCardRating";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BusinessCardProps {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  contact: string;
  hours: string;
  verified: boolean;
  appointment_price?: number;
  consultation_price?: number;
  is_open: boolean;
  wait_time?: string;
  closure_reason?: string;
}

export const BusinessCard = ({
  id,
  name,
  category,
  description,
  image,
  rating,
  reviews,
  location,
  contact,
  hours,
  verified,
  appointment_price,
  consultation_price,
  is_open,
  wait_time,
  closure_reason
}: BusinessCardProps) => {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-500">{category}</p>
        <BusinessCardRating rating={rating} reviews={reviews} businessId={id} />
        <p className="text-sm text-gray-700 mt-2">{description}</p>
        <p className="text-sm text-gray-500">{location}</p>
        <p className="text-sm text-gray-500">{contact}</p>
        <p className="text-sm text-gray-500">{hours}</p>
        {verified && <span className="text-xs text-green-500">Verified</span>}
        <div className="mt-4">
          <Button asChild>
            <Link to={`/businesses/${id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
