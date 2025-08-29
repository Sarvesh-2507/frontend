import React, { useState } from "react";
import { Laptop, Smartphone, Monitor, Database, Package, Search, Plus, Edit, Trash2, Clock, Check, X, AlertCircle, Filter } from "lucide-react";
import ModulePage from "../../components/ModulePage";
import { motion } from "framer-motion";

interface Asset {
  id: string;
  name: string;
  type: "laptop" | "phone" | "monitor" | "software" | "accessory" | "other";
  serialNumber?: string;
  status: "available" | "assigned" | "maintenance" | "retired";
  assignedTo?: string;
  assignedDate?: string;
  dueForReturn?: string;
  specifications?: string;
  notes?: string;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
}

const AssetAllocation: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "a1",
      name: "MacBook Pro 16\"",
      type: "laptop",
      serialNumber: "MPX20230001",
      status: "assigned",
      assignedTo: "emp1",
      assignedDate: "2023-07-15",
      specifications: "M2 Pro, 32GB RAM, 1TB SSD",
      notes: "Includes charger and sleeve"
    },
    {
      id: "a2",
      name: "Dell XPS 15",
      type: "laptop",
      serialNumber: "DXP20230002",
      status: "available",
      specifications: "Intel i9, 32GB RAM, 1TB SSD"
    },
    {
      id: "a3",
      name: "iPhone 14 Pro",
      type: "phone",
      serialNumber: "IPH20230003",
      status: "assigned",
      assignedTo: "emp1",
      assignedDate: "2023-07-15"
    },
    {
      id: "a4",
      name: "Dell 27\" 4K Monitor",
      type: "monitor",
      serialNumber: "DMN20230004",
      status: "assigned",
      assignedTo: "emp2",
      assignedDate: "2023-06-10"
    },
    {
      id: "a5",
      name: "Adobe Creative Cloud License",
      type: "software",
      status: "assigned",
      assignedTo: "emp3",
      assignedDate: "2023-05-01",
      dueForReturn: "2024-05-01"
    },
    {
      id: "a6",
      name: "Logitech MX Master 3",
      type: "accessory",
      serialNumber: "LMM20230006",
      status: "available"
    },
    {
      id: "a7",
      name: "Samsung Galaxy S23",
      type: "phone",
      serialNumber: "SGS20230007",
      status: "maintenance",
      notes: "Screen replacement in progress"
    },
    {
      id: "a8",
      name: "Microsoft Office 365 License",
      type: "software",
      status: "available"
    }
  ]);

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "emp1",
      name: "Alex Johnson",
      position: "Senior Developer",
      department: "Engineering",
      email: "alex.j@company.com"
    },
    {
      id: "emp2",
      name: "Sarah Miller",
      position: "UI/UX Designer",
      department: "Design",
      email: "sarah.m@company.com"
    },
    {
      id: "emp3",
      name: "David Rodriguez",
      position: "Graphic Designer",
      department: "Marketing",
      email: "david.r@company.com"
    },
    {
      id: "emp4",
      name: "Emily Wilson",
      position: "Product Manager",
      department: "Product",
      email: "emily.w@company.com"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case "laptop":
        return <Laptop className="h-5 w-5" />;
      case "phone":
        return <Smartphone className="h-5 w-5" />;
      case "monitor":
        return <Monitor className="h-5 w-5" />;
      case "software":
        return <Database className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "retired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <Check className="h-4 w-4" />;
      case "assigned":
        return <Clock className="h-4 w-4" />;
      case "maintenance":
        return <AlertCircle className="h-4 w-4" />;
      case "retired":
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.specifications?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType ? asset.type === selectedType : true;
    const matchesStatus = selectedStatus ? asset.status === selectedStatus : true;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getEmployeeName = (id?: string) => {
    if (!id) return "Unassigned";
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : "Unknown";
  };

  const assignAsset = () => {
    if (!selectedAsset || !selectedEmployee) return;
    
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === selectedAsset.id 
          ? {
              ...asset,
              status: "assigned",
              assignedTo: selectedEmployee,
              assignedDate: new Date().toISOString().split('T')[0]
            }
          : asset
      )
    );
    
    setShowAssignModal(false);
    setSelectedAsset(null);
    setSelectedEmployee("");
  };

  const unassignAsset = (assetId: string) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === assetId 
          ? {
              ...asset,
              status: "available",
              assignedTo: undefined,
              assignedDate: undefined,
              dueForReturn: undefined
            }
          : asset
      )
    );
  };

  return (
    <ModulePage
      title="Asset Allocation"
      description="Manage and track company assets assigned to employees"
      icon={Package}
      comingSoon={false}
    >
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">Asset Inventory</h2>
          
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search assets..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <select
                id="filter-type"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedType || ""}
                onChange={(e) => setSelectedType(e.target.value || null)}
                aria-label="Filter by asset type"
              >
                <option value="">All Types</option>
                <option value="laptop">Laptops</option>
                <option value="phone">Phones</option>
                <option value="monitor">Monitors</option>
                <option value="software">Software</option>
                <option value="accessory">Accessories</option>
                <option value="other">Other</option>
              </select>
              
              <select
                id="filter-status"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus || ""}
                onChange={(e) => setSelectedStatus(e.target.value || null)}
                aria-label="Filter by asset status"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
              
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                onClick={() => {
                  setSelectedAsset(null);
                  setShowAssignModal(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                <span>New</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Assigned</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-500">
                        {getAssetTypeIcon(asset.type)}
                      </span>
                      <div>
                        <div className="font-medium text-gray-900">{asset.name}</div>
                        {asset.specifications && (
                          <div className="text-sm text-gray-500">{asset.specifications}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500 capitalize">{asset.type}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{asset.serialNumber || "N/A"}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                      {getStatusIcon(asset.status)}
                      <span className="ml-1 capitalize">{asset.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {getEmployeeName(asset.assignedTo)}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {asset.assignedDate || "N/A"}
                  </td>
                  <td className="py-4 px-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {asset.status === "available" ? (
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => {
                            setSelectedAsset(asset);
                            setShowAssignModal(true);
                          }}
                        >
                          Assign
                        </button>
                      ) : asset.status === "assigned" ? (
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => unassignAsset(asset.id)}
                        >
                          Unassign
                        </button>
                      ) : null}
                      <button className="text-gray-600 hover:text-gray-900"
                        type="button"
                        aria-label="Edit asset"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredAssets.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No assets found matching your criteria.
            </div>
          )}
        </div>
      </div>
      
      {/* Assign Asset Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-semibold mb-4">
              {selectedAsset ? `Assign Asset: ${selectedAsset.name}` : "Add New Asset"}
            </h3>
            
            {!selectedAsset && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter asset name"
                />
              </div>
            )}
            
            {!selectedAsset && (
              <div className="mb-4">
                <label htmlFor="asset-type" className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                <select 
                  id="asset-type"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Select asset type"
                >
                  <option value="">Select Type</option>
                  <option value="laptop">Laptop</option>
                  <option value="phone">Phone</option>
                  <option value="monitor">Monitor</option>
                  <option value="software">Software</option>
                  <option value="accessory">Accessory</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="assign-to" className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select
                id="assign-to"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                aria-label="Select employee to assign asset to"
              >
                <option value="">Select Employee</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.position}
                  </option>
                ))}
              </select>
            </div>
            
            {!selectedAsset && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number (optional)</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter serial number"
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedAsset(null);
                  setSelectedEmployee("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={assignAsset}
                disabled={!selectedEmployee}
              >
                {selectedAsset ? "Assign Asset" : "Add & Assign"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </ModulePage>
  );
};

export default AssetAllocation;
