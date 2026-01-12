"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Plus } from "lucide-react";
import { CodeItemEntity } from "@/services/entities/code-item.entity";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { CustomProductForm } from "./custom-product-form";

export function AddCustomProduct() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-secondary text-foreground py-3 rounded-lg hover:opacity-80 transition font-medium flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Custom Product
      </button>
    );
  }

  return (
    <AddCustomProductModal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    />
  );
  /* 
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-foreground">
          Add Custom Product
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-secondary rounded transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="product-name"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Product Name *
          </label>
          <Input
            id="product-name"
            placeholder="e.g., Custom Pendant, Bracelet, etc."
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="w-full">
          <label
            htmlFor="variant"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Variant (Color, Size, Material, etc.) *
          </label>
          <SelectOrEnterInput
            placeholder="e.g., Rose Gold, Size 7, 18K Gold, etc."
            options={variantTypeOptions}
            initialValue={"1"}
            onChange={(e) => setVariant(e)}
          />
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Quantity
          </label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))
            }
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
          >
            Add to Cart
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
  */
}

export const AddCustomProductModal = ({
  isOpen,
  onClose,
  editProductId,
}: {
  isOpen: boolean;
  editProductId?: string;
  onClose: () => void;
}) => {
  const { addToCart, items } = useCart();
  const isEdit = editProductId?.length ? true : false;
  const productTypeOptions: CodeItemEntity[] = [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Custom Product" : "Add Custom Product"}
          </DialogTitle>
        </DialogHeader>
        {isOpen && (
          <CustomProductForm
            productTypeOptions={productTypeOptions}
            onConfirm={(lineItem) => {
              addToCart(lineItem);
              onClose();
            }}
            cartItem={items?.find((item) => item.product.id === editProductId)}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
