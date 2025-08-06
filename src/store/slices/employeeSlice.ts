import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { employeeAPI } from '../../services/api';

export interface PersonalInfo {
  dateOfBirth: string;
  gender: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  nationality: string;
  maritalStatus: string;
  bloodGroup: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
}

export interface WorkInfo {
  department: string;
  jobPosition: string;
  shift: string;
  workType: string;
  salary: string;
  joiningDate: string;
  reportingManager: string;
  employeeType: string;
  workLocation: string;
  probationPeriod: string;
  noticePeriod: string;
  workEmail: string;
}

export interface EmployeeProfile {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  personalInfo: PersonalInfo;
  workInfo: WorkInfo;
  skills: string[];
  certifications: string[];
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    grade: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    size: string;
  }>;
  attendance: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    leaveDays: number;
    attendancePercentage: number;
  };
  leave: {
    totalLeave: number;
    usedLeave: number;
    remainingLeave: number;
    pendingRequests: number;
  };
  performance: {
    currentRating: number;
    goals: Array<{
      title: string;
      status: 'pending' | 'in-progress' | 'completed';
      deadline: string;
    }>;
    reviews: Array<{
      period: string;
      rating: number;
      feedback: string;
    }>;
  };
}

interface EmployeeState {
  currentEmployee: EmployeeProfile | null;
  employees: EmployeeProfile[];
  isLoading: boolean;
  error: string | null;
  editMode: {
    basic: boolean;
    personal: boolean;
    work: boolean;
  };
}

const initialState: EmployeeState = {
  currentEmployee: null,
  employees: [],
  isLoading: false,
  error: null,
  editMode: {
    basic: false,
    personal: false,
    work: false,
  },
};

// Async thunks
export const fetchEmployeeProfile = createAsyncThunk(
  'employee/fetchProfile',
  async (employeeId: string, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.getProfile(employeeId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee profile');
    }
  }
);

export const updateEmployeeProfile = createAsyncThunk(
  'employee/updateProfile',
  async (data: Partial<EmployeeProfile>, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.updateProfile(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update employee profile');
    }
  }
);

export const uploadProfilePhoto = createAsyncThunk(
  'employee/uploadPhoto',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await employeeAPI.uploadPhoto(file);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload photo');
    }
  }
);

export const updateEmployeeStatus = createAsyncThunk(
  'employee/updateStatus',
  async (status: 'online' | 'offline' | 'away' | 'busy', { rejectWithValue }) => {
    try {
      const response = await employeeAPI.updateStatus(status);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setEditMode: (state, action: PayloadAction<{ section: keyof typeof state.editMode; enabled: boolean }>) => {
      const { section, enabled } = action.payload;
      state.editMode[section] = enabled;
    },
    clearEditModes: (state) => {
      state.editMode = {
        basic: false,
        personal: false,
        work: false,
      };
    },
    updateCurrentEmployee: (state, action: PayloadAction<Partial<EmployeeProfile>>) => {
      if (state.currentEmployee) {
        state.currentEmployee = { ...state.currentEmployee, ...action.payload };
      }
    },
    setCurrentEmployee: (state, action: PayloadAction<EmployeeProfile>) => {
      state.currentEmployee = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchEmployeeProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEmployee = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchEmployeeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update Profile
      .addCase(updateEmployeeProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEmployeeProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentEmployee) {
          state.currentEmployee = { ...state.currentEmployee, ...action.payload };
        }
        state.error = null;
      })
      .addCase(updateEmployeeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Upload Photo
      .addCase(uploadProfilePhoto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentEmployee) {
          const payload = action.payload.data || action.payload;
          state.currentEmployee.avatar = payload.avatar;
        }
        state.error = null;
      })
      .addCase(uploadProfilePhoto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update Status
      .addCase(updateEmployeeStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateEmployeeStatus.fulfilled, (state, action) => {
        if (state.currentEmployee) {
          const payload = action.payload.data || action.payload;
          state.currentEmployee.status = payload.status as 'online' | 'offline' | 'away' | 'busy';
        }
        state.error = null;
      })
      .addCase(updateEmployeeStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  setEditMode, 
  clearEditModes, 
  updateCurrentEmployee, 
  setCurrentEmployee 
} = employeeSlice.actions;

export default employeeSlice.reducer;
