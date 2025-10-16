import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import "./sidebar.css";

type SidebarProps = {
  title: string;
  subtitle?: string;
  isCollapsible?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Sidebar({
  title,
  subtitle,
  isCollapsible = false,
  isOpen = true,
  onToggle,
  footer,
  children,
  className,
}: SidebarProps) {
  const content = (
    <ScrollArea className="sidebar-scroll-area">
      <div className="sidebar-scroll-inner">{children}</div>
    </ScrollArea>
  );

  const collapsibleContent = isCollapsible ? (
    <div
      className={cn("sidebar-content", !isOpen && "sidebar-content-collapsed")}
    >
      {content}
    </div>
  ) : (
    <div className="sidebar-content">{content}</div>
  );

  return (
    <Card className={cn("sidebar-container", className)}>
      <CardHeader className="sidebar-header">
        <div className="sidebar-header-text">
          <CardTitle className="sidebar-title">{title}</CardTitle>
          {subtitle && (
            <CardDescription className="sidebar-subtitle">
              {subtitle}
            </CardDescription>
          )}
        </div>
        {isCollapsible && onToggle && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Recolher seção" : "Expandir seção"}
            className="sidebar-toggle"
          >
            <ChevronDown
              aria-hidden
              className={cn("sidebar-toggle-icon", isOpen && "open")}
            />
          </Button>
        )}
      </CardHeader>

      <CardContent className="sidebar-card-content">
        {collapsibleContent}
      </CardContent>

      {footer && <CardFooter className="sidebar-footer">{footer}</CardFooter>}
    </Card>
  );
}

export default Sidebar;
