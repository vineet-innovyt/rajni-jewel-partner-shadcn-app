import * as Yup from "yup";
import {
  AssetItemEntity,
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
import ImageUpload, { UploadedImage } from "./image-upload";

interface ICustomProductFormProps {
  cartItem?: CartItem;
  onConfirm: (orderLineItem: OrderLineItemEntity) => void;
  onClose: () => void;
  productTypeOptions?: CodeItemEntity[];
  unitTypeOptions?: CodeItemEntity[];
}

const FIELD_BORDER_CLASS = "border border-muted-foreground/40";

const validationSchema = Yup.object({
  productName: Yup.string()
    .required("Product name is required")
    .min(1, "Product name must be at least 1 characters")
    .max(250, "Product name must be less than 250 characters"),
  description: Yup.string().max(
    2000,
    "Description must be less than 2000 characters",
  ),
  quantity: Yup.number()
    .min(1, "Quantity must be at least 1")
    .required("Quantity is required")
    .max(10000, "Quantity must be less than 10k"),
  unitType: Yup.string()
    .required("Unit is required")
    .max(250, "Unit must be less than 250 characters"),
  dimensions: Yup.string()
    .optional()
    .max(250, "Dimensions must be less than 250 characters"),
  productType: Yup.string()
    .optional()
    .max(250, "Product type must be less than 250 characters"),
});

const mapAssetToUploadedImage = (
  attachment: AssetItemEntity,
  index: number,
): UploadedImage => ({
  name: attachment.name || `Image ${index + 1}`,
  size: Number(attachment.metadata?.size || 0),
  base64: attachment.url || "",
});

const mapUploadedImageToAsset = (image: UploadedImage): AssetItemEntity => ({
  type: "image",
  name: image.name,
  url: image.base64,
  metadata: {
    size: image.size,
  },
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
    dimensions: orderLineItem?.dimensions || "",
    imageAttachments: orderLineItem?.imageAttachments || product?.images || [],
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
      images: values.imageAttachments,
    };
    onConfirm({
      product: prod,
      unitType: values.unitType,
      dimensions: values.dimensions,
      imageAttachments: values.imageAttachments,
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
      {({
        values,
        setFieldValue,
        errors,
        touched,
        isValid,
      }) => (
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
                  FIELD_BORDER_CLASS +
                  (errors.productName && touched.productName
                    ? " border-destructive"
                    : "")
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
                  `resize-none ${FIELD_BORDER_CLASS}` +
                  (errors.description && touched.description
                    ? " border-destructive"
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
              <Label htmlFor="unitType">Unit* (kg, gram, ounce)</Label>
              <SelectOrEnterInput
                options={unitTypeOptions}
                initialValue={values.unitType}
                onChange={(e) => setFieldValue("unitType", e)}
              />
              <ErrorMessage
                name="unitType"
                component="p"
                className="text-sm text-destructive"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions (optional)</Label>
              <Field
                as={Input}
                id="dimensions"
                name="dimensions"
                placeholder="e.g., 10 x 8 mm, 18 inch, size 7"
                className={
                  FIELD_BORDER_CLASS +
                  (errors.dimensions && touched.dimensions
                    ? " border-destructive"
                    : "")
                }
              />
              <ErrorMessage
                name="dimensions"
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
                  `resize-none ${FIELD_BORDER_CLASS}` +
                  (errors.remark && touched.remark
                    ? " border-destructive"
                    : "")
                }
              />
              <ErrorMessage
                name="remark"
                component="p"
                className="text-sm text-destructive"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity*{values?.unitType?` (${values.unitType})`: ""}</Label>
              <div className="flex gap-2 items-center flex-row">
              <div className="w-30">
                <Field
                  as={Input}
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  className={
                    FIELD_BORDER_CLASS +
                    (errors.quantity && touched.quantity
                      ? " border-destructive"
                      : "")
                  }
                />
              </div>
              <ErrorMessage
                name="quantity"
                component="p"
                className="text-sm text-destructive"
              />
              </div>
            </div>
              <div className="space-y-2">
              <ImageUpload
                title="Image Attachments (optional)"
                maxFileSize={10}
                maxImages={20}
                initialImages={values.imageAttachments.map(
                  mapAssetToUploadedImage,
                )}
                onImagesChange={(images) => {
                  setFieldValue(
                    "imageAttachments",
                    images.map(mapUploadedImageToAsset),
                  );
                }}
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
