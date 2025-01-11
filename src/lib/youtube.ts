export const extractVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const fetchVideoInfo = async (videoId: string) => {
  const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
  const data = await response.json();
  
  return {
    title: data.title || 'Untitled Video',
    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
};