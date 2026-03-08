export interface Movie {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  video_url: string;
  category: string;
  interpreter: string;
  origin: string;
  duration: string;
  year: number;
  rating: number;
  views: number;
  type: 'movie' | 'short';
  created_at: string;
}
