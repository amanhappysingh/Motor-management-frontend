import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Loader2,
  ChevronRight,
  Settings,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Activity,
  Gauge,
  Box,
  MapPin,
  Wrench,
  FileText,
  TrendingUp,
  Radio,
} from "lucide-react";
import Modal from "../../components/Modal";
import { Api } from "../../utils/http";
import { URL } from "../../utils/urls";
import { toast } from "react-toastify";

// ✅ Import forms
import MotorOverhaulingForm from "../Motors/MotorOverhaulingForm";
import MotorTrailForm from "../Motors/MotorTrailForm";
import MotorAvailableForm from "../Motors/MotorAvailableForm";
import MotorOutForm from "../Motors/MotorOutForm";
import MotorFaultForm from "../Motors/MotorFaultForm";

export default function Scan() {
  const { motorId } = useParams<{ motorId: string }>();
  const [openModal, setOpenModal] = useState(false);
  const [optionModal, setOptionModal] = useState(false);
  const [formType, setFormType] = useState<string | null>(null);
  const rowRef = useRef<any>(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if(openModal){
  //     navigate('/')
  //   }
  // },[openModal])

  // ✅ Move from In → Overhauling
  const updateMotorsStatus = async (id: string) => {
    try {
      const res = await Api.patch({
        url: URL.motorsAll + `/${id}/move-to-overhauling`,
        data: {},
      });
      if (res?.status === 200) {
        toast.success("Moved to Maintenance/Overhauling!");
        setOpenModal(false);
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to update status!");
    }
  };

  // ✅ Fetch motor details
  const { data: motor, isLoading, isError } = useQuery({
    queryKey: ["motors", motorId],
    queryFn: async () => {
      const res = await Api.get({ url: `${URL.motorsAll}/${motorId}` });
      return res?.data?.data;
    },
    enabled: !!motorId,
  });

  // ✅ Loading UI
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
        <span className="ml-3 text-blue-700 font-medium">
          Loading Motor Details...
        </span>
      </div>
    );

  // ✅ Error UI
  if (isError || !motor)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center bg-white shadow-xl rounded-xl p-10 border border-red-100">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Motor Not Found
          </h3>
          <p className="text-gray-500 mb-6">
            Please check the Motor ID and try again.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  // ✅ Status Config
  const statusConfig: Record<string, { color: string; icon: React.ElementType }> =
    {
      Out: { color: "text-gray-600", icon: XCircle },
      Trial: { color: "text-orange-500", icon: Activity },
      Overhauling: { color: "text-emerald-600", icon: Wrench },
      Fault: { color: "text-red-500", icon: XCircle },
      In: { color: "text-blue-500", icon: Radio },
      Available: { color: "text-teal-600", icon: CheckCircle2 },
    };

  const StatusIcon = statusConfig[motor?.current_status]?.icon || Radio;

  // ✅ Next Step Logic
  const handleNextStep = () => {
    rowRef.current = motor;

    if (motor?.current_status === "In") {
      setFormType("In");
      setOpenModal(true);
      return;
    }

    if (
      motor?.current_status === "Overhauling" ||
      motor?.current_status === "Trial"
    ) {
      setOptionModal(true);
      return;
    }

    if (["Available", "Fault", "Out"].includes(motor?.current_status)) {
      if(["Available"].includes(motor?.current_status)){
        setFormType("Out");
      }
      
      
      setOpenModal(true);
      return;
    }
  };

  // ✅ Form Renderer
  const renderForm = () => {
    const data = rowRef.current || {};
    const props = { data, setIsOpen: setOpenModal, isNavigate : true };

    switch (formType) {
      case "In":
        return (
          <div className="bg-white w-full px-4 rounded-2xl shadow-xl p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Move to{" "}
              <span className="font-bold text-blue-600">
                Maintenance / Overhauling?
              </span>
            </h2>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => updateMotorsStatus(rowRef.current?.id ?? "")}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                Yes
              </button>
              <button
                onClick={() => setOpenModal(false)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                No
              </button>
            </div>
          </div>
        );
      case "Overhauling":
        return <MotorOverhaulingForm {...props} />;
      case "Trial":
        return <MotorOverhaulingForm {...props} />;
        // return <MotorTrailForm {...props} />;
      case "Available":
        return <MotorTrailForm {...props} />;
        // return <MotorAvailableForm {...props} />;
      case "Out":
        return <MotorOutForm {...props} />;
      case "Fault":
        return <MotorFaultForm {...props} />;
      default:
        return (
          <p className="text-gray-500 text-center py-6">
            No next step available.
          </p>
        );
    }
  };

  // ✅ Options Modal (Overhauling & Trial)
  const renderOptions = () => {
    const current = motor?.current_status;
    const buttons: { label: string; key: string }[] =
      current === "Overhauling"
        ? [
            { label: "Move to Trial", key: "Trial" },
            { label: "Mark as Faulty", key: "Fault" },
          ]
        : [
            { label: "Mark as Available", key: "Available" },
            { label: "Mark as Faulty", key: "Fault" },
          ];

    return (
      <div className="bg-white w-full rounded-2xl p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">
          Select Next Step for{" "}
          <span className="text-blue-600 font-bold">{current}</span> Motor
        </h2>
        <div className="flex justify-center gap-4">
          {buttons.map((b) => (
            <button
              key={b.key}
              onClick={() => {
                setOptionModal(false);
                setFormType(b.key);
                setOpenModal(true);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all"
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ✅ DataCard (show only if value exists)
  const DataCard = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value: any;
    icon: React.ElementType;
  }) =>
    value ? (
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-semibold text-gray-600">{label}</span>
        </div>
        <p className="text-gray-800 font-medium">{value}</p>
      </div>
    ) : null;

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-50 p-6">
      {/* Header */}
      <div className="sm:flex gap-2 grid  items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Motor Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <StatusIcon
            className={`w-5 h-5 ${statusConfig[motor?.current_status]?.color}`}
          />
          <span className="font-medium text-gray-700">
            {motor?.current_status}
          </span>
        </div>
      </div>

      {/* Motor Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="sm:flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {motor?.motor_id || "Unnamed Motor"}
            </h2>
            <p className="text-sm text-gray-500">{motor?.make}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Power</p>
            <p className="text-3xl font-bold text-blue-600">
              {motor?.kw || "—"} <span className="text-lg">KW</span>
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <HeroStat icon={Gauge} label="RPM" value={motor?.rpm} />
          <HeroStat icon={Zap} label="Voltage" value={motor?.voltage && `${motor?.voltage}V`} />
          <HeroStat icon={Activity} label="AMP" value={motor?.amp} />
          <HeroStat icon={Box} label="Frame" value={motor?.frame} />
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" /> Motor Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DataCard label="Serial Number" value={motor?.serial_no} icon={FileText} />
          <DataCard label="Equipment Code" value={motor?.motor_id} icon={FileText} />
          <DataCard label="Mounting Type" value={motor?.mounting} icon={Box} />
          <DataCard label="Location" value={motor?.location} icon={MapPin} />
          <DataCard label="Condition" value={motor?.motor_condition} icon={TrendingUp} />
          <DataCard label="Overhauled By" value={motor?.display_name} icon={Wrench} />
        </div>
      </div>

      {/* Next Step */}
      <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold mb-1">Ready for Next Step</h3>
          <p className="text-blue-100 text-sm">
            Continue the motor lifecycle process
          </p>
        </div>
        <button
          onClick={handleNextStep}
          className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all"
        >
          Proceed
        </button>
      </div>

      {/* Modal for options */}
      <Modal
        isOpen={optionModal}
        size="md"
        title="Choose Next Step"
        setIsOpen={setOptionModal}
      >
        {renderOptions()}
      </Modal>

      {/* Main Form Modal */}
      <Modal
        isOpen={openModal}
        size="lg"
        title="Process Next Step"
        setIsOpen={setOpenModal}
      >
        {renderForm()}
      </Modal>
    </div>
  );
}

// ✅ HeroStat
const HeroStat = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: any;
}) =>
  value ? (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center shadow-sm">
      <Icon className="w-5 h-5 text-blue-500 mx-auto mb-1" />
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="text-lg font-semibold text-gray-700">{value}</p>
    </div>
  ) : null;
