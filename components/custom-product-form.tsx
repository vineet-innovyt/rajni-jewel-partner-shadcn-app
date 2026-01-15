import * as Yup from "yup";
import {
  CodeItemEntity,
  OrderLineItemEntity,
  ProductEntity,
} from "@/services/entities";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Label } from "./ui/label";
import { SelectOrEnterInput } from "./ui/SelectOrEnterInput";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { CartItem } from "@/lib/types";

interface ICustomProductFormProps {
  cartItem?: CartItem;
  onConfirm: (orderLineItem: OrderLineItemEntity) => void;
  onClose: () => void;
  productTypeOptions?: CodeItemEntity[];
  unitTypeOptions?: CodeItemEntity[];
}

const validationSchema = Yup.object({
  productName: Yup.string()
    .required("Product name is required")
    .min(1, "Product name must be at least 1 characters")
    .max(250, "Product name must be less than 250 characters"),
  description: Yup.string().max(
    2000,
    "Description must be less than 2000 characters"
  ),
  quantity: Yup.number()
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required")
    .max(10000, "Quantity must be less than 10k"),
  unitType: Yup.string()
    .required("Unit is required")
    .max(250, "Unit must be less than 250 characters"),
  productType: Yup.string()
    .optional()
    .max(250, "Product type must be less than 250 characters"),
});

export const CustomProductForm = ({
  cartItem,
  onClose,
  onConfirm,
  productTypeOptions,
  unitTypeOptions,
}: ICustomProductFormProps) => {
  const product = cartItem?.product;
  const orderLineItem = cartItem;

  const isEdit = product?.id?.length ? true : false;

  const initialValues = {
    productName: product?.name || "",
    description: product?.description || "",
    productType: product?.type?.value || "",
    unitType: orderLineItem?.unitType || "",
    remark: orderLineItem?.remark || "",
    quantity: orderLineItem?.quantity || 0,
  };

  const handleSubmit = (values: typeof initialValues) => {
    const prod: ProductEntity = {
      id: product?.id || `custom-${Date.now()}`,
      name: values.productName,
      description: values.description,
      type: new CodeItemEntity({
        code: values.productType,
        value: values.productType,
      }),
      sku: "",
      tenantCode: "",
      createdOn: new Date(),
    };
    onConfirm({
      product: prod,
      unitType: values.unitType,
      remark: values.remark,
      quantity: values.quantity,
      lineItemId: Date.now().toString(),
      productId: prod.id,
      isCustomProduct: true,
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, errors, touched, isValid }) => (
        <Form className="" noValidate>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name*</Label>
              <Field
                as={Input}
                id="productName"
                name="productName"
                placeholder="Enter product name"
                className={
                  errors.productName && touched.productName
                    ? "border-destructive"
                    : ""
                }
              />
              <ErrorMessage
                name="productName"
                component="p"
                className="text-sm text-destructive "
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-description">
                Product Description (optional)
              </Label>
              <Field
                as={Textarea}
                id="description"
                name="description"
                placeholder="Enter product description"
                rows={3}
                className={
                  "resize-none" +
                  (errors.description && touched.description
                    ? "border-destructive"
                    : "")
                }
              />
              <ErrorMessage
                name="description"
                component="p"
                className="text-sm text-destructive"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type (optional)</Label>
              <SelectOrEnterInput
                options={productTypeOptions}
                initialValue={values.productType}
                onChange={(e) => setFieldValue("productType", e)}
              />
              <ErrorMessage
                name="productType"
                component="p"
                className="text-sm text-destructive"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unitType">Unit*</Label>
              <SelectOrEnterInput
                options={unitTypeOptions}
                initialValue={values.productType}
                onChange={(e) => setFieldValue("unitType", e)}
              />
              <ErrorMessage
                name="unitType"
                component="p"
                className="text-sm text-destructive"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity*</Label>
              <Field
                as={Input}
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Enter quantity"
                className={
                  "w-25" +
                  (errors.quantity && touched.quantity
                    ? "border-destructive"
                    : "")
                }
              />
              <ErrorMessage
                name="quantity"
                component="p"
                className="text-sm text-destructive"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remark">Remark (optional)</Label>
              <Field
                as={Textarea}
                id="remark"
                name="remark"
                placeholder="Enter remark"
                rows={3}
                className={
                  "resize-none" +
                  (errors.remark && touched.remark ? "border-destructive" : "")
                }
              />
              <ErrorMessage
                name="remark"
                component="p"
                className="text-sm text-destructive"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 mt-2">
            <Button type="button" variant="outline" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              {isEdit ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </Form>
      )}
    </Formik>
  );
};
