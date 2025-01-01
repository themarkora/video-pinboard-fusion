import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface VideoInfoProps {
  title: string;
  channel: string;
  publishedAt: string;
}

export const VideoInfo: React.FC<VideoInfoProps> = ({ title, channel, publishedAt }) => {
  return (
    <div className="p-4">
      <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2">
        {title}
      </h3>
      <div className="text-sm text-gray-400">
        <p className="mb-1">{channel}</p>
        <p>Published: {formatDistanceToNow(new Date(publishedAt))} ago</p>
      </div>
    </div>
  );
};