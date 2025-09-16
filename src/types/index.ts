export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  avatar?: string;
  joinedAt: Date;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  upvotes: number;
  isUpvoted?: boolean;
}

export interface CommunityReport extends Report {
  author: {
    name: string;
    avatar?: string;
  };
  commentsCount: number;
}