import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { ProductResponse } from "@/services/product";
import { useCategories } from "@/hooks/useCategories";

interface ProductFormData {
  title: string;
  price: number;
  thumbnail: string;
  availableQuantity: number;
  condition: "NEW" | "USED";
  categoryId: number | null;
}

interface ProductDialogProps {
  product: ProductResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ProductFormData) => void;
  isLoading: boolean;
}

export const ProductDialog: React.FC<ProductDialogProps> = ({
  product,
  open,
  onOpenChange,
  onSave,
  isLoading,
}) => {
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      title: "",
      price: 0,
      thumbnail: "",
      availableQuantity: 0,
      condition: "NEW",
      categoryId: null,
    },
  });

  const condition = watch("condition");
  const categoryId = watch("categoryId");

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        availableQuantity: product.availableQuantity,
        condition: product.condition,
        categoryId: product.categoryId,
      });
    } else {
      reset({
        title: "",
        price: 0,
        thumbnail: "",
        availableQuantity: 0,
        condition: "NEW",
        categoryId: null,
      });
    }
  }, [product, reset]);

  const onSubmit = (data: ProductFormData) => {
    onSave(data);
  };

  const handleCategoryChange = (value: string) => {
    if (value === "none") {
      setValue("categoryId", null);
    } else {
      setValue("categoryId", parseInt(value, 10));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Atualize as informações do produto abaixo."
              : "Preencha os dados para criar um novo produto."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                {...register("title", {
                  required: "Título é obrigatório",
                  minLength: {
                    value: 3,
                    message: "Título deve ter no mínimo 3 caracteres",
                  },
                })}
                placeholder="Ex: iPhone 13 Pro Max 256GB"
              />
              {errors.title && (
                <span className="text-sm text-destructive">
                  {errors.title.message}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="grid gap-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Preço é obrigatório",
                  min: { value: 0.01, message: "Preço deve ser maior que 0" },
                  valueAsNumber: true,
                })}
                placeholder="0.00"
              />
              {errors.price && (
                <span className="text-sm text-destructive">
                  {errors.price.message}
                </span>
              )}
            </div>

            {/* Thumbnail */}
            <div className="grid gap-2">
              <Label htmlFor="thumbnail">URL da Imagem *</Label>
              <Input
                id="thumbnail"
                {...register("thumbnail", {
                  required: "URL da imagem é obrigatória",
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: "URL inválida",
                  },
                })}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              {errors.thumbnail && (
                <span className="text-sm text-destructive">
                  {errors.thumbnail.message}
                </span>
              )}
            </div>

            {/* Available Quantity */}
            <div className="grid gap-2">
              <Label htmlFor="availableQuantity">Quantidade Disponível *</Label>
              <Input
                id="availableQuantity"
                type="number"
                {...register("availableQuantity", {
                  required: "Quantidade é obrigatória",
                  min: {
                    value: 0,
                    message: "Quantidade não pode ser negativa",
                  },
                  valueAsNumber: true,
                })}
                placeholder="0"
              />
              {errors.availableQuantity && (
                <span className="text-sm text-destructive">
                  {errors.availableQuantity.message}
                </span>
              )}
            </div>

            {/* Condition */}
            <div className="grid gap-2">
              <Label htmlFor="condition">Condição *</Label>
              <Select
                value={condition}
                onValueChange={(value) =>
                  setValue("condition", value as "NEW" | "USED")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a condição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">Novo</SelectItem>
                  <SelectItem value="USED">Usado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="categoryId">Categoria</Label>
              <Select
                value={categoryId !== null ? String(categoryId) : "none"}
                onValueChange={handleCategoryChange}
                disabled={isCategoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isCategoriesLoading ? "Carregando..." : "Selecione uma categoria"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem categoria</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categories.length === 0 && !isCategoriesLoading && (
                <span className="text-sm text-muted-foreground">
                  Nenhuma categoria cadastrada
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
