import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-top to-background-bottom text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Shareable video lists
            <br />
            <span className="text-primary">organized</span> your way
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your personal video curator that helps you organize, tag, and share your favorite videos across platforms
          </p>
          <Link to="/app">
            <Button size="lg" className="text-lg px-8">Get Started</Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">A platform for everyone to organize and share their video collections</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Create Collections</h3>
            <p className="text-gray-300">Organize your videos into custom boards and collections for easy access</p>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Smart Tagging</h3>
            <p className="text-gray-300">Tag and categorize your videos to find them instantly when you need them</p>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Share & Collaborate</h3>
            <p className="text-gray-300">Share your collections with friends or keep them private - you're in control</p>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">How does it work?</h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-card p-4 rounded-lg mb-4 aspect-square flex items-center justify-center">
              <span className="text-4xl">1</span>
            </div>
            <h3 className="font-semibold mb-2">Create a Board</h3>
            <p className="text-gray-300">Start by creating your first video board</p>
          </div>
          <div className="text-center">
            <div className="bg-card p-4 rounded-lg mb-4 aspect-square flex items-center justify-center">
              <span className="text-4xl">2</span>
            </div>
            <h3 className="font-semibold mb-2">Add Videos</h3>
            <p className="text-gray-300">Add your favorite videos from any platform</p>
          </div>
          <div className="text-center">
            <div className="bg-card p-4 rounded-lg mb-4 aspect-square flex items-center justify-center">
              <span className="text-4xl">3</span>
            </div>
            <h3 className="font-semibold mb-2">Organize & Share</h3>
            <p className="text-gray-300">Tag, organize, and share with others</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-card rounded-lg p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to start?</h2>
          <p className="text-gray-300 mb-8">Join VidPin today and start organizing your video collection</p>
          <Link to="/app">
            <Button size="lg" className="text-lg px-8">Get Started Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;