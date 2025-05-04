import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client'; // Assuming client setup for now, might need server client later
import { createClient } from '@/lib/supabase/server';
import { ReviewSubmission, ReviewResponse } from '@/types/review';

// GET /api/reviews?productId=[productId]
// Fetches reviews for a given product ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    // Fetch reviews from Supabase where product_id matches
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*') // Select all columns for now
      .eq('product_id', productId)
      .order('created_at', { ascending: false }); // Show newest reviews first

    if (error) {
      console.error('Supabase error fetching reviews:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews', details: error.message }, { status: 500 });
    }

    return NextResponse.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// POST /api/reviews
// Submits a new review
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const reviewData: ReviewSubmission = body;
    
    // Basic validation
    if (!reviewData.productId || !reviewData.rating) {
      return NextResponse.json(
        { error: 'Product ID and rating are required' },
        { status: 400 }
      );
    }
    
    // Rating must be between 1 and 5
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Create Supabase client
    const supabase = createClient();
    
    // Get user information if authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    // Anonymous reviews are allowed, but we'll track user ID if authenticated
    const userId = session?.user?.id || null;
    const userName = reviewData.userName || (session?.user?.user_metadata?.full_name || 'Anonymous');
    
    // Prepare review data for insertion
    const newReview = {
      productId: reviewData.productId,
      userId,
      userName,
      rating: reviewData.rating,
      title: reviewData.title || '',
      reviewText: reviewData.reviewText || '',
      isVerified: !!userId, // Verified if the user is logged in
      images: reviewData.images || [],
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
    };
    
    // Insert review into database
    const { data: insertedReview, error } = await supabase
      .from('reviews')
      .insert(newReview)
      .select()
      .single();
    
    // Handle database insertion error
    if (error) {
      console.error('Error inserting review:', error);
      return NextResponse.json(
        { error: 'Failed to submit review' },
        { status: 500 }
      );
    }
    
    // Update product average rating
    await updateProductRating(supabase, reviewData.productId);
    
    // Return success response with the inserted review
    return NextResponse.json({
      success: true,
      review: insertedReview
    }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH handler to update a review
export async function PATCH(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { reviewId, ...updateData } = body;
    
    // Validate review ID
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }
    
    // Create Supabase client
    const supabase = createClient();
    
    // Get user information
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    // Only allow users to update their own reviews
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Fetch the review to check ownership
    const { data: review, error: fetchError } = await supabase
      .from('reviews')
      .select('userId, productId')
      .eq('id', reviewId)
      .single();
    
    if (fetchError) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the review or is an admin
    const isAdmin = session.user.app_metadata?.role === 'admin';
    if (review.userId !== session.user.id && !isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized to update this review' },
        { status: 403 }
      );
    }
    
    // Prepare update data
    const updatedReview = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    
    // Update the review
    const { data: updated, error: updateError } = await supabase
      .from('reviews')
      .update(updatedReview)
      .eq('id', reviewId)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating review:', updateError);
      return NextResponse.json(
        { error: 'Failed to update review' },
        { status: 500 }
      );
    }
    
    // Update product rating if rating changed
    if (updateData.rating) {
      await updateProductRating(supabase, review.productId);
    }
    
    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    console.error('Unexpected error in PATCH /api/reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a review
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');
    
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }
    
    // Create Supabase client
    const supabase = createClient();
    
    // Get user information
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    // Only allow users to delete their own reviews
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Fetch the review to check ownership and get product ID
    const { data: review, error: fetchError } = await supabase
      .from('reviews')
      .select('userId, productId')
      .eq('id', reviewId)
      .single();
    
    if (fetchError) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns the review or is an admin
    const isAdmin = session.user.app_metadata?.role === 'admin';
    if (review.userId !== session.user.id && !isAdmin) {
      return NextResponse.json(
        { error: 'Not authorized to delete this review' },
        { status: 403 }
      );
    }
    
    // Delete the review
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);
    
    if (deleteError) {
      console.error('Error deleting review:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete review' },
        { status: 500 }
      );
    }
    
    // Update product rating after deletion
    await updateProductRating(supabase, review.productId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update product average rating
async function updateProductRating(supabase: any, productId: string) {
  try {
    // Calculate average rating
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('productId', productId);
    
    if (error) {
      console.error('Error calculating average rating:', error);
      return;
    }
    
    // Calculate the average rating
    const totalRatings = data.length;
    const sumRatings = data.reduce((sum: number, review: any) => sum + review.rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
    
    // Update the product's average rating
    await supabase
      .from('products')
      .update({
        rating: averageRating,
        reviewCount: totalRatings,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', productId);
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
} 