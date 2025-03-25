import { Button } from "@/components/ui/button";

type SidebarButtonProps = {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
};

export const SidebarButton = ({ icon, label, isActive = false, onClick }: SidebarButtonProps) => {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      className="flex flex-col items-center justify-center gap-1 h-auto p-3 w-full transition-all duration-300"
      onClick={onClick}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
}; 