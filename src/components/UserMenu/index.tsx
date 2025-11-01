import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, ShoppingCart, Package, LogOut, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserMenuProps {
  userName: string;
  userEmail: string;
  userRole?: "ADMIN" | "SELLER" | "CUSTOMER";
  onLogout: () => void;
}

export function UserMenu({
  userName,
  userEmail,
  userRole,
  onLogout,
}: UserMenuProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isSeller = userRole === "SELLER" || userRole === "ADMIN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all">
            <AvatarImage src="" alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => navigate("/minha-conta")}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Minha conta</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/cartcheckout")}
          className="cursor-pointer"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          <span>Meu carrinho</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/meus-pedidos")}
          className="cursor-pointer"
        >
          <Package className="mr-2 h-4 w-4" />
          <span>Meus pedidos</span>
        </DropdownMenuItem>

        {isSeller && (
          <DropdownMenuItem
            onClick={() => navigate("/meus-produtos")}
            className="cursor-pointer"
          >
            <Store className="mr-2 h-4 w-4" />
            <span>Meus produtos</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
