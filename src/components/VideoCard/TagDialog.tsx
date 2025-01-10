import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TagDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTag: (tag: string) => void;
  onSelectTag: (tag: string) => void;
  newTag: string;
  onNewTagChange: (value: string) => void;
  existingTags: string[];
}

export const TagDialog = ({
  isOpen,
  onOpenChange,
  onAddTag,
  onSelectTag,
  newTag,
  onNewTagChange,
  existingTags
}: TagDialogProps) => {
  const handleTagSubmit = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2A2F3C] text-white border-none max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Tag</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {existingTags.length > 0 && (
            <Select onValueChange={onSelectTag}>
              <SelectTrigger className="w-full bg-[#1A1F2E] border-none text-gray-200 h-12 rounded-xl">
                <SelectValue placeholder="Select existing tag" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1F2E] border-none text-gray-200">
                {existingTags.map((tag) => (
                  <SelectItem 
                    key={tag} 
                    value={tag}
                    className="hover:bg-purple-600/20 focus:bg-purple-600/20 cursor-pointer"
                  >
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Create new tag..."
              className="flex-1 bg-[#1A1F2E] border-none text-gray-200 h-12 rounded-xl placeholder:text-gray-400"
              value={newTag}
              onChange={(e) => onNewTagChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTagSubmit();
                }
              }}
            />
            <Button
              variant="secondary"
              className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-6 rounded-xl"
              onClick={handleTagSubmit}
            >
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};