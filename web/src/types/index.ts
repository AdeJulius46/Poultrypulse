// Core types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface Content {
  id: string;
  title: string;
  type: "post" | "image" | "article";
  status: "draft" | "scheduled" | "published";
  content: string;
  metadata: ContentMetadata;
  authorId: string;
  createdAt: string;
  scheduledFor?: string;
  publishedAt?: string;
}

export interface ContentMetadata {
  tags?: string[];
  platforms?: SocialPlatform[];
  imageUrl?: string;
}

export type SocialPlatform = "twitter" | "facebook" | "instagram" | "linkedin";
