import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Api } from "../../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type MotorAvailableFormType = {
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
  location_tag: string;
  bearing_no: string;
  motor_condition: string;
  remark?: string;
  resistance_ry: number;
  resistance_yb: number;
  resistance_rb: number;
  ir_ph_to_ph: number;
  ir_ph_to_e: number;
};

interface MotorAvailableFormProps {
  data?: Partial<MotorAvailableFormType>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isNavigate? : boolean;
}

export default function MotorAvailableForm({ data, setIsOpen , isNavigate }: MotorAvailableFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

  const { register, handleSubmit, setValue, reset } = useForm<MotorAvailableFormType>({
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
      location_tag: "",
      bearing_no: "",
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
        setValue(key as keyof MotorAvailableFormType, value as any);
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
      url: `/v1/motors/${data?.id}/motor-out`,
      data: payload,
    });
    return res.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateMotorOut,
    onSuccess: () => {
      toast.success("Motor Out Updated Successfully ✅");
      queryClient.invalidateQueries({ queryKey: ["motors", "out"] });
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
  const onSubmit = (formData: MotorAvailableFormType) => {
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
  const readOnlyFields: { label: string; name: keyof MotorAvailableFormType }[] = [
    { label: "Motor ID", name: "motor_id" },
    { label: "Motor EQ Code", name: "motor_eq_code" },
    { label: "Serial No", name: "serial_no" },
    { label: "KW", name: "kw" },
    { label: "RPM", name: "rpm" },
    { label: "Frame", name: "frame" },
    { label: "Amperage", name: "amp" },
    { label: "Voltage", name: "voltage" },
    { label: "Mounting", name: "mounting" },
    { label: "Make", name: "make" },
    { label: "Location Tag", name: "location_tag" },
    { label: "Bearing No (DE/NDE)", name: "bearing_no" },
    { label: "Motor Condition", name: "motor_condition" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b-2 border-indigo-500">
              Motor Out Testing Form
            </h2>

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
