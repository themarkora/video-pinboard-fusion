import { Button } from "@/components/ui/button";
import { Pin, Video, ListChecks, Share2, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-top to-background-bottom text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Your YouTube videos,{" "}
                <span className="text-primary">organized</span> and{" "}
                <span className="text-primary">shareable</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Save, organize, and share your favorite YouTube videos. Create curated lists for research, learning, or entertainment.
              </p>
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate("/signup")}
              >
                Get Started Free
              </Button>
            </div>
            <div className="flex-1">
              <img 
                src="/lovable-uploads/48211fb6-d34c-4eef-8591-52aa48514ef7.png" 
                alt="VidPin Interface Preview" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything you need to manage your video collection
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Pin className="w-8 h-8 text-primary" />}
              title="Pin Important Videos"
              description="Keep your most important videos easily accessible by pinning them to the top."
            />
            <FeatureCard
              icon={<ListChecks className="w-8 h-8 text-primary" />}
              title="Organize with Boards"
              description="Create themed boards to group related videos and keep everything organized."
            />
            <FeatureCard
              icon={<Share2 className="w-8 h-8 text-primary" />}
              title="Share Collections"
              description="Share your curated video collections with friends, colleagues, or the world."
            />
            <FeatureCard
              icon={<Video className="w-8 h-8 text-primary" />}
              title="Watch Inline"
              description="Watch videos directly within VidPin without leaving your collection."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-primary" />}
              title="Track Progress"
              description="Keep track of watched videos and maintain your learning progress."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-primary" />}
              title="Collaborate"
              description="Work together with others on shared video collections."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How VidPin Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              number="1"
              title="Add Videos"
              description="Simply paste YouTube URLs to add videos to your collection."
            />
            <StepCard
              number="2"
              title="Organize"
              description="Create boards, add tags, and pin important videos for easy access."
            />
            <StepCard
              number="3"
              title="Share & Collaborate"
              description="Share your collections or collaborate with others on shared boards."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to organize your video collection?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who use VidPin to manage their YouTube videos.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => navigate("/signup")}
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-6 rounded-xl bg-secondary/30 backdrop-blur-sm">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <div className="text-center">
    <div className="w-12 h-12 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export default Landing;
