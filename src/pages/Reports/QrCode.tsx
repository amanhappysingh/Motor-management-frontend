import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, CheckCircle, Wrench, PlayCircle, XCircle, Package } from 'lucide-react';

interface MotorData {
  id: string;
  name: string;
  motorIn: {
    date: string;
    receivedFrom: string;
    condition: string;
    serialNumber: string;
    model: string;
  };
  overhauling: {
    startDate: string;
    endDate: string;
    technician: string;
    partsReplaced: string[];
    laborHours: number;
    status: string;
  };
  trail: {
    date: string;
    voltage: string;
    current: string;
    rpm: string;
    temperature: string;
    vibration: string;
    result: string;
  };
  fault: {
    faultType: string;
    severity: string;
    description: string;
    detectedDate: string;
    rootCause: string;
  };
  motorOut: {
    date: string;
    deliveredTo: string;
    condition: string;
    warranty: string;
    certificationImage: string;
    remarks: string;
  };
}

// Mock API function
const fetchMotorData = async (motorId: string): Promise<MotorData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: motorId,
    name: "Industrial AC Motor - 3 Phase",
    motorIn: {
      date: "2024-10-15",
      receivedFrom: "Manufacturing Unit A",
      condition: "Faulty - Not Starting",
      serialNumber: "MTR-2024-1547",
      model: "AC3P-750-IE3"
    },
    overhauling: {
      startDate: "2024-10-16",
      endDate: "2024-10-28",
      technician: "Rajesh Kumar",
      partsReplaced: [
        "Bearing Assembly (Front & Rear)",
        "Cooling Fan",
        "Terminal Box Gasket",
        "Rotor Winding (Partial)"
      ],
      laborHours: 48,
      status: "Completed"
    },
    trail: {
      date: "2024-10-29",
      voltage: "415V AC",
      current: "125A",
      rpm: "1480 RPM",
      temperature: "68°C",
      vibration: "2.5 mm/s (Normal)",
      result: "Passed - All Parameters Normal"
    },
    fault: {
      faultType: "Bearing Failure",
      severity: "High",
      description: "Excessive vibration and noise due to worn out bearings. Motor was overheating during operation.",
      detectedDate: "2024-10-15",
      rootCause: "Lack of lubrication and prolonged usage beyond service interval"
    },
    motorOut: {
      date: "2024-11-01",
      deliveredTo: "Manufacturing Unit A",
      condition: "Fully Operational",
      warranty: "6 Months",
      certificationImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
      remarks: "Motor tested and certified. Regular maintenance recommended every 3 months."
    }
  };
};

export default function QrCode() {
  const motorId = "MTR-2024-1547";
  
  const { data: motor, isLoading, error } = useQuery({
    queryKey: ['motor', motorId],
    queryFn: () => fetchMotorData(motorId)
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading motor details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-800 text-center font-medium">Error loading motor data</p>
        </div>
      </div>
    );
  }

  if (!motor) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{motor.name}</h1>
          <p className="text-slate-600">Motor ID: {motor.id}</p>
        </div>

        {/* Motor In Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <Package className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-800">Motor In</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Received Date</p>
              <p className="font-semibold text-slate-800">{motor.motorIn.date}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Received From</p>
              <p className="font-semibold text-slate-800">{motor.motorIn.receivedFrom}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Serial Number</p>
              <p className="font-semibold text-slate-800">{motor.motorIn.serialNumber}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Model</p>
              <p className="font-semibold text-slate-800">{motor.motorIn.model}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 md:col-span-2">
              <p className="text-sm text-slate-600 mb-1">Condition</p>
              <p className="font-semibold text-red-600">{motor.motorIn.condition}</p>
            </div>
          </div>
        </div>

        {/* Fault Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-800">Motor Fault Analysis</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-red-50 rounded-lg p-4 flex-1">
                <p className="text-sm text-slate-600 mb-1">Fault Type</p>
                <p className="font-semibold text-slate-800">{motor.fault.faultType}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 flex-1">
                <p className="text-sm text-slate-600 mb-1">Severity</p>
                <p className="font-semibold text-red-600">{motor.fault.severity}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 flex-1">
                <p className="text-sm text-slate-600 mb-1">Detected Date</p>
                <p className="font-semibold text-slate-800">{motor.fault.detectedDate}</p>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-2">Description</p>
              <p className="text-slate-800">{motor.fault.description}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-2">Root Cause</p>
              <p className="text-slate-800">{motor.fault.rootCause}</p>
            </div>
          </div>
        </div>

        {/* Overhauling Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <Wrench className="h-6 w-6 text-orange-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-800">Motor Overhauling</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Start Date</p>
              <p className="font-semibold text-slate-800">{motor.overhauling.startDate}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">End Date</p>
              <p className="font-semibold text-slate-800">{motor.overhauling.endDate}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Technician</p>
              <p className="font-semibold text-slate-800">{motor.overhauling.technician}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Labor Hours</p>
              <p className="font-semibold text-slate-800">{motor.overhauling.laborHours} hours</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Status</p>
              <p className="font-semibold text-green-600">{motor.overhauling.status}</p>
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 mt-4">
            <p className="text-sm text-slate-600 mb-2">Parts Replaced</p>
            <ul className="space-y-2">
              {motor.overhauling.partsReplaced.map((part, index) => (
                <li key={index} className="flex items-center text-slate-800">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  {part}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trail Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <PlayCircle className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-800">Motor Trail Test</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Test Date</p>
              <p className="font-semibold text-slate-800">{motor.trail.date}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Voltage</p>
              <p className="font-semibold text-slate-800">{motor.trail.voltage}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Current</p>
              <p className="font-semibold text-slate-800">{motor.trail.current}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">RPM</p>
              <p className="font-semibold text-slate-800">{motor.trail.rpm}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Temperature</p>
              <p className="font-semibold text-slate-800">{motor.trail.temperature}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-1">Vibration</p>
              <p className="font-semibold text-slate-800">{motor.trail.vibration}</p>
            </div>
          </div>
          <div className="bg-green-100 border-2 border-green-600 rounded-lg p-4">
            <p className="text-sm text-slate-600 mb-1">Test Result</p>
            <p className="font-bold text-green-700 text-lg">{motor.trail.result}</p>
          </div>
        </div>

        {/* Motor Out Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-800">Motor Out</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Delivery Date</p>
                <p className="font-semibold text-slate-800">{motor.motorOut.date}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Delivered To</p>
                <p className="font-semibold text-slate-800">{motor.motorOut.deliveredTo}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Condition</p>
                <p className="font-semibold text-green-600">{motor.motorOut.condition}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">Warranty Period</p>
                <p className="font-semibold text-slate-800">{motor.motorOut.warranty}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-2">Remarks</p>
                <p className="text-slate-800">{motor.motorOut.remarks}</p>
              </div>
            </div>
            <div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-3">Certification Image</p>
                <img 
                  src={motor.motorOut.certificationImage} 
                  alt="Motor Certification" 
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}