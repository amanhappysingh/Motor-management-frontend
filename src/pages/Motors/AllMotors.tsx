import React, { useRef, useState } from "react";
import ExportButtons from "../../components/ExportButton";
import FilterButtons from "../../components/FilterButtons";
import TableNew from "../../components/TableNew";
import Modal from "../../components/Modal";
import MotorRegistrationForm from "./MotorRegistrationInForm";
import MotorAvailableForm from "./MotorAvailableForm";
import MotorFaultForm from "./MotorFaultForm";
import MotorTrailForm from "./MotorTrailForm";
import MotorOverhaulingForm from "./MotorOverhaulingForm";
import { useParams } from "react-router-dom";
import { Api } from "../../utils/http";
import { URL } from "../../utils/urls";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IconEdit, IconHttpDelete, IconQrcode } from "@tabler/icons-react";
import { DeleteIcon } from "lucide-react";
import { MdDeleteForever, MdOutlineBrowserUpdated } from "react-icons/md";
import { toast } from "react-toastify";
import MotorOutForm from "./MotorOutForm";

const AllMotors = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalStatus, setOpenModalStatus] = useState(false);
  const [faultModal, setFaultModal] = useState(false);
  const [outModal, setOutModal] = useState(false);
  const [overModal, setOverModal] = useState(false);
  const [trailModal, setTrailModal] = useState(false);
  const rowRef = useRef(null)
  const queryClient = useQueryClient()
  const [openModalQr, setOpenModalQr] = useState(false);

  // ✅ Motor type definitions
  const status = {
    all: "motorsAll",
    "all-in-motors": "motorsIn",
    "all-available-motors": "motorsAvailable",
    "all-out-motors": "motorsOut",
    "all-fault-motors": "motorsFault",
    "all-trail-motors": "motorsTrail",
    "all-overhauling-motors": "motorsOverhauling",
  } as const;

  type StatusKey = keyof typeof status;

  const { type } = useParams<{ type: StatusKey }>();
  const currentType: StatusKey = type ?? "all";

  const isChildrenAllow: Record<StatusKey, boolean> = {
    all: false,
    "all-in-motors": false,
    "all-available-motors": true,
    "all-out-motors": true,
    "all-fault-motors": false,
    "all-trail-motors": false,
    "all-overhauling-motors": false,
  };

  // ✅ API
  const getMotors = async (): Promise<any[]> => {
    const endpoint = status[currentType];
    const apiUrl = URL[endpoint];
    const res = await Api.get({ url: apiUrl });
    return res?.data?.data ?? [];
  };

  const updateMotorsStatus = async ( id : string) => {
    
    const res = await Api.patch({ url: URL.motorsAll+`/${id}/move-to-overhauling` , data : {}  });
    if(res?.status === 200){
      toast.success("Moved to Maintainance/Overhauling..")
      setOpenModalStatus(false)
      queryClient.invalidateQueries({queryKey : ['motors' , currentType]})
    }
  };



  const { data: allMotors = [], isLoading } = useQuery({
    queryKey: ["motors", currentType],
    queryFn: getMotors,
    enabled: !!currentType,
    
  });

  // ✅ Forms
  const formSelection: Record<StatusKey, React.ReactNode> = {
    all: <MotorRegistrationForm type={currentType} setOpenModal={setOpenModal} />,
    "all-in-motors": <MotorRegistrationForm type={currentType} setOpenModal={setOpenModal} />,
    "all-available-motors": <MotorAvailableForm setIsOpen={setOutModal} data={rowRef.current ?? {}}  />,
    "all-out-motors": <MotorAvailableForm setIsOpen={setOutModal} data={rowRef.current ?? {}}  />,
    "all-fault-motors": <MotorFaultForm setIsOpen={setFaultModal}  data={rowRef.current ?? {}} />,
    "all-trail-motors": <MotorTrailForm setIsOpen={setTrailModal}  data={rowRef.current ?? {}} />,
    "all-overhauling-motors": <MotorOverhaulingForm setIsOpen={setOverModal}  />,
  };

  // ✅ Handle button actions
  const handleAction = (actionType: string, row: any) => {
     rowRef.current = row
    if(actionType === 'Trail'){
       setOverModal(true)
    }
    else if(actionType === 'Fault') {
        setFaultModal(true)
    }
    else if(actionType === 'Available') {
        setTrailModal(true)
    }
    else if(actionType === 'Installation') {
        setOutModal(true)
    }
  };

  // ✅ Dynamic Action Buttons Component
  const renderActionButtons = (row: any) => {
    switch (currentType) {
      case "all-overhauling-motors":
        return (
          <div className="flex gap-2">
            <IconQrcode onClick={() =>  { console.log(row , 'ádfhasjkfjasfasfjjs') ; rowRef.current = row?.qr ; setOpenModalQr(true)  }} className="cursor-pointer" size={24} />
            <button
              onClick={() => handleAction("Trail", row)}
              className="px-3 py-1 bg-green-500 text-white  cursor-pointer rounded hover:bg-green-600 text-sm"
            >
              Trail
            </button>
            <button
              onClick={() => handleAction("Fault", row)}
              className="px-3 py-1 bg-red-500 text-white cursor-pointer rounded hover:bg-red-600 text-sm"
            >
              Fault
            </button>
          </div>
        );

      case "all-trail-motors":
        return (
          <div className="flex gap-2">
            <IconQrcode onClick={() =>  { console.log(row , 'ádfhasjkfjasfasfjjs') ; rowRef.current = row?.qr ; setOpenModalQr(true)  }} className="cursor-pointer" size={24} />
            <button
              onClick={() => handleAction("Fault", row)}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
            >
              Fault
            </button>
            <button
              onClick={() => handleAction("Available", row)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Available
            </button>
          </div>
        );

      case "all-available-motors":
        return  <div className="flex gap-2">
            <IconQrcode onClick={() =>  { console.log(row , 'ádfhasjkfjasfasfjjs') ; rowRef.current = row?.qr ; setOpenModalQr(true)  }} className="cursor-pointer" size={24} />
            <button
              onClick={() => handleAction("Installation", row)}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              Installation
            </button>
          </div>
      case "all-in-motors":
        return (
          <div className="flex gap-2" >
          <IconQrcode onClick={() =>  { console.log(row , 'ádfhasjkfjasfasfjjs') ; rowRef.current = row?.qr ; setOpenModalQr(true)  }} className="cursor-pointer" size={24} />
           <MdOutlineBrowserUpdated size={24} title="Mark Maintainance/Overhaul" className="cursor-pointer text-green-600" onClick={() => { rowRef.current =row?.id ; setOpenModalStatus(true)}} />
           </div>
        )

      default:
        return (
          <div className="flex gap-3" >
          <IconQrcode onClick={() =>  { console.log(row , 'ádfhasjkfjasfasfjjs') ; rowRef.current = row?.qr ; setOpenModalQr(true)  }} className="cursor-pointer" size={24} />
          <IconEdit onClick={() =>  { setOpenModalQr(true) }} className="cursor-pointer" size={24} />
           
          <MdDeleteForever size={24} />
          </div>
        );
    }
  }; 

  // ✅ Columns with Action
  const baseMotorColumns = [
    { label: "Serial No", accesor: "serial_no", className : "whitespace-nowrap" },
    { label: "Motor ID (Eq Code)", accesor: "motor_id", className : "whitespace-nowrap" },
    { label: "RPM", accesor: "rpm" },
    { label: "Frame", accesor: "frame" },
    { label: "AMP", accesor: "amp" },
    { label: "KW", accesor: "kw" },
    { label: "Voltage", accesor: "voltage" },
    { label: "Mounting", accesor: "mounting", className : "whitespace-nowrap" },
    { label: "Make", accesor: "make", className : "whitespace-nowrap" },
   
    { label: "Bearing No (DE)", accesor: "bearing_de" },
    { label: "Bearing No (NDE)", accesor: "bearing_nde" },
    { label: "Current Status", accesor: "current_status" },
    {
      label: "Action",
      accesor: "action",
      render: (row: any  ) => renderActionButtons(row),
    },
  ];
  const motorInColumns = [
    { label: "Serial No", accesor: "serial_no", className : "whitespace-nowrap"  },
    { label: "Motor ID (Eq Code)", accesor: "motor_id", className : "whitespace-nowrap"  },
    { label: "RPM", accesor: "rpm" },
    { label: "Frame", accesor: "frame" },
    { label: "AMP", accesor: "amp" },
    { label: "KW", accesor: "kw" },
    { label: "Voltage", accesor: "voltage" },
    { label: "Mounting", accesor: "mounting", className : "whitespace-nowrap"  },
    { label: "Make", accesor: "make", className : "whitespace-nowrap" },
    { label: "In Time", accesor: "in_at" , className : "whitespace-nowrap" },
    { label: "Bearing No (DE)", accesor: "bearing_de" },
    { label: "Bearing No (NDE)", accesor: "bearing_nde" },
    { label: "Location", accesor: "location" , className : "whitespace-nowrap" },
    { label: "Remark", accesor: "remark" , className : "min-w-[200px]"  },
    {
      label: "Action",
      accesor: "action",
      render: (row: any) => renderActionButtons(row),
    },
  ];

  const overHaulMotorColumns = [
  { label: "S. No.", accesor: "serial_no" },
  { label: "Motor ID (Eq Code)", accesor: "motor_id", className : "whitespace-nowrap"  },
  { label: "KW", accesor: "kw" },
  { label: "RPM", accesor: "rpm" },
  { label: "Frame", accesor: "frame" },
  { label: "AMP", accesor: "amp" },
  { label: "Voltage", accesor: "voltage" },
  { label: "Mounting", accesor: "mounting" },
  { label: "Location", accesor: "location" },
  { label: "Bearing No (DE)", accesor: "bearing_de" },
  { label: "Bearing No (NDE)", accesor: "bearing_nde" },
  { label: "OH BY M/S", accesor: "display_name" },
  { label: "Remarks", accesor: "remark" ,  className : "whitespace-nowrap"  },
  {
    label: "Action",
    accesor: "action",
    render: (row: any) => renderActionButtons(row),
  },
];
  const outColumns = [
  { label: "Serial No / Machine No.", accesor: "serial_no", className : "whitespace-nowrap" },
  { label: "Motor ID (Eq Code)", accesor: "motor_id", className : "whitespace-nowrap"  },
  
  { label: "KW", accesor: "kw" },
  { label: "RPM", accesor: "rpm" },
  { label: "Frame", accesor: "frame" },
  { label: "AMP", accesor: "amp" },
  { label: "Voltage", accesor: "voltage" },
  { label: "Mounting", accesor: "mounting" },
  { label: "Location", accesor: "location" },
  { label: "Motor Trail Date", accesor: "trail_at", className : "whitespace-nowrap"  },

  { label: "Bearing No (DE)", accesor: "bearing_de" },
  { label: "Bearing No (NDE)", accesor: "bearing_nde" },
  { label: "OH BY M/S", accesor: "display_name" },
  { label: "Motor Resistance", children : [
    { label: "RY", accesor: "resistance_ry" },
    { label: "RB", accesor: "resistance_rb" },
    { label: "YB", accesor: "resistance_yb" },
  ] },
  { label: "Motor IR value", children : [
    { label: "PH to PH", accesor: "ir_ph_to_ph" },
    { label: "PH to E", accesor: "ir_ph_to_e" },
    
  ] },
  
  { label: "Remarks", accesor: "remark" },
  { label: "Motor Condition", accesor: "motor_condition" },
];

const availablkeColumns = [
  { label: "Serial No / Machine No.", accesor: "serial_no", className : "whitespace-nowrap" },
  { label: "Motor ID (Eq Code)", accesor: "motor_id", className : "whitespace-nowrap"  },
  
  { label: "KW", accesor: "kw" },
  { label: "RPM", accesor: "rpm" },
  { label: "Frame", accesor: "frame" },
  { label: "AMP", accesor: "amp" },
  { label: "Voltage", accesor: "voltage" },
  { label: "Mounting", accesor: "mounting" },
  { label: "Location", accesor: "location" },
  { label: "Motor Trail Date", accesor: "trail_at", className : "whitespace-nowrap"  },

  { label: "Bearing No (DE)", accesor: "bearing_de" },
  { label: "Bearing No (NDE)", accesor: "bearing_nde" },
  { label: "OH BY M/S", accesor: "display_name" },
  { label: "Motor Resistance", children : [
    { label: "RY", accesor: "resistance_ry" },
    { label: "RB", accesor: "resistance_rb" },
    { label: "YB", accesor: "resistance_yb" },
  ] },
  { label: "Motor IR value", children : [
    { label: "PH to PH", accesor: "ir_ph_to_ph" },
    { label: "PH to E", accesor: "ir_ph_to_e" },
    
  ] },
  { label: "Remarks", accesor: "remark" },
  {
    label: "Action",
    accesor: "action",
    render: (row: any) => renderActionButtons(row),
  },
];


  const motorColumns: Record<StatusKey, any[]> = {
    all: baseMotorColumns,
    "all-in-motors": motorInColumns,
    "all-available-motors": availablkeColumns,
    "all-fault-motors": baseMotorColumns,
    "all-trail-motors": overHaulMotorColumns,
    "all-out-motors": outColumns,
    "all-overhauling-motors": overHaulMotorColumns,
  };

  const rows =
    allMotors.length > 0
      ? allMotors
      : [];

  const titleMap: Record<StatusKey, string> = {
    all: "All Motors",
    "all-in-motors": "All In Motors",
    "all-available-motors": "All Available Motors",
    "all-out-motors": "All Out Motors",
    "all-fault-motors": "All Fault Motors",
    "all-trail-motors": "All Trail Motors",
    "all-overhauling-motors": "All Overhauling Motors",
  };

  return (
    <div className="w-full overflow-auto">
      {/* ✅ Header */}
      <div className="md:flex bg-white my-3 rounded-sm px-3 grid py-4 w-full">
        <div className="col-span-1">
          <h3 className="font-bold text-2xl text-gray-700 whitespace-nowrap">
            {titleMap[currentType]} {`(${rows?.length ?? 0})`}
          </h3>
        </div>

        <div className="w-full col-span-1 md:flex items-center justify-between gap-2">
          <div className="w-full md:w-fit ml-auto flex gap-1">
            <ExportButtons />
          </div>

          <div className="flex md:w-fit md:mt-0 mt-2 justify-end w-full gap-2">
            { currentType === 'all' && <FilterButtons options={[]} />}
            {currentType === "all-in-motors" && (
              <button
                className="w-fit px-4 bg-blue-500 text-white p-2 rounded-sm font-semibold cursor-pointer hover:bg-blue-600"
                onClick={() => setOpenModal(true)}
              >
                Add Motor
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Table */}
      <TableNew
        groupedColumns={motorColumns[currentType] || []}
        totalCount={rows.length}
        ischildren={isChildrenAllow[currentType]}
        isLoading={isLoading}
        rows={rows}
        cb={({ page, rowsPerPage }) => {
          console.log("Pagination →", page, rowsPerPage);
        }}
      />

      {/* ✅ Modal */}
      <Modal
        isOpen={openModal}
        size="lg"
        title="Motor Registration Form"
        setIsOpen={setOpenModal}
      >
        {formSelection["all-in-motors"]}
      </Modal>
      <Modal
        isOpen={faultModal}
        size="lg"
        title="Motor Fault Form"
        setIsOpen={setFaultModal}
      >
        {formSelection["all-fault-motors"]}
      </Modal>
      <Modal
        isOpen={overModal}
        size="lg"
        title="Motor Overhauling Form"
        setIsOpen={setOverModal}
      >
        <MotorOverhaulingForm data={rowRef?.current ?rowRef?.current : {}} setIsOpen={setOverModal}  />
      </Modal>
      <Modal
        isOpen={trailModal}
        size="lg"
        title="Motor Trail Form"
        setIsOpen={setTrailModal}
      >
        <MotorTrailForm data={rowRef?.current ?rowRef?.current : {}} setIsOpen={setTrailModal}  />
      </Modal>
      <Modal
        isOpen={outModal}
        size="lg"
        title="Motor Out Form"
        setIsOpen={setOutModal}
      >
        <MotorOutForm data={rowRef?.current ?rowRef?.current : {}} setIsOpen={setOutModal}  />
      </Modal>
      <Modal
        isOpen={openModalStatus}
        size="sm"
        title=""
        setIsOpen={setOpenModalStatus}
      >
        <div className="bg-white w-full px-4 rounded-2xl shadow-xl p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to move into
              <span className="block font-bold text-blue-600 mt-1">
                Maintenance / Overhauling?
              </span>
            </h2>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => updateMotorsStatus(rowRef.current ?? '')}
                className="px-6 py-2 cursor-pointer bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                Yes
              </button>
              <button
                onClick={() => setOpenModalStatus(false)}
                className="px-6 py-2 cursor-pointer bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                No
              </button>
            </div>
          </div>
      </Modal>
      
      
     { openModalQr && <Modal
        isOpen={openModalQr}
        size="sm"
        title={`Motor QR`}
        setIsOpen={setOpenModalQr}
      > 
        
        {rowRef.current && <img src={rowRef.current }  crossOrigin="anonymous" className="w-full h-full p-4"  />}
      </Modal>}
    </div>
  );
};

export default AllMotors;
