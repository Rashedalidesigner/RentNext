import React, { useState } from 'react';
import { Star, X, CheckCircle, MessageSquare, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RentalRequest } from '../../types';

interface ReviewModalProps {
  request: RentalRequest;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ request, isOpen, onClose }) => {
  const { addReview } = useApp();

  const [rating, setRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [locationRating, setLocationRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    await addReview({
      propertyId: request.propertyId,
      requestId: request.id,
      rating,
      cleanlinessRating,
      communicationRating,
      locationRating,
      comment,
    });

    setIsSubmitting(false);
    onClose();
  };

  const StarPicker = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (v: number) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => onChange(star)}
            className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors"
          >
            <Star
              className={`w-5 h-5 ${
                star <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-bold text-slate-800 ml-1.5 w-6 text-right">
          {value}.0
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Verified Tenant Review</span>
          </div>
          <h3 className="text-lg font-bold text-white line-clamp-1">{request.propertyTitle}</h3>
          <p className="text-xs text-slate-300">
            Share your authentic living experience with future renters.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {/* Star Categories */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <StarPicker value={rating} onChange={setRating} label="Overall Experience" />
            <StarPicker
              value={cleanlinessRating}
              onChange={setCleanlinessRating}
              label="Property Cleanliness & Condition"
            />
            <StarPicker
              value={communicationRating}
              onChange={setCommunicationRating}
              label="Landlord Communication & Responsiveness"
            />
            <StarPicker
              value={locationRating}
              onChange={setLocationRating}
              label="Neighborhood & Location Accuracy"
            />
          </div>

          {/* Comment Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Your Written Review</span>
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you love about this property? How was the check-in and communication with the host?"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
