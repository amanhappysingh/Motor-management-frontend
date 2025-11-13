import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Api } from "../../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type MotorOutFormType = {
  id?: string;
  motor_id: string;
  serial_no: string;
  motor_eq_code: string;
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
  motor_condition: string;
  remark?: string;
  resistance_ry: number;
  resistance_yb: number;
  resistance_rb: number;
  ir_ph_to_ph: number;
  ir_ph_to_e: number;
};

interface MotorOutFormProps {
  data?: Partial<MotorOutFormType>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isNavigate?: boolean
}

export default function MotorTrailForm({ data, setIsOpen , isNavigate}: MotorOutFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const { register, handleSubmit, setValue, reset } = useForm<MotorOutFormType>({
    defaultValues: {
      motor_id: "",
      serial_no: "",
      motor_eq_code: "",
      kw: "",
      rpm: 0,
      frame: "",
      amp: "",
      voltage: "",
      mounting: "",
      make: "",
      location: "",
      bearing_de: "",
      bearing_nde: "",
      motor_condition: "",
      remark: "",
      resistance_ry: 0,
      resistance_yb: 0,
      resistance_rb: 0,
      ir_ph_to_ph: 0,
      ir_ph_to_e: 0,
    },
  });

  // ✅ Prefill data when editing
  useEffect(() => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
         if(key !== 'remark'){
             setValue(key as keyof MotorOutFormType, value as any);
         }
        
      });
    }
  }, [data, setValue]);

  // ✅ API PATCH
  const updateMotorOut = async (payload: {
    motor_id: string;
    remark?: string;
    resistance_ry: number;
    resistance_yb: number;
    resistance_rb: number;
    ir_ph_to_ph: number;
    ir_ph_to_e: number;
  }) => {
    const res = await Api.patch({
      url: `/v1/motors/${data?.id}/move-to-available`,
      data: payload,
    });
    return res.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateMotorOut,
    onSuccess: () => {
      toast.success("Motor is now available for install/Out. ✅");
      queryClient.invalidateQueries({ queryKey: ["motors", "all-trail-motors"] });
      if(isNavigate){
        navigate('/')
      }
      setIsOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update Motor Out ❌");
    },
  });

  // ✅ Submit Handler (limited payload)
  const onSubmit = (formData: MotorOutFormType) => {
    const payload = {
      motor_id: formData.motor_id,
      remark: formData.remark || "",
      resistance_ry: Number(formData.resistance_ry),
      resistance_yb: Number(formData.resistance_yb),
      resistance_rb: Number(formData.resistance_rb),
      ir_ph_to_ph: Number(formData.ir_ph_to_ph),
      ir_ph_to_e: Number(formData.ir_ph_to_e),
    };

    console.log("FINAL PATCH PAYLOAD =>", payload);
    mutate(payload);
  };

  // ✅ Read-only fields
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
    { label: "Bearing No NDE)", name: "bearing_nde" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            

            {/* Readonly Fields */}
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

            {/* Resistance Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resistance RY (Ω)
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("resistance_ry", { required: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resistance YB (Ω)
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("resistance_yb", { required: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resistance RB (Ω)
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("resistance_rb", { required: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IR (Phase to Phase)
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("ir_ph_to_ph", { required: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IR (Phase to Earth)
                </label>
                <input
                  type="number"
                  step="any"
                  {...register("ir_ph_to_e", { required: true })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remark
              </label>
              <textarea
                rows={3}
                {...register("remark")}
                placeholder="Enter any remarks..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-gray-300"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              
              <button
                type="submit"
                disabled={isPending}
                className={`px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold transition ${
                  isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
                }`}
              >
                {isPending ? "Saving..." : "Save Motor Out Test"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
