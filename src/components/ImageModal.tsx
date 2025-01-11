import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
}

export const ImageModal = ({ isOpen, onClose, imageUrl, altText }: ImageModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] p-0 bg-transparent border-none">
        <div className="relative w-full overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={altText}
            className="w-full h-auto object-contain max-h-[90vh]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};