import User from "./User";

export interface ItemLocation {
  latitude: number;
  longitude: number;
  streetAddress: string;
  city: string;
  country: string;
}

export default interface FeedItem {
  creationDate: number;
  title: string;
  description: string;
  authorId: string;
  author: User;
  imageUrl?: string;
  address?: ItemLocation;
  eventTime?: number;
  eventType: string;
}

export interface ReplyItem {
  mid?: string;
  authorId?: string;
  authorName?: string;
  title?: string;
  text?: string;
  eventTime?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface ThreadItem {
  // thread
  id: string;
  topic: string;
  subject: string;
  visibility: string;
  // first message
  mid?: string;
  title?: string;
  text?: string;
  authorId?: string;
  authorName: string;
  eventTime?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  replyMessages?: ReplyItem[];
}
