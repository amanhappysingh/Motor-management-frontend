import React from "react";
import { useForm } from "react-hook-form";
import { Api } from "../../utils/http";
import { URL } from "../../utils/urls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

type UserRegisterDTO = {
  email: string;
  phone: string;
  password: string;
  display_name: string;
  role_id: string;
};

type Role = {
  id: string;
  role: string;
  description: string;
};

interface UserRegistrationFormProps {
  allRoles: Role[];
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UserRegistrationForm({
  allRoles,
  setOpenModal,
}: UserRegistrationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserRegisterDTO>();

  const queryClient = useQueryClient();

  // ✅ API Call
  const saveUser = async (payload: UserRegisterDTO) => {
    const res = await Api.post({ url: URL.users, data: payload });
    return res.data;
  };

  // ✅ Mutation setup
  const { mutate, isPending } = useMutation({
    mutationFn: saveUser,
    onSuccess: () => {
      toast.success("User Added Successfully ✅");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      reset();
      setOpenModal(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to add user ❌");
    },
  });

  const onSubmit = (data: UserRegisterDTO) => {
    mutate(data);
  };

  return (
    <div className="h-fit flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              {...register("display_name", {
                required: "Display name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter your display name"
            />
            {errors.display_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.display_name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone must be 10 digits",
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="1234567890"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Must be at least 8 characters",
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              {...register("role_id", { required: "Please select a role" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="">Select Role</option>
              {allRoles?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.role}
                </option>
              ))}
            </select>
            {errors.role_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.role_id.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg transition font-semibold 
            ${isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700 cursor-pointer"}`}
          >
            {isPending ? "Saving..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
