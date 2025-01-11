import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ImageModal } from "@/components/ImageModal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Landing = () => {
  const [featureImages] = useState({
    collections: "/lovable-uploads/96c76c4a-e904-40b4-ab02-190d39d9308f.png",
    organization: "/lovable-uploads/dabb0de4-c792-4770-b87e-eea045cac979.png",
    quickAccess: "/lovable-uploads/36aab957-2e92-4ad3-b420-6b89383194ce.png"
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
        <div className="grid md:grid-cols-3 gap-12 mb-20">
          <div className="relative group">
            <div className="mb-6 transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
              <div className="bg-card rounded-xl p-4 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden cursor-pointer"
                   onClick={() => setSelectedImage(featureImages.collections)}>
                <div className="overflow-hidden rounded-lg">
                  <img 
                    src={featureImages.collections}
                    alt="Personal Collections" 
                    className="w-full h-auto rounded-lg object-contain animate-fade-in transform transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">Personal Collections</h3>
            <p className="text-gray-300">Create focused boards for different research topics and projects</p>
          </div>

          <div className="relative group">
            <div className="mb-6 transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
              <div className="bg-card rounded-xl p-4 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden cursor-pointer"
                   onClick={() => setSelectedImage(featureImages.organization)}>
                <div className="overflow-hidden rounded-lg">
                  <img 
                    src={featureImages.organization}
                    alt="Smart Organization" 
                    className="w-full h-auto rounded-lg object-contain animate-fade-in transform transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">Smart Organization</h3>
            <p className="text-gray-300">Tag and annotate videos to build your knowledge base</p>
          </div>

          <div className="relative group">
            <div className="mb-6 transform transition-all duration-300 hover:scale-105 hover:-translate-y-2">
              <div className="bg-card rounded-xl p-4 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden cursor-pointer"
                   onClick={() => setSelectedImage(featureImages.quickAccess)}>
                <div className="overflow-hidden rounded-lg">
                  <img 
                    src={featureImages.quickAccess}
                    alt="Quick Access" 
                    className="w-full h-auto rounded-lg object-contain animate-fade-in transform transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">Quick Access</h3>
            <p className="text-gray-300">Find the exact video you need when inspiration strikes</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="what-is-vidpin" className="bg-secondary/40 backdrop-blur-sm p-6 rounded-2xl border-none shadow-lg transition-all duration-300 hover:bg-secondary/50">
              <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                What is VidPin?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4">
                VidPin is your personal YouTube video organizer designed specifically for research and inspiration. 
                Save, organize, and annotate videos that matter to your work or studies.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-different" className="bg-secondary/40 backdrop-blur-sm p-6 rounded-2xl border-none shadow-lg transition-all duration-300 hover:bg-secondary/50">
              <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                How is VidPin different from YouTube playlists?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4">
                VidPin offers a more streamlined and powerful research experience compared to YouTube playlists. 
                It's visually more appealing, faster to organize content to your preferences, and enables quick 
                video discovery through tags, notes, and titles. With features like custom collections, tagging, 
                and note-taking, VidPin makes your research easier and more efficient in every way possible.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="getting-started" className="bg-secondary/40 backdrop-blur-sm p-6 rounded-2xl border-none shadow-lg transition-all duration-300 hover:bg-secondary/50">
              <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                How do I get started?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4">
                Simply sign up for a free account, and you can immediately start saving YouTube videos to your 
                personal boards and organizing them with tags.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="is-social" className="bg-secondary/40 backdrop-blur-sm p-6 rounded-2xl border-none shadow-lg transition-all duration-300 hover:bg-secondary/50">
              <AccordionTrigger className="text-xl font-semibold hover:no-underline">
                Is this a social platform?
              </AccordionTrigger>
              <AccordionContent className="text-gray-300 pt-4">
                No, VidPin is designed as a personal tool. Your collections and notes are private and for your 
                use only.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-secondary/40 backdrop-blur-sm rounded-3xl p-16 text-center max-w-3xl mx-auto shadow-2xl border border-white/10 transform transition-all duration-300 hover:scale-[1.02]">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ready to streamline your research?
          </h2>
          <p className="text-gray-300 mb-10 text-lg">
            Start organizing your YouTube research videos with VidPin
          </p>
          <Link to="/app">
            <Button 
              size="lg" 
              className="text-lg px-10 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform transition-all duration-300 hover:scale-105 rounded-xl shadow-lg"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ''}
        altText="Feature Preview"
      />
    </div>
  );
};

export default Landing;