"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, ThumbsDown, Flag, Image as ImageIcon, Calendar, Check, Filter, SlidersHorizontal, PlusCircle, User, ChevronDown, ChevronUp, Search, X, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Review, ReviewStats, ReviewSubmission } from "@/types/review";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { H3, H4, Paragraph, Muted } from "@/components/ui/typography";

// Star rating input component
const StarRating = ({ value, onChange, readOnly = false }: { value: number; onChange?: (rating: number) => void; readOnly?: boolean }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={cn(
            "h-7 w-7 focus:outline-none",
            readOnly && "cursor-default"
          )}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          onClick={() => !readOnly && onChange && onChange(star)}
          disabled={readOnly}
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors",
              (hoverRating ? hoverRating >= star : value >= star)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
};

// Review card component
const ReviewCard = ({ review }: { review: Review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  
  // Handle helpful/unhelpful votes
  const handleHelpfulVote = (helpful: boolean) => {
    if (isHelpful !== null) return; // Already voted
    
    setIsHelpful(helpful);
    if (helpful) {
      setHelpfulCount(prev => prev + 1);
    }
    
    // In a real app, you would call an API here to record the vote
    toast({
      title: "Thank you for your feedback",
      description: helpful 
        ? "We're glad you found this review helpful." 
        : "Thanks for letting us know.",
    });
  };
  
  // Calculate if review should be truncated (more than 3 lines)
  const shouldTruncate = review.reviewText.length > 250;
  
  // Format date
  const formattedDate = review.createdAt 
    ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })
    : '';
  
  return (
    <div className="border border-border rounded-lg p-5 mb-5 hover:shadow-sm transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="bg-muted h-10 w-10 rounded-full flex items-center justify-center mr-3">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <div className="font-medium text-foreground">{review.userName || "Anonymous"}</div>
            {review.isVerified && (
              <div className="text-xs text-green-600 flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Verified Purchase
              </div>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          {formattedDate}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <StarRating value={review.rating} readOnly />
          {review.title && (
            <h4 className="font-semibold ml-3 text-foreground">{review.title}</h4>
          )}
        </div>
        
        <div className="text-muted-foreground leading-relaxed">
          {shouldTruncate && !isExpanded ? (
            <>
              <p>{review.reviewText.substring(0, 250)}...</p>
              <Button 
                onClick={() => setIsExpanded(true)} 
                variant="link"
                className="p-0 h-auto text-primary font-medium mt-2"
              >
                Read more
              </Button>
            </>
          ) : (
            <p>{review.reviewText}</p>
          )}
          
          {shouldTruncate && isExpanded && (
            <Button 
              onClick={() => setIsExpanded(false)} 
              variant="link"
              className="p-0 h-auto text-primary font-medium mt-2"
            >
              Show less
            </Button>
          )}
        </div>
      </div>
      
      {/* Review images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 mt-3 overflow-x-auto pb-2">
          {review.images.map((img, index) => (
            <div 
              key={index} 
              className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0 bg-muted border border-border"
            >
              <img 
                src={img} 
                alt={`Review ${index + 1}`} 
                className="h-full w-full object-cover" 
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Helpful buttons */}
      <div className="flex items-center mt-4 pt-3 border-t border-border">
        <div className="text-sm text-muted-foreground mr-4">
          Was this review helpful?
        </div>
        <Button
          onClick={() => handleHelpfulVote(true)}
          variant={isHelpful === true ? "secondary" : "outline"}
          size="sm"
          className={cn(
            "text-sm mr-2 h-8",
            isHelpful === true && "bg-primary/10 text-primary border-primary/20"
          )}
          disabled={isHelpful !== null}
        >
          <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
          {helpfulCount > 0 && <span className="mr-1">{helpfulCount}</span>}
          Yes
        </Button>
        <Button
          onClick={() => handleHelpfulVote(false)}
          variant="outline"
          size="sm"
          className="text-sm h-8"
          disabled={isHelpful !== null}
        >
          <ThumbsDown className="h-3.5 w-3.5 mr-1.5" />
          No
        </Button>
      </div>
    </div>
  );
};

// Review form component
const ReviewForm = ({ productId, onReviewSubmitted }: { productId: string, onReviewSubmitted: () => void }) => {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<ReviewSubmission>({
    defaultValues: {
      productId,
      rating: 0,
      title: '',
      reviewText: '',
      userName: '',
      images: []
    }
  });
  
  const rating = watch('rating');
  
  // Handle form submission
  const onSubmit = async (data: ReviewSubmission) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Show success toast
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      
      // Reset form
      reset();
      
      // Notify parent component
      onReviewSubmitted();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle rating change
  const handleRatingChange = (value: number) => {
    setValue('rating', value);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rating" className="text-base font-medium">Your Rating</Label>
          <div className="flex items-center">
            <StarRating 
              value={rating} 
              onChange={handleRatingChange} 
            />
            <span className="ml-2 text-sm text-muted-foreground">
              {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
            </span>
          </div>
          {errors.rating && (
            <p className="text-destructive text-sm mt-1">Please select a rating</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title" className="text-base font-medium">Review Title (Optional)</Label>
          <Input
            id="title"
            placeholder="Summarize your experience"
            className="w-full"
            {...register('title')}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reviewText" className="text-base font-medium">Your Review</Label>
          <Textarea
            id="reviewText"
            placeholder="What did you like or dislike? How was your experience with this product?"
            rows={5}
            className="w-full resize-none"
            {...register('reviewText', { required: 'Please share your thoughts about this product' })}
          />
          {errors.reviewText && (
            <p className="text-destructive text-sm mt-1">{errors.reviewText.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="userName" className="text-base font-medium">Your Name (Optional)</Label>
          <Input
            id="userName"
            placeholder="How should we display your name?"
            className="w-full"
            {...register('userName')}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Leave blank to submit anonymously
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-base font-medium">Add Photos (Coming Soon)</Label>
          <div className="border-2 border-dashed rounded-md p-8 text-center bg-muted/40">
            <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              This feature is coming soon. You'll be able to drag and drop images, or click to select files.
            </p>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || rating === 0}
          variant="default"
          size="lg"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
};

// Filter sidebar component
const ReviewFilters = ({ 
  stats, 
  activeFilters, 
  onFilterChange 
}: { 
  stats: ReviewStats; 
  activeFilters: Record<string, any>; 
  onFilterChange: (filters: Record<string, any>) => void;
}) => {
  // Handler for rating filter change
  const handleRatingFilter = (rating: number) => {
    const newFilters = { ...activeFilters };
    
    if (newFilters.rating === rating) {
      delete newFilters.rating;
    } else {
      newFilters.rating = rating;
    }
    
    onFilterChange(newFilters);
  };
  
  // Handler for checkbox filters
  const handleCheckboxFilter = (key: string) => {
    const newFilters = { ...activeFilters };
    newFilters[key] = !newFilters[key];
    
    if (!newFilters[key]) {
      delete newFilters[key];
    }
    
    onFilterChange(newFilters);
  };
  
  // Calculate percentage for rating bars
  const calculatePercentage = (count: number) => {
    if (stats.totalReviews === 0) return 0;
    return (count / stats.totalReviews) * 100;
  };
  
  return (
    <div className="space-y-5">
      {/* Star ratings filter */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium mb-2">Filter by Rating</h4>
        {[5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            className={cn(
              "flex items-center w-full hover:bg-muted/50 p-2 rounded transition-colors text-sm",
              activeFilters.rating === rating && "bg-primary/10 text-primary"
            )}
            onClick={() => handleRatingFilter(rating)}
          >
            <div className="flex items-center min-w-[80px]">
              <span className="mr-1.5">{rating}</span>
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1">& up</span>
            </div>
            <div className="w-full ml-3 mr-2">
              <Progress 
                value={calculatePercentage(stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution])} 
                className={cn("bg-muted", activeFilters.rating === rating && "bg-primary/20")}
              />
            </div>
            <div className="text-muted-foreground text-xs min-w-10 text-right">
              ({stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]})
            </div>
          </button>
        ))}
      </div>
      
      <Separator />
      
      {/* Other filters */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium mb-2">Additional Filters</h4>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="verified" 
            checked={!!activeFilters.verifiedOnly}
            onCheckedChange={() => handleCheckboxFilter('verifiedOnly')}
          />
          <Label htmlFor="verified" className="text-sm cursor-pointer">
            Verified Purchases ({stats.verifiedPurchases})
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="with-images" 
            checked={!!activeFilters.withImages}
            onCheckedChange={() => handleCheckboxFilter('withImages')}
          />
          <Label htmlFor="with-images" className="text-sm cursor-pointer">
            With Images ({stats.hasImages})
          </Label>
        </div>
      </div>
    </div>
  );
};

// Review statistics summary component
const ReviewSummary = ({ stats }: { stats: ReviewStats }) => {
  return (
    <div className="bg-muted/30 rounded-lg p-6 mb-8 border border-border">
      <H3 className="mb-6">Customer Reviews</H3>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Overall rating */}
        <div className="flex flex-col items-center justify-center md:w-1/4">
          <div className="text-4xl font-bold text-foreground">{stats.averageRating.toFixed(1)}</div>
          <div className="my-2">
            <StarRating value={stats.averageRating} readOnly />
          </div>
          <div className="text-sm text-muted-foreground">Based on {stats.totalReviews} reviews</div>
        </div>
        
        {/* Rating distribution */}
        <div className="flex-1">
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.ratingDistribution[rating] || 0;
              const percentage = stats.totalReviews > 0 
                ? Math.round((count / stats.totalReviews) * 100) 
                : 0;
              
              return (
                <div key={rating} className="flex items-center">
                  <div className="flex items-center w-20">
                    <span className="text-sm font-medium mr-2">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="w-full max-w-md mx-3">
                    <Progress 
                      value={percentage} 
                      className="h-2 bg-muted" 
                      indicatorClassName={cn(
                        rating >= 4 ? "bg-green-500" : 
                        rating === 3 ? "bg-yellow-500" : "bg-red-500"
                      )}
                    />
                  </div>
                  <div className="w-16 text-right text-sm text-muted-foreground">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main product reviews component
export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    },
    verifiedPurchases: 0,
    hasImages: 0
  });
  
  // Fetch reviews
  const fetchReviews = async () => {
    setLoading(true);
    try {
      // In a real app, you would include filters and sorting in the API call
      const response = await fetch(`/api/reviews?productId=${productId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      setReviews(data.reviews || []);
      
      // Calculate review statistics
      calculateStats(data.reviews || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate statistics from reviews
  const calculateStats = (reviewsData: Review[]) => {
    const totalReviews = reviewsData.length;
    
    if (totalReviews === 0) {
      setStats({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        verifiedPurchases: 0,
        hasImages: 0
      });
      return;
    }
    
    const sumRatings = reviewsData.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = sumRatings / totalReviews;
    
    // Count distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach(review => {
      const rating = Math.min(5, Math.max(1, review.rating)) as 1 | 2 | 3 | 4 | 5;
      distribution[rating]++;
    });
    
    const verifiedPurchases = reviewsData.filter(review => review.isVerified).length;
    const hasImages = reviewsData.filter(review => (review.images?.length || 0) > 0).length;
    
    setStats({
      averageRating,
      totalReviews,
      ratingDistribution: distribution,
      verifiedPurchases,
      hasImages
    });
  };
  
  // Load reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, [productId]);
  
  // Apply filters and sorting to reviews
  const filteredReviews = reviews.filter(review => {
    // Apply rating filter
    if (filters.rating && review.rating < filters.rating) {
      return false;
    }
    
    // Apply verified purchases filter
    if (filters.verifiedOnly && !review.isVerified) {
      return false;
    }
    
    // Apply with images filter
    if (filters.withImages && (!review.images || review.images.length === 0)) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const titleMatch = review.title?.toLowerCase().includes(query);
      const textMatch = review.reviewText?.toLowerCase().includes(query);
      const userMatch = review.userName?.toLowerCase().includes(query);
      
      return titleMatch || textMatch || userMatch;
    }
    
    return true;
  }).sort((a, b) => {
    // Apply sorting
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "helpful":
        return (b.helpfulCount || 0) - (a.helpfulCount || 0);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
  
  // Handle filter changes
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };
  
  return (
    <div className="overflow-hidden">
      {/* Review Summary */}
      <ReviewSummary stats={stats} />
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden lg:block lg:w-1/4">
          <div className="sticky top-24">
            <div className="bg-card rounded-lg border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Filter Reviews</h3>
                {Object.keys(filters).length > 0 && (
                  <Button 
                    onClick={() => handleFilterChange({})} 
                    variant="link"
                    className="text-xs h-auto p-0"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <ReviewFilters 
                stats={stats} 
                activeFilters={filters} 
                onFilterChange={handleFilterChange} 
              />
            </div>
          </div>
        </div>
        
        {/* Reviews Content */}
        <div className="flex-1">
          {/* Filter button mobile */}
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <H3>Customer Reviews</H3>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="py-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Filter Reviews</h3>
                    {Object.keys(filters).length > 0 && (
                      <Button 
                        onClick={() => handleFilterChange({})} 
                        variant="link"
                        className="text-sm h-auto p-0"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                  <ReviewFilters 
                    stats={stats} 
                    activeFilters={filters} 
                    onFilterChange={handleFilterChange} 
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Add review button */}
          <div className="mb-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2" size="lg">
                  <PlusCircle className="h-4 w-4" />
                  Write a review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <ReviewForm 
                    productId={productId} 
                    onReviewSubmitted={() => {
                      fetchReviews();
                      document.querySelector('[data-dialog-close]')?.click();
                    }} 
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Reviews list */}
          <div>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border border-border rounded-lg p-5 animate-pulse">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 bg-muted rounded-full" />
                      <div className="ml-3 space-y-2">
                        <div className="h-4 bg-muted rounded w-24" />
                        <div className="h-3 bg-muted rounded w-16" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredReviews.length > 0 ? (
              <div>
                {filteredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed rounded-lg border-border">
                <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <H4 className="mb-1">No reviews found</H4>
                <Paragraph className="text-muted-foreground mb-4">
                  {Object.keys(filters).length > 0 
                    ? 'Try adjusting your filters to see more reviews.' 
                    : 'Be the first to review this product.'}
                </Paragraph>
                {Object.keys(filters).length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleFilterChange({})}
                    className="mt-2"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 