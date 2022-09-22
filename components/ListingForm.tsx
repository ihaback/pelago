import axios from "axios";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import { PrismaTypes } from "@/lib/prisma";
import { ListingSchema } from "@/utils";

const ListingForm = ({
  initialValues = undefined,
  redirectPath = "",
  buttonText = "Submit",
  onSubmit,
}: {
  initialValues?: PrismaTypes.HomeCreateWithoutOwnerInput;
  redirectPath: string;
  buttonText: string;
  onSubmit?: (value: PrismaTypes.HomeCreateWithoutOwnerInput) => void;
}) => {
  const router = useRouter();

  const [disabled, setDisabled] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(initialValues?.image ?? "");

  const upload = async (image: FileReader["result"]) => {
    if (!image) return;

    let toastId;
    try {
      setDisabled(true);
      toastId = toast.loading("Uploading...");
      const { data } = await axios.post("/api/image-upload", { image });
      setImageUrl(data?.url);
      toast.success("Successfully uploaded", { id: toastId });
    } catch (e) {
      toast.error("Unable to upload", { id: toastId });
      setImageUrl("");
    } finally {
      setDisabled(false);
    }
  };

  const handleOnSubmit = async (
    values: PrismaTypes.HomeCreateWithoutOwnerInput,
    bag: FormikHelpers<PrismaTypes.HomeCreateWithoutOwnerInput>
  ): Promise<void> => {
    let toastId;

    try {
      setDisabled(true);
      toastId = toast.loading("Submitting...");
      if (typeof onSubmit === "function") {
        await onSubmit({ ...values, image: imageUrl });
      }
      toast.success("Successfully submitted", { id: toastId });
      if (redirectPath) {
        router.push(redirectPath);
      }
    } catch (e) {
      toast.error("Unable to submit", { id: toastId });
      setDisabled(false);
    }
  };

  const { image, ...initialFormValues } = initialValues ?? {
    image: "",
    title: "",
    description: "",
    price: 0,
    guests: 1,
    beds: 1,
    baths: 1,
  };

  return (
    <div>
      <div className="mb-8 max-w-md">
        <ImageUpload
          initialImage={{ src: image, alt: initialFormValues?.title }}
          onChangePicture={upload}
        />
      </div>

      <Formik
        initialValues={initialFormValues}
        validationSchema={ListingSchema}
        validateOnBlur={false}
        onSubmit={handleOnSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="space-y-8">
            <div className="space-y-6">
              <Input
                name="title"
                type="text"
                label="Title"
                placeholder="Entire rental unit - Amsterdam"
                disabled={disabled}
              />

              <Input
                name="description"
                type="textarea"
                label="Description"
                placeholder="Very charming and modern apartment in Amsterdam..."
                disabled={disabled}
                rows={5}
              />

              <Input
                name="price"
                type="number"
                min="0"
                label="Price per night"
                placeholder="100"
                disabled={disabled}
              />

              <div className="flex space-x-4">
                <Input
                  name="guests"
                  type="number"
                  min="0"
                  label="Guests"
                  placeholder="2"
                  disabled={disabled}
                />
                <Input
                  name="beds"
                  type="number"
                  min="0"
                  label="Beds"
                  placeholder="1"
                  disabled={disabled}
                />
                <Input
                  name="baths"
                  type="number"
                  min="0"
                  label="Baths"
                  placeholder="1"
                  disabled={disabled}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={disabled || !isValid}
                className="bg-primary-600 text-white py-2 px-6 rounded-md focus:outline-none focus:ring-4 focus:ring-primary-600 focus:ring-opacity-50 hover:bg-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-600"
              >
                {isSubmitting ? "Submitting..." : buttonText}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ListingForm;
