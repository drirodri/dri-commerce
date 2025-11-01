import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminUser } from "@/services/admin-dashboard";

interface EditUserDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    name?: string;
    email?: string;
    role?: "ADMIN" | "CUSTOMER" | "SELLER";
    active?: boolean;
  }) => void;
  isLoading?: boolean;
}

const roleMapper: Record<string, string> = {
  ADMIN: "Administrador",
  CUSTOMER: "Cliente",
  SELLER: "Vendedor",
};

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  user,
  open,
  onOpenChange,
  onSave,
  isLoading = false,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "CUSTOMER" | "SELLER">("CUSTOMER");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setActive(user.active);
    }
  }, [user]);

  const handleSave = () => {
    const data: {
      name?: string;
      email?: string;
      role?: "ADMIN" | "CUSTOMER" | "SELLER";
      active?: boolean;
    } = {};

    if (user) {
      if (name !== user.name) data.name = name;
      if (email !== user.email) data.email = email;
      if (role !== user.role) data.role = role;
      if (active !== user.active) data.active = active;
    }

    onSave(data);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Faça alterações nos dados do usuário. Clique em salvar quando
            terminar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do usuário"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Papel</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as typeof role)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione o papel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CUSTOMER">{roleMapper.CUSTOMER}</SelectItem>
                <SelectItem value="SELLER">{roleMapper.SELLER}</SelectItem>
                <SelectItem value="ADMIN">{roleMapper.ADMIN}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={active ? "active" : "inactive"}
              onValueChange={(value) => setActive(value === "active")}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
