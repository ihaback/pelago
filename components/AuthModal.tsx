import { Dialog, Transition } from "@headlessui/react";
import { HomeIcon, MailOpenIcon, XIcon } from "@heroicons/react/outline";
import { Form, Formik } from "formik";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { SignInSchema } from "@/utils";

import Input from "./Input";

const Confirm = ({ show = false, email = "" }) => (
  <Transition appear show={show} as={Fragment}>
    <div className="fixed inset-0 z-50">
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-white" />
      </Transition.Child>

      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="flex items-center justify-center h-full p-8">
          <div className="overflow-hidden transition-all transform">
            <h3 className="text-center text-lg font-medium leading-6">
              <div className="flex flex-col justify-center items-center space-y-4">
                <MailOpenIcon className="w-12 h-12 shrink-0 text-primary-500" />
              </div>
              <p className="text-2xl font-semibold mt-2">Confirm your email</p>
            </h3>

            <p className="text-lg text-center mt-4">
              We emailed a magic link to <strong>{email ?? ""}</strong>.
              <br />
              Check your inbox and click the link in the email to login or sign
              up.
            </p>
          </div>
        </div>
      </Transition.Child>
    </div>
  </Transition>
);

const AuthModal = ({
  show = false,
  onClose = () => null,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  const [disabled, setDisabled] = useState(false);
  const [showConfirm, setConfirm] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const signInWithEmail = async ({ email }: { email: string }) => {
    let toastId;
    try {
      toastId = toast.loading("Loading...");
      setDisabled(true);
      const response = await signIn("email", {
        redirect: false,
        callbackUrl: window.location.href,
        email,
      });
      if (response?.error) {
        throw new Error(response?.error);
      }
      setConfirm(true);
      toast.dismiss(toastId);
    } catch (err) {
      toast.error("Unable to sign in", { id: toastId });
    } finally {
      setDisabled(false);
    }
  };

  const closeModal = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        setDisabled(false);
        setConfirm(false);
        setShowSignIn(false);
      }, 200);
    }
  }, [show]);

  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={closeModal}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-75" />

        <div className="min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl sm:rounded-md max-w-md relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 shrink-0 p-1 rounded-md hover:bg-gray-100 transition focus:outline-none"
              >
                <XIcon className="w-5 h-5" />
              </button>

              <div className="py-12">
                <div className="px-4 sm:px-12">
                  <div className="flex justify-center">
                    <Link href="/">
                      <a className="flex items-center space-x-1">
                        <HomeIcon className="shrink-0 w-8 h-8 text-primary-500" />
                        <span className="text-xl font-semibold tracking-wide">
                          Archi<span className="text-primary-500">Pelago</span>
                        </span>
                      </a>
                    </Link>
                  </div>

                  <Dialog.Title
                    as="h3"
                    className="mt-6 font-bold text-lg sm:text-2xl text-center"
                  >
                    {showSignIn ? "Welcome back!" : "Create your account"}
                  </Dialog.Title>

                  {!showSignIn ? (
                    <Dialog.Description className="mt-2 text-gray-500 text-base text-center">
                      Please create an account to list your homes and bookmark
                      your favorite ones.
                    </Dialog.Description>
                  ) : null}

                  <div className="mt-10">
                    <Formik
                      initialValues={{ email: "" }}
                      validationSchema={SignInSchema}
                      validateOnBlur={false}
                      onSubmit={signInWithEmail}
                    >
                      {({ isSubmitting, isValid, values, resetForm }) => (
                        <Form className="mt-4">
                          <Input
                            name="email"
                            type="email"
                            placeholder="elon@spacex.com"
                            disabled={disabled}
                            spellCheck={false}
                          />

                          <button
                            type="submit"
                            disabled={disabled || !isValid}
                            className="mt-6 w-full bg-primary-600 text-white py-2 px-8 rounded-md focus:outline-none focus:ring-4 focus:ring-primary-600 focus:ring-opacity-50 hover:bg-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-600"
                          >
                            {isSubmitting
                              ? "Loading..."
                              : `Sign ${showSignIn ? "in" : "up"} with email`}
                          </button>

                          <p className="mt-2 text-center text-sm text-gray-500">
                            {showSignIn ? (
                              <>
                                Don&apos;t have an account yet?{" "}
                                <button
                                  type="button"
                                  disabled={disabled}
                                  onClick={() => {
                                    setShowSignIn(false);
                                    resetForm();
                                  }}
                                  className="underline underline-offset-1 font-semibold text-primary-500 hover:text-primary-600 disabled:hover:text-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Sign up
                                </button>
                                .
                              </>
                            ) : (
                              <>
                                Already have an account?{" "}
                                <button
                                  type="button"
                                  disabled={disabled}
                                  onClick={() => {
                                    setShowSignIn(true);
                                    resetForm();
                                  }}
                                  className="underline underline-offset-1 font-semibold text-primary-500 hover:text-primary-600 disabled:hover:text-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Log in
                                </button>
                                .
                              </>
                            )}
                          </p>

                          <Confirm
                            show={showConfirm}
                            email={values?.email ?? ""}
                          />
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AuthModal;
