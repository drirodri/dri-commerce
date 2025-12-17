import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  AlertCircle,
  Package,
  Plus,
  Edit,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";
import { ProductDialog } from "@/components/ProductDialog";
import { ProductResponse } from "@/services/product";
import { useProducts } from "@/hooks/useProducts";
import "./product-dashboard.css";

const conditionMapper: Record<string, string> = {
  NEW: "Novo",
  USED: "Usado",
};

const getConditionLabel = (condition: string): string => {
  return conditionMapper[condition] || condition;
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

const ProductDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => void;
    variant?: "default" | "destructive";
  }>({
    open: false,
    title: "",
    description: "",
    action: () => {},
    variant: "default",
  });

  const {
    products,
    paging,
    isLoading,
    isError,
    error,
    createProduct,
    updateProduct,
    activateProduct,
    deactivateProduct,
    deleteProduct,
    createStatus,
    updateStatus,
    activateStatus,
    deactivateStatus,
    deleteStatus,
  } = useProducts(currentPage - 1, pageSize);

  const totalPages = paging.totalPages;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCreateProduct = () => {
    setIsCreating(true);
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: ProductResponse) => {
    setIsCreating(false);
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleSaveProduct = (data: {
    title: string;
    price: number;
    thumbnail: string;
    availableQuantity: number;
    condition: "NEW" | "USED";
    categoryId: string;
  }) => {
    if (isCreating) {
      createProduct(data, {
        onSuccess: () => {
          setDialogOpen(false);
          setEditingProduct(null);
        },
      });
    } else if (editingProduct) {
      updateProduct(
        { id: editingProduct.id, data },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditingProduct(null);
          },
        }
      );
    }
  };

  const handleActivate = (id: string) => {
    setConfirmDialog({
      open: true,
      title: "Ativar produto",
      description: "Deseja realmente ativar este produto?",
      variant: "default",
      action: () => {
        activateProduct(id);
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handleDeactivate = (id: string) => {
    setConfirmDialog({
      open: true,
      title: "Desativar produto",
      description: "Deseja realmente desativar este produto?",
      variant: "default",
      action: () => {
        deactivateProduct(id);
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handleDelete = (id: string) => {
    setConfirmDialog({
      open: true,
      title: "Deletar produto",
      description:
        "Deseja realmente deletar este produto? Esta ação não pode ser desfeita.",
      variant: "destructive",
      action: () => {
        deleteProduct(id);
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      },
    });
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
    <div className="product-dashboard-container min-h-screen">
      {/* Summary Card */}
      <Card className="summary-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Produtos
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-20" />
          ) : (
            <div className="text-2xl font-bold text-primary">
              {paging.total}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Produtos cadastrados no sistema
          </p>
          <Button
            className="w-full mt-4"
            onClick={handleCreateProduct}
            disabled={createStatus === "pending"}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </CardContent>
      </Card>

      {/* Products Table */}
      <div className="table-container space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            {isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error?.message || "Erro ao carregar produtos"}
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <ScrollArea className="w-full">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[5%]">Imagem</TableHead>
                        <TableHead className="w-[25%]">Título</TableHead>
                        <TableHead className="w-[10%]">Preço</TableHead>
                        <TableHead className="w-[8%]">Estoque</TableHead>
                        <TableHead className="w-[8%]">Condição</TableHead>
                        <TableHead className="w-[8%]">Status</TableHead>
                        <TableHead className="w-[36%] text-right">
                          Ações
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Skeleton className="h-12 w-12 rounded" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-12" />
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
                                <Skeleton className="h-8 w-20" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : products.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-8 text-muted-foreground"
                          >
                            Nenhum produto encontrado. Clique em "Novo Produto"
                            para adicionar.
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="w-[5%]">
                              <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="h-12 w-12 object-cover rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://via.placeholder.com/48?text=Img";
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-medium w-[25%]">
                              <div
                                className="max-w-xs truncate"
                                title={product.title}
                              >
                                {product.title}
                              </div>
                            </TableCell>
                            <TableCell className="w-[10%]">
                              {formatPrice(product.price)}
                            </TableCell>
                            <TableCell className="w-[8%]">
                              <Badge
                                variant={
                                  product.availableQuantity > 0
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {product.availableQuantity}
                              </Badge>
                            </TableCell>
                            <TableCell className="w-[8%]">
                              <Badge variant="secondary">
                                {getConditionLabel(product.condition)}
                              </Badge>
                            </TableCell>
                            <TableCell className="w-[8%]">
                              <Badge
                                variant={product.active ? "default" : "outline"}
                                className={
                                  product.active
                                    ? "bg-green-500 hover:bg-green-600"
                                    : ""
                                }
                              >
                                {product.active ? "Ativo" : "Inativo"}
                              </Badge>
                            </TableCell>
                            <TableCell className="w-[36%]">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={updateStatus === "pending"}
                                  onClick={() => handleEditProduct(product)}
                                  title="Editar produto"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {product.active ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={deactivateStatus === "pending"}
                                    onClick={() => handleDeactivate(product.id)}
                                    title="Desativar produto"
                                  >
                                    <PowerOff className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={activateStatus === "pending"}
                                    onClick={() => handleActivate(product.id)}
                                    title="Ativar produto"
                                  >
                                    <Power className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={deleteStatus === "pending"}
                                  onClick={() => handleDelete(product.id)}
                                  title="Deletar produto"
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

      {/* Product Dialog */}
      <ProductDialog
        product={editingProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveProduct}
        isLoading={createStatus === "pending" || updateStatus === "pending"}
      />

      {/* Confirmation Alert Dialog */}
      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDialog.action}
              className={
                confirmDialog.variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductDashboard;
