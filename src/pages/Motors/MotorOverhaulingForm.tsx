import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Api } from "../../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type MotorOverhaulingFormType = {
  id: string;
  serial_no: string;
  motor_id: string;
  kw: string;
  rpm: number;
  frame: string;
  amp: string;
  voltage: string;
  mounting: string;
  location: string;
  bearing_de: string;
  bearing_nde: string;
  oh_by: string;
  remark?: string;
  parts?: string[];
};

interface MotorOverhaulingFormProps {
  data?: Partial<MotorOverhaulingFormType>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isNavigate?:boolean
}

export default function MotorOverhaulingForm({ data, setIsOpen , isNavigate }: MotorOverhaulingFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  const role = "";
  const isTechnician = role?.toLowerCase() === "technician";

  const { register, handleSubmit, reset, setValue } = useForm<MotorOverhaulingFormType>({
    defaultValues: {
      serial_no: "",
      motor_id: "",
      kw: "",
      rpm: 0,
      frame: "",
      amp: "",
      voltage: "",
      mounting: "",
      location: "",
      bearing_de: "",
      bearing_nde: "",
      oh_by: "",
      remark: "",
      parts: [],
    },
  });

  const [partInput, setPartInput] = useState("");
  const [partsList, setPartsList] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if(key !== 'remark'){
          setValue(key as keyof MotorOverhaulingFormType, value as any);
        }
      });

      if (Array.isArray(data.parts)) {
        setPartsList(data.parts);
      }
    }
  }, [data, setValue]);

  // ✅ Add & Remove parts
  const handleAddPart = () => {
    if (partInput.trim() && !partsList.includes(partInput.trim())) {
      setPartsList([...partsList, partInput.trim()]);
      setPartInput("");
    }
  };
  const handleRemovePart = (i: number) => setPartsList(partsList.filter((_, idx) => idx !== i));

  // ✅ API
  const saveMotorOverhauling = async (payload: {
    remark?: string | null;

    parts?: string[];
  }) => {
    const res = await Api.patch({
      url: `/v1/motors/${data?.id}/move-to-trial`,
      data: payload,
    });
    return res.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: saveMotorOverhauling,
    onSuccess: () => {
      toast.success("Motor moved to trial successfully ✅");
      queryClient.invalidateQueries({ queryKey: ['motors',"all-overhauling-motors"] });
      if(isNavigate){
        navigate('/')
      }
      reset();
      setPartsList([]);
      setIsOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to move motor ❌");
    },
  });

  // ✅ Only send limited payload
  const onSubmit = (formData: MotorOverhaulingFormType) => {
    const payload = {
      remark: formData.remark || "",
      
      parts: partsList,
    };

    console.log("FINAL PAYLOAD SENT =>", payload);
    mutate(payload);
  };

  const motorFields: { label: string; name: keyof MotorOverhaulingFormType; type: string }[] = [
    { label: "Serial No", name: "serial_no", type: "text" },
    { label: "Motor ID (Eq Code)", name: "motor_id", type: "text" },
    { label: "KW", name: "kw", type: "text" },
    { label: "RPM", name: "rpm", type: "number" },
    { label: "Frame", name: "frame", type: "text" },
    { label: "Amperage", name: "amp", type: "text" },
    { label: "Voltage", name: "voltage", type: "text" },
    { label: "Mounting", name: "mounting", type: "text" },
    { label: "Location", name: "location", type: "text" },
    { label: "Bearing (DE)", name: "bearing_de", type: "text" },
    { label: "Bearing (NDE)", name: "bearing_nde", type: "text" },
   
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b-2 border-indigo-500">
              Move Motor to Trial
            </h2>

            {/* ✅ All fields (readable) */}
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

            {/* ✅ Parts input */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Parts Name</label>
              <div className="grid grid-cols-1 sm:flex  gap-2">
                <input
                  type="text"
                  value={partInput}
                  onChange={(e) => setPartInput(e.target.value)}
                  disabled={isTechnician}
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    isTechnician ? "bg-gray-100 cursor-not-allowed opacity-70" : "border-gray-300"
                  }`}
                  placeholder="Enter part name"
                />
                {!isTechnician && (
                  <button
                    type="button"
                    onClick={handleAddPart}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Add
                  </button>
                )}
              </div>

              {partsList.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {partsList.map((part, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                    >
                      {part}
                      {!isTechnician && (
                        <button
                          type="button"
                          onClick={() => handleRemovePart(index)}
                          className="ml-2 text-red-500 font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ✅ Remarks */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
              <textarea
                rows={3}
                {...register("remark")}
                disabled={isTechnician}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  isTechnician ? "bg-gray-100 cursor-not-allowed opacity-70" : "border-gray-300"
                }`}
              />
            </div>

            {/* ✅ Submit */}
            {!isTechnician && (
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                
                <button
                  type="submit"
                  disabled={isPending}
                  className={`px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold transition ${
                    isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
                  }`}
                >
                  {isPending ? "Saving..." : "Move to Trial"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
