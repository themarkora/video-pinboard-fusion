import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-top to-background-bottom text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Your Personal YouTube
            <br />
            <span className="text-primary">Research Assistant</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Organize, tag, and curate your YouTube videos for research and inspiration in one place
          </p>
          <Link to="/app">
            <Button size="lg" className="text-lg px-8">Start Organizing</Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">Transform how you organize your research videos</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Personal Collections</h3>
            <p className="text-gray-300">Create focused boards for different research topics and projects</p>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Smart Organization</h3>
            <p className="text-gray-300">Tag and annotate videos to build your knowledge base</p>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Quick Access</h3>
            <p className="text-gray-300">Find the exact video you need when inspiration strikes</p>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">Simple and Focused</h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-card p-4 rounded-lg mb-4 aspect-square flex items-center justify-center">
              <span className="text-4xl">1</span>
            </div>
            <h3 className="font-semibold mb-2">Save Videos</h3>
            <p className="text-gray-300">Pin interesting YouTube videos as you research</p>
          </div>
          <div className="text-center">
            <div className="bg-card p-4 rounded-lg mb-4 aspect-square flex items-center justify-center">
              <span className="text-4xl">2</span>
            </div>
            <h3 className="font-semibold mb-2">Add Notes</h3>
            <p className="text-gray-300">Capture key insights and timestamps</p>
          </div>
          <div className="text-center">
            <div className="bg-card p-4 rounded-lg mb-4 aspect-square flex items-center justify-center">
              <span className="text-4xl">3</span>
            </div>
            <h3 className="font-semibold mb-2">Organize</h3>
            <p className="text-gray-300">Create boards for different research topics</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-card rounded-lg p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to streamline your research?</h2>
          <p className="text-gray-300 mb-8">Start organizing your YouTube research videos with VidPin</p>
          <Link to="/app">
            <Button size="lg" className="text-lg px-8">Get Started Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;