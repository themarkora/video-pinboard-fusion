import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Board } from "@/store/useVideos";

interface BoardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateBoard: () => void;
  onSelectBoard: (boardId: string) => void;
  newBoardName: string;
  onNewBoardNameChange: (value: string) => void;
  boards: Board[];
}

export const BoardDialog = ({
  isOpen,
  onOpenChange,
  onCreateBoard,
  onSelectBoard,
  newBoardName,
  onNewBoardNameChange,
  boards
}: BoardDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2A2F3C] text-white border-none max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add to Board</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {boards.length > 0 && (
            <Select onValueChange={onSelectBoard}>
              <SelectTrigger className="w-full bg-[#1A1F2E] border-none text-gray-200 h-12 rounded-xl">
                <SelectValue placeholder="Select a board" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1F2E] border-none text-gray-200">
                {boards.map((board) => (
                  <SelectItem 
                    key={board.id} 
                    value={board.id}
                    className="hover:bg-purple-600/20 focus:bg-purple-600/20 cursor-pointer"
                  >
                    {board.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Create new board..."
              className="flex-1 bg-[#1A1F2E] border-none text-gray-200 h-12 rounded-xl placeholder:text-gray-400"
              value={newBoardName}
              onChange={(e) => onNewBoardNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onCreateBoard();
                }
              }}
            />
            <Button
              variant="secondary"
              className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-6 rounded-xl"
              onClick={onCreateBoard}
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};