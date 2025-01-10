import { Header } from "@/components/Header";
import { AddVideo } from "@/components/AddVideo";
import { VideoCard } from "@/components/VideoCard";
import { BoardCard } from "@/components/BoardCard";
import { useVideos } from "@/store/useVideos";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState, useMemo } from "react";

const Index = () => {
  const { videos, togglePin, activeTab, setActiveTab, boards, reorderVideos } = useVideos();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = useMemo(() => {
    let filtered = videos;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(video => {
        const titleMatch = video.title.toLowerCase().includes(query);
        const tagsMatch = video.tags?.some(tag => tag.toLowerCase().includes(query)) || false;
        const notesMatch = video.notes?.some(note => note.toLowerCase().includes(query)) || false;
        return titleMatch || tagsMatch || notesMatch;
      });
    }

    return filtered.filter((video) => {
      switch (activeTab) {
        case 'pinned':
          return video.isPinned === true;
        case 'notes':
          return Array.isArray(video.notes) && video.notes.length > 0;
        case 'boards':
          return Array.isArray(video.boardIds) && video.boardIds.length > 0;
        case 'recent':
        default:
          return true;
      }
    }).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [videos, searchQuery, activeTab]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (activeTab === 'boards') return;
    
    reorderVideos(activeTab, sourceIndex, destinationIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-top to-background-bottom text-white relative overflow-hidden">
      <AnimatedBackground />
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-32">
        <div className="text-center pt-12 sm:pt-16 mb-8 sm:mb-12">
          <AddVideo />
          <p className="text-gray-400 mt-4 text-sm">
            Your personal YouTube video organizer for research and inspiration
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-gray-400 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="text-purple-500">📌</span> Pin videos
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-500">📝</span> Add notes
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-500">🎯</span> Organize
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-500">⚡</span> Quick access
            </div>
          </div>
        </div>

        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search videos by title, tags, or notes..." 
            className="w-full bg-[#1A1F2E] border-none pl-10 h-12 text-gray-300 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full flex flex-col items-center">
          <TabsList className="bg-transparent justify-center gap-2 h-auto pb-4 overflow-x-auto">
            <TabsTrigger 
              value="recent"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 rounded-xl whitespace-nowrap"
            >
              Recent Videos
            </TabsTrigger>
            <TabsTrigger 
              value="pinned"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 rounded-xl whitespace-nowrap"
            >
              Pinned Videos
            </TabsTrigger>
            <TabsTrigger 
              value="notes"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 rounded-xl whitespace-nowrap"
            >
              Videos with Notes
            </TabsTrigger>
            <TabsTrigger 
              value="boards"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 rounded-xl whitespace-nowrap"
            >
              Boards ({boards.length})
            </TabsTrigger>
          </TabsList>

          <DragDropContext onDragEnd={handleDragEnd}>
            {activeTab === 'boards' ? (
              <div className="grid gap-6 mt-8">
                {boards.map((board) => (
                  <BoardCard key={board.id} id={board.id} name={board.name} />
                ))}
                {boards.length === 0 && (
                  <p className="text-center text-gray-400 py-8">No boards created yet.</p>
                )}
              </div>
            ) : (
              <Droppable 
                droppableId={activeTab} 
                type="VIDEO"
                direction="horizontal"
              >
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 p-4 rounded-xl transition-colors duration-200 ${
                      snapshot.isDraggingOver ? 'bg-purple-500/10' : ''
                    }`}
                  >
                    {filteredVideos.map((video, index) => (
                      <Draggable 
                        key={video.id} 
                        draggableId={video.id} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              transform: snapshot.isDragging
                                ? provided.draggableProps.style?.transform
                                : 'none',
                              zIndex: snapshot.isDragging ? 999 : 'auto',
                            }}
                            className={`transition-all duration-200 ${
                              snapshot.isDragging 
                                ? 'scale-105 rotate-2 shadow-2xl' 
                                : ''
                            }`}
                          >
                            <VideoCard
                              video={video}
                              onTogglePin={togglePin}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {filteredVideos.length === 0 && (
                      <div className="col-span-full text-center text-gray-400 py-8">
                        No videos found matching your search criteria.
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            )}
          </DragDropContext>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
