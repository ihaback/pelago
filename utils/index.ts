import * as Yup from "yup";

export const ListingSchema = Yup.object().shape({
  title: Yup.string().trim().required(),
  description: Yup.string().trim().required(),
  price: Yup.number().positive().integer().min(1).required(),
  guests: Yup.number().positive().integer().min(1).required(),
  beds: Yup.number().positive().integer().min(1).required(),
  baths: Yup.number().positive().integer().min(1).required(),
});

export const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("This field is required"),
});

export const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};
