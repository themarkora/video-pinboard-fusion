import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-top to-background-bottom text-white">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background-top/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">VidPin</span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="#features" className="text-sm text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link to="#faq" className="text-sm text-gray-300 hover:text-white transition-colors">
                FAQ
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/app">
                <Button variant="ghost" className="text-sm">
                  Login
                </Button>
              </Link>
              <Link to="/app">
                <Button size="sm" className="text-sm">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-32">
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
      <div id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">Transform how you organize your research videos</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-card p-6 rounded-lg">
            <div className="mb-4">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                alt="Personal Collections" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            </div>
            <h3 className="text-xl font-semibold mb-4">Personal Collections</h3>
            <p className="text-gray-300">Create focused boards for different research topics and projects</p>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <div className="mb-4">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                alt="Smart Organization" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            </div>
            <h3 className="text-xl font-semibold mb-4">Smart Organization</h3>
            <p className="text-gray-300">Tag and annotate videos to build your knowledge base</p>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <div className="mb-4">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                alt="Quick Access" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            </div>
            <h3 className="text-xl font-semibold mb-4">Quick Access</h3>
            <p className="text-gray-300">Find the exact video you need when inspiration strikes</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">What is VidPin?</h3>
            <p className="text-gray-300">VidPin is your personal YouTube video organizer designed specifically for research and inspiration. Save, organize, and annotate videos that matter to your work or studies.</p>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">How do I get started?</h3>
            <p className="text-gray-300">Simply sign up for a free account, and you can immediately start saving YouTube videos to your personal boards and organizing them with tags.</p>
          </div>
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Is this a social platform?</h3>
            <p className="text-gray-300">No, VidPin is designed as a personal tool. Your collections and notes are private and for your use only.</p>
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