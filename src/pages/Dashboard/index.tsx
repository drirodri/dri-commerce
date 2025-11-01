import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Users } from "lucide-react";
import { EditUserDialog } from "@/components/EditUserDialog";
import { AdminUser, AdminUpdateUserData } from "@/services/admin-dashboard";
import "./dashboard.css";
import { useAdminUsers } from "@/hooks/useAdminUsers";

const roleMapper: Record<string, string> = {
  ADMIN: "Administrador",
  CUSTOMER: "Cliente",
  SELLER: "Vendedor",
};

const getRoleLabel = (role: string): string => {
  return roleMapper[role] || role;
};

const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    users,
    total,
    isLoading,
    isError,
    error,
    deactivateUser,
    activateUser,
    adminUpdateUser,
    deactivateStatus,
    activateStatus,
    adminUpdateStatus,
  } = useAdminUsers(currentPage, pageSize);

  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleSaveUser = (data: AdminUpdateUserData) => {
    if (editingUser) {
      adminUpdateUser(
        { id: editingUser.id, data },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingUser(null);
          },
        }
      );
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="dashboard-container min-h-screen">
      {/* Summary Card */}
      <Card className="summary-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Usuários
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <div className="text-2xl font-bold text-primary">{total}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Usuários cadastrados no sistema
          </p>
        </CardContent>
      </Card>

      {/* Users Table */}
      <div className="table-container space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            {isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error?.message || "Erro ao carregar usuários"}
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <ScrollArea className="w-full">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[20%]">Nome</TableHead>
                        <TableHead className="w-[30%]">Email</TableHead>
                        <TableHead className="w-[15%]">Papel</TableHead>
                        <TableHead className="w-[10%]">Status</TableHead>
                        <TableHead className="w-[25%] text-right">
                          Ações
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-16" />
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end gap-2">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-8 w-20" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : users.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-muted-foreground"
                          >
                            Nenhum usuário encontrado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium w-[20%]">
                              {user.name}
                            </TableCell>
                            <TableCell className="w-[30%]">
                              {user.email}
                            </TableCell>
                            <TableCell className="w-[15%]">
                              <Badge
                                variant={
                                  user.role === "ADMIN"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {getRoleLabel(user.role)}
                              </Badge>
                            </TableCell>
                            <TableCell className="w-[10%]">
                              <Badge
                                variant={user.active ? "default" : "outline"}
                                className={
                                  user.active
                                    ? "bg-green-500 hover:bg-green-600"
                                    : ""
                                }
                              >
                                {user.active ? "Ativo" : "Inativo"}
                              </Badge>
                            </TableCell>
                            <TableCell className="w-[25%]">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={adminUpdateStatus === "pending"}
                                  onClick={() => handleEditUser(user)}
                                >
                                  Editar
                                </Button>
                                {user.active ? (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={deactivateStatus === "pending"}
                                    onClick={() => deactivateUser(user.id)}
                                  >
                                    Desativar
                                  </Button>
                                ) : (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    disabled={activateStatus === "pending"}
                                    onClick={() => activateUser(user.id)}
                                  >
                                    Ativar
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>

                {/* Pagination */}
                {totalPages > 1 && !isLoading && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {renderPaginationItems()}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit User Dialog */}
      <EditUserDialog
        user={editingUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveUser}
        isLoading={adminUpdateStatus === "pending"}
      />
    </div>
  );
};

export default Dashboard;
