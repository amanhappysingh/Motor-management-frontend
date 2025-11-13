import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Api } from "../../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type MotorFaultFormType = {
  id: string;
  serial_no: string;

  kw: string;
  rpm: string;
  frame: string;
  amp: string;
  voltage: string;
  mounting: string;
  location: string;
  bearing_de: string;
  bearing_nde: string;
  remark?: string | null;
  parts?: string[];
};

interface MotorFaultFormProps {
  data?: Partial<MotorFaultFormType>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isNavigate?: boolean;
}

export default function MotorFaultForm({ data, setIsOpen ,isNavigate }: MotorFaultFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const { register, handleSubmit, reset, setValue } = useForm<MotorFaultFormType>({
    defaultValues: {
      serial_no: "",
      
      kw: "",
      rpm: "",
      frame: "",
      amp: "",
      voltage: "",
      mounting: "",
      location: "",
      bearing_de: "",
      bearing_nde: "",
      remark: "",
      parts: [],
    },
  });

  // ✅ Fill form with data
  useEffect(() => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as keyof MotorFaultFormType, value as any);
      });
    }
  }, [data, setValue]);

  // ✅ API Call
  const saveMotorFault = async (payload: {
    remark?: string | null;
    eq_code?: string | undefined;
    parts?: string[] | undefined;
  }) => {
    const res = await Api.patch({
      url: `/v1/motors/${data?.id}/move-to-fault`,
      data: payload,
    });
    return res.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: saveMotorFault,
    onSuccess: () => {
      toast.success("Fault reported successfully ✅");
      queryClient.invalidateQueries({ queryKey: ["motors", "all-overhauling-motors"] });
      if(isNavigate){
        navigate('/')
      }
      setIsOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to report fault ❌");
    },
  });

  const onSubmit = (formData: MotorFaultFormType) => {
    const payload = {
      remark: formData.remark || "",
     
    };

    console.log("FINAL PAYLOAD SENT =>", payload);
    mutate(payload);
  };

  // ✅ Display fields
  const motorFields: { label: string; name: keyof MotorFaultFormType; type: string }[] = [
    { label: "Serial No", name: "serial_no", type: "text" },

    { label: "KW", name: "kw", type: "text" },
    { label: "RPM", name: "rpm", type: "text" },
    { label: "Frame", name: "frame", type: "text" },
    { label: "Amperage", name: "amp", type: "text" },
    { label: "Voltage", name: "voltage", type: "text" },
    { label: "Mounting", name: "mounting", type: "text" },
    { label: "Location", name: "location", type: "text" },
    { label: "Bearing (DE)", name: "bearing_de", type: "text" },
    { label: "Bearing (NDE)", name: "bearing_nde", type: "text" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b-2 border-red-500">
              Report Motor Fault
            </h2>

            {/* ✅ All fields (readonly) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {motorFields.map((f, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    {...register(f.name)}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
              ))}
            </div>

            {/* ✅ Remarks Field */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                rows={3}
                {...register("remark")}
                placeholder="Describe the fault or issue here..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent border-gray-300"
              />
            </div>

            {/* ✅ Submit */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              
              <button
                type="submit"
                disabled={isPending}
                className={`px-6 py-2 bg-red-600 text-white rounded-lg font-semibold transition ${
                  isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
                }`}
              >
                {isPending ? "Saving..." : "Report Fault"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
