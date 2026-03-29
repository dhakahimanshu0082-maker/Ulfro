'use client';

import RatingStars from './RatingStars';

export default function ReviewCard({ review }) {
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-author">
          <span className="review-avatar">
            {review.reviewer?.full_name ? review.reviewer.full_name[0].toUpperCase() : '?'}
          </span>
          <div>
            <div className="review-author-name">{review.reviewer?.full_name || 'User'}</div>
            <div className="review-date">
              {new Date(review.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
        <RatingStars rating={review.rating} size="small" />
      </div>

      {review.task && (
        <div className="review-task-ref">
          📋 {review.task.title}
        </div>
      )}

      {review.comment && (
        <p className="review-comment">{review.comment}</p>
      )}
    </div>
  );
}
