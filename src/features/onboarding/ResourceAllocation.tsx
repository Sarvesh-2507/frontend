import React, { useState } from "react";
import { Laptop, UserPlus, ChevronDown, ChevronUp, Search, PlusCircle, Edit, Trash2, CheckCircle, XCircle, Clock, AlertTriangle, MoreHorizontal, Filter, Phone, Monitor, Laptop2, Shield, Database, HardDrive } from "lucide-react";
import ModulePage from "../../components/ModulePage";
import { motion } from "framer-motion";

interface ResourceItem {
  id: string;
  type: "laptop" | "desktop" | "phone" | "access" | "software" | "other";
  name: string;
  description: string;
  status: "available" | "allocated" | "maintenance" | "on-order";
  assignedTo?: string;
  assignedDate?: string;
  dueDate?: string;
  specifications?: string;
  serialNumber?: string;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  joiningDate: string;
  email: string;
  resources: ResourceItem[];
}

const ResourceAllocation: React.FC = () => {
  // Mock data for resources
  const [resources, setResources] = useState<ResourceItem[]>([
    {
      id: "r1",
      type: "laptop",
      name: "MacBook Pro 13\"",
      description: "M1, 16GB RAM, 512GB SSD",
      status: "allocated",
      assignedTo: "David Wilson",
      assignedDate: "2023-08-15",
      dueDate: "2023-12-15",
      specifications: "Apple M1 Chip, 16GB RAM, 512GB SSD, Space Gray",
      serialNumber: "C02F13EKML7N"
    },
    {
      id: "r2",
      type: "laptop",
      name: "Dell XPS 15",
      description: "Intel i7, 32GB RAM, 1TB SSD",
      status: "available",
      specifications: "Intel Core i7-11800H, 32GB RAM, 1TB SSD, NVIDIA RTX 3050Ti",
      serialNumber: "CN0J412N664498B"
    },
    {
      id: "r3",
      type: "desktop",
      name: "HP EliteDesk 800 G6",
      description: "Intel i5, 16GB RAM, 512GB SSD",
      status: "maintenance",
      specifications: "Intel Core i5-10500, 16GB RAM, 512GB SSD, Windows 11 Pro",
      serialNumber: "CZC0517JHS"
    },
    {
      id: "r4",
      type: "phone",
      name: "iPhone 13",
      description: "256GB, Black",
      status: "allocated",
      assignedTo: "Jessica Martinez",
      assignedDate: "2023-07-20",
      dueDate: "2023-11-20",
      specifications: "A15 Bionic chip, 256GB Storage, 6.1-inch Super Retina XDR display",
      serialNumber: "C39VJWE2N66W"
    },
    {
      id: "r5",
      type: "software",
      name: "Adobe Creative Cloud",
      description: "Design Software Suite",
      status: "available",
      specifications: "Complete Creative Cloud Suite including Photoshop, Illustrator, etc."
    },
    {
      id: "r6",
      type: "access",
      name: "GitHub Enterprise",
      description: "Source Code Repository Access",
      status: "allocated",
      assignedTo: "Robert Chang",
      assignedDate: "2023-08-01",
      specifications: "Developer access level with repository creation rights"
    },
    {
      id: "r7",
      type: "laptop",
      name: "Lenovo ThinkPad X1 Carbon",
      description: "Intel i7, 16GB RAM, 512GB SSD",
      status: "on-order",
      specifications: "Intel Core i7-1165G7, 16GB RAM, 512GB SSD, Windows 11 Pro",
      dueDate: "2023-09-30"
    }
  ]);

  // Mock data for employees
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "e1",
      name: "David Wilson",
      position: "Frontend Developer",
      department: "Engineering",
      joiningDate: "2023-08-15",
      email: "david.w@example.com",
      resources: [
        {
          id: "r1",
          type: "laptop",
          name: "MacBook Pro 13\"",
          description: "M1, 16GB RAM, 512GB SSD",
          status: "allocated",
          assignedTo: "David Wilson",
          assignedDate: "2023-08-15",
          dueDate: "2023-12-15"
        }
      ]
    },
    {
      id: "e2",
      name: "Jessica Martinez",
      position: "Product Manager",
      department: "Product",
      joiningDate: "2023-07-20",
      email: "jessica.m@example.com",
      resources: [
        {
          id: "r4",
          type: "phone",
          name: "iPhone 13",
          description: "256GB, Black",
          status: "allocated",
          assignedTo: "Jessica Martinez",
          assignedDate: "2023-07-20",
          dueDate: "2023-11-20"
        }
      ]
    },
    {
      id: "e3",
      name: "Robert Chang",
      position: "UX Designer",
      department: "Design",
      joiningDate: "2023-08-01",
      email: "robert.c@example.com",
      resources: [
        {
          id: "r6",
          type: "access",
          name: "GitHub Enterprise",
          description: "Source Code Repository Access",
          status: "allocated",
          assignedTo: "Robert Chang",
          assignedDate: "2023-08-01"
        }
      ]
    },
    {
      id: "e4",
      name: "Emily Brown",
      position: "Marketing Specialist",
      department: "Marketing",
      joiningDate: "2023-09-01",
      email: "emily.b@example.com",
      resources: []
    }
  ]);

  const [selectedTab, setSelectedTab] = useState<"resources" | "employees">("resources");
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [newResource, setNewResource] = useState<Partial<ResourceItem>>({
    type: "laptop",
    name: "",
    description: "",
    status: "available",
    specifications: ""
  });

  // Filter resources based on search term and filters
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.assignedTo && resource.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTypeFilter = resourceTypeFilter === "all" || resource.type === resourceTypeFilter;
    const matchesStatusFilter = statusFilter === "all" || resource.status === statusFilter;

    return matchesSearch && matchesTypeFilter && matchesStatusFilter;
  });

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) => {
    return (
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle resource assignment
  const handleAssignResource = (employeeId: string) => {
    if (!selectedResource) return;

    // Update resource status
    const updatedResources = resources.map(resource =>
      resource.id === selectedResource.id
        ? {
            ...resource,
            status: "allocated" as const,
            assignedTo: employees.find(e => e.id === employeeId)?.name,
            assignedDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 120 days from now
          }
        : resource
    );
    setResources(updatedResources);

    // Update employee's resources
    const updatedEmployees = employees.map(employee =>
      employee.id === employeeId
        ? {
            ...employee,
            resources: [...employee.resources, {
              ...selectedResource,
              status: "allocated" as const,
              assignedTo: employee.name,
              assignedDate: new Date().toISOString().split('T')[0],
              dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }]
          }
        : employee
    );
    setEmployees(updatedEmployees);

    setShowAssignModal(false);
    setSelectedResource(prev => ({
      ...prev!,
      status: "allocated" as const,
      assignedTo: employees.find(e => e.id === employeeId)?.name,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));

    alert(`Resource assigned to ${employees.find(e => e.id === employeeId)?.name}`);
  };

  // Handle resource release
  const handleReleaseResource = (resourceId: string) => {
    if (!confirm("Are you sure you want to release this resource?")) return;

    // Find which employee has this resource
    const employeeWithResource = employees.find(employee =>
      employee.resources.some(resource => resource.id === resourceId)
    );

    if (employeeWithResource) {
      // Remove resource from employee
      const updatedEmployees = employees.map(employee =>
        employee.id === employeeWithResource.id
          ? {
              ...employee,
              resources: employee.resources.filter(resource => resource.id !== resourceId)
            }
          : employee
      );
      setEmployees(updatedEmployees);
    }

    // Update resource status
    const updatedResources = resources.map(resource =>
      resource.id === resourceId
        ? {
            ...resource,
            status: "available" as const,
            assignedTo: undefined,
            assignedDate: undefined,
            dueDate: undefined
          }
        : resource
    );
    setResources(updatedResources);

    if (selectedResource?.id === resourceId) {
      setSelectedResource(prev => ({
        ...prev!,
        status: "available" as const,
        assignedTo: undefined,
        assignedDate: undefined,
        dueDate: undefined
      }));
    }

    alert("Resource released successfully");
  };

  // Handle adding a new resource
  const handleAddResource = () => {
    const { name, description, type, status, specifications, serialNumber } = newResource;

    if (!name || !description || !type) {
      alert("Please fill in all required fields");
      return;
    }

    const newResourceItem: ResourceItem = {
      id: `r${resources.length + 1}`,
      type: type as any,
      name,
      description,
      status: status as any || "available",
      specifications,
      serialNumber
    };

    setResources([...resources, newResourceItem]);
    setNewResource({
      type: "laptop",
      name: "",
      description: "",
      status: "available",
      specifications: ""
    });
    setShowAddResourceModal(false);
    alert("Resource added successfully");
  };

  // Handle resource deletion
  const handleDeleteResource = (resourceId: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    // Remove resource
    setResources(resources.filter(resource => resource.id !== resourceId));

    // If the resource is assigned to an employee, remove it from there too
    const updatedEmployees = employees.map(employee => ({
      ...employee,
      resources: employee.resources.filter(resource => resource.id !== resourceId)
    }));
    setEmployees(updatedEmployees);

    if (selectedResource?.id === resourceId) {
      setSelectedResource(null);
    }

    alert("Resource deleted successfully");
  };

  // Get icon based on resource type
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "laptop":
        return <Laptop className="h-5 w-5" />;
      case "desktop":
        return <Laptop2 className="h-5 w-5" />;
      case "phone":
        return <Phone className="h-5 w-5" />;
      case "access":
        return <Shield className="h-5 w-5" />;
      case "software":
        return <Database className="h-5 w-5" />;
      default:
        return <HardDrive className="h-5 w-5" />;
    }
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "allocated":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "maintenance":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "on-order":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <ModulePage
      title="Resource Allocation"
      description="Manage and allocate resources for new employees"
      icon={Laptop}
      comingSoon={false}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setSelectedTab("resources")}
              className={`px-6 py-3 text-sm font-medium ${
                selectedTab === "resources"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Resources
            </button>
            <button
              onClick={() => setSelectedTab("employees")}
              className={`px-6 py-3 text-sm font-medium ${
                selectedTab === "employees"
                  ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Employees
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder={`Search ${selectedTab}...`}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>

                {selectedTab === "resources" && (
                  <>
                    <div className="relative">
                      <select
                        className="appearance-none pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={resourceTypeFilter}
                        onChange={(e) => setResourceTypeFilter(e.target.value)}
                        aria-label="Filter by resource type"
                      >
                        <option value="all">All Types</option>
                        <option value="laptop">Laptops</option>
                        <option value="desktop">Desktops</option>
                        <option value="phone">Phones</option>
                        <option value="access">Access</option>
                        <option value="software">Software</option>
                        <option value="other">Other</option>
                      </select>
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>

                    <div className="relative">
                      <select
                        className="appearance-none pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        aria-label="Filter by status"
                      >
                        <option value="all">All Status</option>
                        <option value="available">Available</option>
                        <option value="allocated">Allocated</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="on-order">On Order</option>
                      </select>
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                  </>
                )}
              </div>

              {selectedTab === "resources" && (
                <button
                  onClick={() => setShowAddResourceModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Resource</span>
                </button>
              )}
            </div>

            {/* Resources Tab Content */}
            {selectedTab === "resources" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Resource
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredResources.length > 0 ? (
                      filteredResources.map((resource) => (
                        <tr 
                          key={resource.id} 
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                          onClick={() => setSelectedResource(resource)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-start">
                              <div className="ml-2">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{resource.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{resource.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="mr-2">
                                {getResourceIcon(resource.type)}
                              </div>
                              <span className="text-sm text-gray-900 dark:text-white capitalize">
                                {resource.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(resource.status)}`}>
                              {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {resource.assignedTo || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                            <div className="flex items-center justify-center space-x-2">
                              {resource.status === "available" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedResource(resource);
                                    setShowAssignModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                  title="Assign resource"
                                >
                                  <UserPlus className="h-5 w-5" />
                                </button>
                              )}
                              
                              {resource.status === "allocated" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReleaseResource(resource.id);
                                  }}
                                  className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                                  title="Release resource"
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                              )}
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteResource(resource.id);
                                }}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Delete resource"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                          No resources found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Employees Tab Content */}
            {selectedTab === "employees" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Employee
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Position
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Joining Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Allocated Resources
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee) => (
                        <tr 
                          key={employee.id} 
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                          onClick={() => setSelectedEmployee(employee)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-start">
                              <div className="ml-2">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{employee.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{employee.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{employee.position}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{employee.department}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(employee.joiningDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                                {employee.resources.length} resources
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                          No employees found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Resource Detail Modal */}
            {selectedResource && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-3xl"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      <div className="mr-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                        {getResourceIcon(selectedResource.type)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedResource.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{selectedResource.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedResource(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      aria-label="Close modal"
                    >
                      <XCircle className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Resource Details</h4>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Type:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{selectedResource.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeClass(selectedResource.status)}`}>
                            {selectedResource.status.charAt(0).toUpperCase() + selectedResource.status.slice(1)}
                          </span>
                        </div>
                        {selectedResource.serialNumber && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Serial Number:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedResource.serialNumber}</span>
                          </div>
                        )}
                        {selectedResource.specifications && (
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Specifications:</span>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{selectedResource.specifications}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Assignment Details</h4>
                      {selectedResource.status === "allocated" ? (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Assigned To:</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedResource.assignedTo}</span>
                          </div>
                          {selectedResource.assignedDate && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Assigned Date:</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {new Date(selectedResource.assignedDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {selectedResource.dueDate && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Return Due:</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {new Date(selectedResource.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center h-full">
                          <p className="text-gray-500 dark:text-gray-400 text-center mb-4">This resource is not currently assigned</p>
                          {selectedResource.status === "available" && (
                            <button
                              onClick={() => setShowAssignModal(true)}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                            >
                              <UserPlus className="h-4 w-4" />
                              <span>Assign to Employee</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end mt-6 space-x-3">
                    {selectedResource.status === "allocated" && (
                      <button
                        onClick={() => handleReleaseResource(selectedResource.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Release Resource</span>
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedResource(null)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Employee Detail Modal */}
            {selectedEmployee && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-3xl"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedEmployee.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{selectedEmployee.position} • {selectedEmployee.department}</p>
                    </div>
                    <button
                      onClick={() => setSelectedEmployee(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      aria-label="Close modal"
                    >
                      <XCircle className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Employee Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedEmployee.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Department:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedEmployee.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Joining Date:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(selectedEmployee.joiningDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Resource Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Total Resources:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedEmployee.resources.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Hardware Items:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedEmployee.resources.filter(r => ['laptop', 'desktop', 'phone'].includes(r.type)).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Software/Access:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedEmployee.resources.filter(r => ['software', 'access'].includes(r.type)).length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Allocated Resources</h4>
                  {selectedEmployee.resources.length > 0 ? (
                    <div className="overflow-x-auto bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                        <thead>
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resource</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                          {selectedEmployee.resources.map((resource) => (
                            <tr key={resource.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{resource.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{resource.description}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="mr-2">
                                    {getResourceIcon(resource.type)}
                                  </div>
                                  <span className="text-sm text-gray-900 dark:text-white capitalize">
                                    {resource.type}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {resource.assignedDate ? new Date(resource.assignedDate).toLocaleDateString() : "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => handleReleaseResource(resource.id)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  title="Release resource"
                                >
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400">No resources allocated to this employee yet</p>
                      <button
                        onClick={() => {
                          setSelectedEmployee(null);
                          setSelectedTab("resources");
                        }}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        <span>Allocate Resources</span>
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setSelectedEmployee(null)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Assign Resource Modal */}
            {showAssignModal && selectedResource && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-lg"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Assign {selectedResource.name} to Employee
                  </h3>
                  
                  <div className="overflow-y-auto max-h-96 mb-6">
                    <div className="space-y-2">
                      {employees.map((employee) => (
                        <motion.div
                          key={employee.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleAssignResource(employee.id)}
                          className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{employee.name}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{employee.position} • {employee.department}</p>
                            </div>
                            <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowAssignModal(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Add Resource Modal */}
            {showAddResourceModal && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-lg"
                >
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Add New Resource
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="resourceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Resource Type*
                      </label>
                      <select
                        id="resourceType"
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={newResource.type}
                        onChange={(e) => setNewResource({...newResource, type: e.target.value as any})}
                      >
                        <option value="laptop">Laptop</option>
                        <option value="desktop">Desktop</option>
                        <option value="phone">Phone</option>
                        <option value="access">Access/License</option>
                        <option value="software">Software</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="resourceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Resource Name*
                      </label>
                      <input
                        type="text"
                        id="resourceName"
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g. MacBook Pro 13"
                        value={newResource.name}
                        onChange={(e) => setNewResource({...newResource, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="resourceDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description*
                      </label>
                      <input
                        type="text"
                        id="resourceDescription"
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g. M1, 16GB RAM, 512GB SSD"
                        value={newResource.description}
                        onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="resourceStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        id="resourceStatus"
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={newResource.status}
                        onChange={(e) => setNewResource({...newResource, status: e.target.value as any})}
                      >
                        <option value="available">Available</option>
                        <option value="on-order">On Order</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="resourceSerialNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Serial Number (optional)
                      </label>
                      <input
                        type="text"
                        id="resourceSerialNumber"
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g. C02F13EKML7N"
                        value={newResource.serialNumber || ""}
                        onChange={(e) => setNewResource({...newResource, serialNumber: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="resourceSpecifications" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Specifications (optional)
                      </label>
                      <textarea
                        id="resourceSpecifications"
                        rows={3}
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter detailed specifications"
                        value={newResource.specifications || ""}
                        onChange={(e) => setNewResource({...newResource, specifications: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setShowAddResourceModal(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                      aria-label="Cancel"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddResource}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                      aria-label="Add resource"
                    >
                      Add Resource
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModulePage>
  );
};

export default ResourceAllocation;
