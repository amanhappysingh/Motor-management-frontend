import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Api } from "../../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type MotorOutFormType = {
  id?: string;
  motor_id: string;
  serial_no: string;
  eq_code: string;
  kw: string;
  rpm: number;
  frame: string;
  amp: string;
  voltage: string;
  mounting: string;
  make: string;
  location: string;
  bearing_de: string;
  bearing_nde: string;
  motor_condition : string;
  remark?: string | null;
  images: FileList | null;
};

interface MotorOutFormProps {
  data?: Partial<MotorOutFormType>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isNavigate?:boolean
}

export default function MotorOutForm({ data, setIsOpen, isNavigate }: MotorOutFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<MotorOutFormType>({
    defaultValues: {
      location: "",
      remark: "",
      images: null,
    },
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // ✅ Prefill readonly data
  useEffect(() => {
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      // Exclude location & remark fields
      if (key !== "location" && key !== "remark") {
        setValue(key as keyof MotorOutFormType, value as any);
      }
    });
  }
}, [data, setValue]);


  // ✅ Handle Image Preview
  const watchImages = watch("images");
  useEffect(() => {
    if (watchImages && watchImages.length > 0) {
      const previews = Array.from(watchImages).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages(previews);
      // Cleanup URLs on unmount
      return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }
  }, [watchImages]);

  // ✅ API: PATCH to installation/out
  const saveMotorOut = async (payload: FormData) => {
    const res = await Api.patch({
      url: `/v1/motors/${data?.id}/move-to-out`,
      data: payload,
      contentType : 'multipart/form-data'
    });
    return res.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: saveMotorOut,
    onSuccess: () => {
      toast.success("Motor moved to Installation/Out ✅");
      queryClient.invalidateQueries({ queryKey: ["motors", "all-available-motors"] });
      if(isNavigate){
        navigate('/')
      }
      setIsOpen(false);
      reset();
      setPreviewImages([]);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update motor ❌");
    },
  });

  // ✅ Submit (FormData)
  const onSubmit = (formData: MotorOutFormType) => {
    const form = new FormData();
    form.append("location", formData.location);
    form.append("remark", formData.remark || "");

    if (formData.images && formData.images.length > 0) {
      Array.from(formData.images).forEach((img) => {
        form.append("images", img);
      });
    }

    console.log("FINAL PAYLOAD (FormData) =>", Object.fromEntries(form.entries()));
    mutate(form);
  };

  // ✅ Readonly fields
  const readOnlyFields: { label: string; name: keyof MotorOutFormType }[] = [
    { label: "Motor ID", name: "motor_id" },
  
    { label: "Serial No", name: "serial_no" },
    { label: "KW", name: "kw" },
    { label: "RPM", name: "rpm" },
    { label: "Frame", name: "frame" },
    { label: "Amperage", name: "amp" },
    { label: "Voltage", name: "voltage" },
    { label: "Mounting", name: "mounting" },
    { label: "Make", name: "make" },
    { label: "Location Tag", name: "location" },
    { label: "Bearing No (DE)", name: "bearing_de" },
    { label: "Bearing No (NDE)", name: "bearing_nde" },
    
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b-2 border-indigo-500">
              Move Motor to Installation / Out
            </h2>

            {/* Readonly Motor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {readOnlyFields.map((f, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {f.label}
                  </label>
                  <input
                    type="text"
                    {...register(f.name)}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
              ))}
            </div>

            {/* Location Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motor Condition *
              </label>
              <input
                type="text"
                {...register("motor_condition", { required: "Motor condition is required" })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter new location"
              />
              {errors.motor_condition && (
                <p className="text-red-500 text-sm mt-1">{errors.motor_condition.message}</p>
              )}
            </div>
            {/* Location Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Location *
              </label>
              <input
                type="text"
                {...register("location", { required: "Location is required" })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter new location"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>

            {/* Remark Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remark (Optional)
              </label>
              <textarea
                rows={3}
                {...register("remark")}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Add remark if any..."
              />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images (optional)
              </label>
              <input
                type="file"
                {...register("images")}
                accept="image/*"
                multiple
                className="w-full border border-gray-300 rounded-lg p-2 cursor-pointer"
              />

              {/* Preview */}
              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previewImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img}
                        alt={`preview-${idx}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              
              <button
                type="submit"
                disabled={isPending}
                className={`px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold transition ${
                  isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
                }`}
              >
                {isPending ? "Saving..." : "Move to Installation/Out"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
