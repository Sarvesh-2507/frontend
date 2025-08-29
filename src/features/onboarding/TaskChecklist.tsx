import React, { useState } from "react";
import { ClipboardList, Plus, Check, Calendar, Clock, User, UserCheck, X, Search, Filter, Edit, Trash2, CheckSquare, Square } from "lucide-react";
import ModulePage from "../../components/ModulePage";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  assignee: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  category: "paperwork" | "it_setup" | "training" | "introduction" | "other";
  createdAt: string;
  completedAt?: string;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  joinDate: string;
  email: string;
  avatarUrl?: string;
  progress: number;
}

const TaskChecklist: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t1",
      title: "Complete employee information form",
      description: "Fill in personal details, emergency contacts, and tax information",
      dueDate: "2023-11-15",
      assignee: "emp1",
      status: "completed",
      priority: "high",
      category: "paperwork",
      createdAt: "2023-11-01",
      completedAt: "2023-11-05"
    },
    {
      id: "t2",
      title: "Setup workstation and equipment",
      description: "Prepare laptop, monitor, and peripherals",
      dueDate: "2023-11-10",
      assignee: "emp2",
      status: "completed",
      priority: "high",
      category: "it_setup",
      createdAt: "2023-11-01",
      completedAt: "2023-11-08"
    },
    {
      id: "t3",
      title: "Schedule orientation session",
      description: "Book meeting room and send calendar invites",
      dueDate: "2023-11-12",
      assignee: "emp3",
      status: "in_progress",
      priority: "medium",
      category: "introduction",
      createdAt: "2023-11-02"
    },
    {
      id: "t4",
      title: "Prepare training materials",
      description: "Compile training documents and access credentials",
      dueDate: "2023-11-14",
      assignee: "emp4",
      status: "pending",
      priority: "medium",
      category: "training",
      createdAt: "2023-11-03"
    },
    {
      id: "t5",
      title: "Setup email and communication tools",
      description: "Create email account, Slack access, and Teams channel access",
      dueDate: "2023-11-09",
      assignee: "emp2",
      status: "overdue",
      priority: "high",
      category: "it_setup",
      createdAt: "2023-11-01"
    },
    {
      id: "t6",
      title: "Collect signed offer letter",
      description: "Ensure the signed offer letter is received and filed",
      dueDate: "2023-11-05",
      assignee: "emp3",
      status: "completed",
      priority: "high",
      category: "paperwork",
      createdAt: "2023-10-25",
      completedAt: "2023-11-02"
    },
    {
      id: "t7",
      title: "Schedule team introduction meeting",
      description: "Arrange a meeting for the new hire to meet their team members",
      dueDate: "2023-11-16",
      assignee: "emp1",
      status: "pending",
      priority: "medium",
      category: "introduction",
      createdAt: "2023-11-04"
    },
    {
      id: "t8",
      title: "Assign first-week tasks",
      description: "Prepare initial projects and tasks for the new employee",
      dueDate: "2023-11-18",
      assignee: "emp4",
      status: "pending",
      priority: "low",
      category: "other",
      createdAt: "2023-11-04"
    }
  ]);

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "emp1",
      name: "John Smith",
      position: "HR Manager",
      department: "Human Resources",
      joinDate: "2022-05-15",
      email: "john.smith@company.com",
      progress: 90
    },
    {
      id: "emp2",
      name: "Jane Doe",
      position: "IT Specialist",
      department: "Information Technology",
      joinDate: "2022-06-20",
      email: "jane.doe@company.com",
      progress: 85
    },
    {
      id: "emp3",
      name: "Robert Johnson",
      position: "HR Coordinator",
      department: "Human Resources",
      joinDate: "2022-08-10",
      email: "robert.johnson@company.com",
      progress: 70
    },
    {
      id: "emp4",
      name: "Lisa Chen",
      position: "Department Manager",
      department: "Engineering",
      joinDate: "2022-04-05",
      email: "lisa.chen@company.com",
      progress: 95
    }
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "paperwork":
        return "Paperwork";
      case "it_setup":
        return "IT Setup";
      case "training":
        return "Training";
      case "introduction":
        return "Introduction";
      case "other":
        return "Other";
      default:
        return "Other";
    }
  };

  const getEmployeeName = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : "Unassigned";
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newStatus = task.status === "completed" ? "in_progress" : "completed";
          return {
            ...task,
            status: newStatus,
            completedAt: newStatus === "completed" ? new Date().toISOString().split('T')[0] : undefined
          };
        }
        return task;
      })
    );
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    const matchesCategory = categoryFilter ? task.category === categoryFilter : true;
    const matchesAssignee = assigneeFilter ? task.assignee === assigneeFilter : true;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssignee;
  });

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  return (
    <ModulePage
      title="Task & Checklist Tracking"
      description="Manage onboarding tasks and track progress for new employees"
      icon={ClipboardList}
    >
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">Onboarding Checklist</h2>
          
          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter || ""}
                onChange={(e) => setStatusFilter(e.target.value || null)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
              
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priorityFilter || ""}
                onChange={(e) => setPriorityFilter(e.target.value || null)}
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={assigneeFilter || ""}
                onChange={(e) => setAssigneeFilter(e.target.value || null)}
              >
                <option value="">All Assignees</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>{employee.name}</option>
                ))}
              </select>
              
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                onClick={() => {
                  setSelectedTask(null);
                  setEditMode(false);
                  setShowTaskModal(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-10 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <button
                      className="focus:outline-none"
                      onClick={() => toggleTaskStatus(task.id)}
                    >
                      {task.status === "completed" ? (
                        <CheckSquare className="h-5 w-5 text-green-500" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <div className={`font-medium ${task.status === "completed" ? "line-through text-gray-500" : "text-gray-900"}`}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{getEmployeeName(task.assignee)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{task.dueDate || "No date"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">
                      {getCategoryLabel(task.category)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          setSelectedTask(task);
                          setEditMode(true);
                          setShowTaskModal(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No tasks found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Employee Progress Cards */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Onboarding Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {employees.slice(0, 4).map((employee) => (
            <div key={employee.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center mb-3">
                <div className="mr-3 bg-blue-100 text-blue-700 p-2 rounded-full">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">{employee.name}</h3>
                  <p className="text-sm text-gray-500">{employee.position}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Completion</span>
                  <span>{employee.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${employee.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Joined: {employee.joinDate}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{employee.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-semibold mb-4">
              {editMode ? "Edit Task" : "Add New Task"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                  defaultValue={selectedTask?.title}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task description"
                  rows={3}
                  defaultValue={selectedTask?.description}
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedTask?.dueDate}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedTask?.priority || "medium"}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedTask?.assignee}
                  >
                    <option value="">Select Assignee</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>{employee.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={selectedTask?.category || "other"}
                  >
                    <option value="paperwork">Paperwork</option>
                    <option value="it_setup">IT Setup</option>
                    <option value="training">Training</option>
                    <option value="introduction">Introduction</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowTaskModal(false);
                  setSelectedTask(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {
                  // In a real implementation, we would save the task here
                  setShowTaskModal(false);
                  setSelectedTask(null);
                }}
              >
                {editMode ? "Update Task" : "Add Task"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </ModulePage>
  );
};

// Custom Mail icon component since it wasn't imported from lucide-react
const Mail = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default TaskChecklist;
