import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { VideoCard } from "@/components/VideoCard";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const Index = () => {
  const videos = [
    {
      title: "How to Create Affiliate Marketing Videos on YouTube and Make 10K per Month",
      channel: "Digital Sculler",
      thumbnail: "/lovable-uploads/258455c0-6299-49d5-9459-b4b0f149abe8.png",
      publishDate: "11/30/2024",
    },
    {
      title: "My 12 Sources of Income! ($296,000/Month)",
      channel: "Charlie Chang",
      thumbnail: "/lovable-uploads/a1a0c76c-7c54-4d0b-b305-79991a2182bb.png",
      publishDate: "11/29/2024",
    },
    {
      title: "Earn $1,250+ Per WEEK With Pinterest Affiliate Marketing (FULL TUTORIAL)",
      channel: "Wisdom Speaks",
      thumbnail: "/lovable-uploads/6a0fad2e-4c68-4446-9de5-0cef7b9b4bb8.png",
      publishDate: "11/29/2024",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-white">
      <AnimatedBackground />
      <Header />
      <main className="max-w-7xl mx-auto px-6">
        <Navigation />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {videos.map((video, index) => (
            <VideoCard key={index} {...video} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;