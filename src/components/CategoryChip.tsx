import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryChipProps {
  categoryName: string;
  imageUrl?: string; // Optional image for the category
  isSelected?: boolean;
  onClick: (categoryName: string) => void;
  className?: string;
}

const CategoryChip: React.FC<CategoryChipProps> = ({
  categoryName,
  imageUrl,
  isSelected = false,
  onClick,
  className,
}) => {
  console.log("Rendering CategoryChip:", categoryName, "Selected:", isSelected);
  return (
    <Button
      variant={isSelected ? 'default' : 'outline'}
      size="sm"
      className={cn(
        "flex flex-col items-center justify-center h-auto p-2 rounded-lg shadow-sm min-w-[80px] space-y-1",
        isSelected ? "border-primary ring-2 ring-primary" : "hover:bg-accent",
        className
      )}
      onClick={() => onClick(categoryName)}
    >
      {imageUrl && (
        <img src={imageUrl} alt={categoryName} className="w-8 h-8 object-contain mb-1" />
      )}
      <span className="text-xs font-medium text-center truncate w-full">{categoryName}</span>
    </Button>
  );
};
export default CategoryChip;