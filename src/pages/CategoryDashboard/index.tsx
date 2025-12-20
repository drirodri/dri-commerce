import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, FolderTree, Plus, Edit, Trash2 } from "lucide-react";
import { CategoryDialog } from "@/components/CategoryDialog";
import { CategoryResponse } from "@/services/category";
import { useCategoriesAdmin } from "@/hooks/useCategoriesAdmin";
import "./category-dashboard.css";

const CategoryDashboard: React.FC = () => {
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    category: CategoryResponse | null;
  }>({
    open: false,
    category: null,
  });

  const {
    categories,
    total,
    isLoading,
    isError,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    createStatus,
    updateStatus,
    deleteStatus,
  } = useCategoriesAdmin();

  const handleCreateCategory = () => {
    setIsCreating(true);
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const handleEditCategory = (category: CategoryResponse) => {
    setIsCreating(false);
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleSaveCategory = (data: { name: string; description: string }) => {
    if (isCreating) {
      createCategory(data, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingCategory(null);
        },
      });
    } else if (editingCategory) {
      updateCategory(
        { id: editingCategory.id, data },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingCategory(null);
          },
        }
      );
    }
  };

  const handleDelete = (category: CategoryResponse) => {
    setDeleteDialog({
      open: true,
      category,
    });
  };

  const confirmDelete = () => {
    if (deleteDialog.category) {
      deleteCategory(deleteDialog.category.id);
      setDeleteDialog({ open: false, category: null });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="category-dashboard-container min-h-screen">
      {/* Summary Card */}
      <Card className="summary-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Categorias
          </CardTitle>
          <FolderTree className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <div className="text-2xl font-bold text-primary">{total}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Categorias cadastradas no sistema
          </p>
          <Button
            className="w-full mt-4"
            onClick={handleCreateCategory}
            disabled={createStatus === "pending"}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <div className="table-container space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            {isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error?.message || "Erro ao carregar categorias"}
                </AlertDescription>
              </Alert>
            ) : (
              <ScrollArea className="w-full">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[10%]">ID</TableHead>
                      <TableHead className="w-[25%]">Nome</TableHead>
                      <TableHead className="w-[35%]">Descrição</TableHead>
                      <TableHead className="w-[15%]">Criado em</TableHead>
                      <TableHead className="w-[15%] text-right">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Skeleton className="h-4 w-8" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Skeleton className="h-8 w-8" />
                              <Skeleton className="h-8 w-8" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : categories.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Nenhuma categoria encontrada. Clique em "Nova
                          Categoria" para adicionar.
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-mono text-muted-foreground">
                            {category.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {category.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {category.description || "-"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(category.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                disabled={updateStatus === "pending"}
                                onClick={() => handleEditCategory(category)}
                                title="Editar categoria"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                disabled={deleteStatus === "pending"}
                                onClick={() => handleDelete(category)}
                                title="Deletar categoria"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Dialog */}
      <CategoryDialog
        category={editingCategory}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveCategory}
        isLoading={createStatus === "pending" || updateStatus === "pending"}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteDialog({ open: false, category: null });
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a categoria{" "}
              <strong>"{deleteDialog.category?.name}"</strong>?
              <br />
              <br />
              Esta ação não pode ser desfeita. Produtos associados a esta
              categoria ficarão sem categoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryDashboard;
