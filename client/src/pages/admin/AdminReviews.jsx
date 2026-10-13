import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Trash2, Check, X } from 'lucide-react';
import { reviewAPI } from '../../services/api';
import { SAMPLE_REVIEWS } from '../../utils/sampleData';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await reviewAPI.getAllReviews();
        if (Array.isArray(res.reviews)) setReviews(res.reviews);
      } catch (err) {
        console.warn(err);
      }
    };
    fetchReviews();
  }, []);

  const handleToggleApprove = async (rev) => {
    const newStatus = !rev.isApproved;
    try {
      if (rev._id) await reviewAPI.updateReviewStatus(rev._id, newStatus);
      setReviews(reviews.map(r => (r._id === rev._id || r.id === rev.id) ? { ...r, isApproved: newStatus } : r));
    } catch (err) {
      setReviews(reviews.map(r => (r._id === rev._id || r.id === rev.id) ? { ...r, isApproved: newStatus } : r));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this review?')) {
      try {
        await reviewAPI.deleteReview(id);
        setReviews(reviews.filter(r => r._id !== id && r.id !== id));
      } catch (err) {
        setReviews(reviews.filter(r => r._id !== id && r.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Customer Reviews Moderation</h1>
        <p className="text-xs text-gray-500 mt-1">Approve, moderate, or remove customer feedback.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
          <Star className="w-8 h-8 mx-auto mb-2 opacity-30 text-mustard" />
          <p className="font-medium text-xs">No customer reviews submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev, idx) => (
          <div key={rev._id || rev.id || idx} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-mustard">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-mustard' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                rev.isApproved !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {rev.isApproved !== false ? 'Approved' : 'Pending'}
              </span>
            </div>

            <h4 className="font-bold text-gray-900 font-serif text-sm">"{rev.title}"</h4>
            <p className="text-xs text-gray-600 italic">"{rev.comment}"</p>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-gray-900">{rev.reviewerName}</span>
                <span className="text-gray-500 text-[11px] ml-1">({rev.location || 'India'})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleApprove(rev)}
                  className={`p-1.5 rounded-lg text-xs font-bold ${
                    rev.isApproved !== false ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-emerald-600 text-white'
                  }`}
                  title={rev.isApproved !== false ? 'Hide Review' : 'Approve Review'}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(rev._id || rev.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default AdminReviews;

