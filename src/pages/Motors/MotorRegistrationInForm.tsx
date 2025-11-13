import React from "react";
import { useForm } from "react-hook-form";
import { URL } from "../../utils/urls";
import { Api } from "../../utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type MotorFormType = {
  serial_no: string;
  motor_id: string;
  rpm: number;
  frame: string;
  amp: string;
  kw: string;
  voltage: string;
  mounting: string;
  make: string;
  bearing_DE: string;
  bearing_NDE: string;
  in_at_date: string;
  in_at_time: string;
  location: string;
  remark: string;
};

interface MotorRegistrationInFormProps {
  type: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  isNavigate?:boolean;
}

export default function MotorRegistrationInForm({
  type : _type,
  setOpenModal,
  isNavigate
}: MotorRegistrationInFormProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  const { register, handleSubmit, reset } = useForm<MotorFormType>({
    defaultValues: {
      serial_no: "",
      motor_id: "",
      rpm: 0,
      frame: "",
      amp: "",
      voltage: "",
      mounting: "",
      make: "",
      bearing_DE: "",
      bearing_NDE: "",
      in_at_date: "",
      in_at_time: "",
      location: "",
      remark: "",
    },
  });

  // API Call
  const saveMotor = async (payload: MotorFormType) => {
    const res = await Api.post({ url: URL.motorsInPost, data: payload });
    return res.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: saveMotor,
    onSuccess: () => {
      toast.success("Motor Added Successfully ✅");
      queryClient.invalidateQueries({ queryKey: ['motors',"all-in-motors"] });
      reset();
      setOpenModal(false)
    },
    onError: (err: any) => {
      toast.error(err || "Failed to add motor ❌");
    },
  });

  // Helper function to format date and time
  const formatDate = (isoDate: string) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`; // Convert "2025-11-10" → "10-11-2025"
  };

  const formatTime = (time24: string) => {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`; // Convert "10:34" → "10:34 AM"
  };

  const onSubmit = (data: MotorFormType) => {
    const formattedData = {
      ...data,
      rpm: Number(data.rpm),
      in_at_date: formatDate(data.in_at_date),
      in_at_time: formatTime(data.in_at_time),
    };

    console.log("SUBMIT DATA => ", formattedData);
    mutate(formattedData);
  };

  const motorFields: {
    label: string;
    name: keyof MotorFormType;
    type: string;
  }[] = [
    { label: "Serial Number *", name: "serial_no", type: "text" },
    { label: "Motor ID *", name: "motor_id", type: "text" },
    { label: "RPM *", name: "rpm", type: "number" },
    { label: "KW *", name: "kw", type: "string" },
    { label: "Frame *", name: "frame", type: "text" },
    { label: "Amperage *", name: "amp", type: "text" },
    { label: "Voltage *", name: "voltage", type: "text" },
    { label: "Mounting *", name: "mounting", type: "text" },
    { label: "Make *", name: "make", type: "text" },
    { label: "Bearing DE *", name: "bearing_DE", type: "text" },
    { label: "Bearing NDE *", name: "bearing_NDE", type: "text" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Motor Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-indigo-500">
                Motor Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {motorFields.map((f, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      {...register(f.name, { required: true })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-indigo-500">
                Registration Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    {...register("location", { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    In Date *
                  </label>
                  <input
                    type="date"
                    {...register("in_at_date", { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    In Time *
                  </label>
                  <input
                    type="time"
                    {...register("in_at_time", { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remark
                  </label>
                  <textarea
                    rows={3}
                    {...register("remark")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
              
              <button
                type="submit"
                disabled={isPending}
                className={`px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold transition 
                ${isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"}`}
              >
                {isPending ? "Saving..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
