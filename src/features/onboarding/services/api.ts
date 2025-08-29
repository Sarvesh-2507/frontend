import axios, { AxiosError } from 'axios';
import apiClient from '../../../services/api';

// Type definitions
export interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  status: "incomplete" | "complete" | "review" | "onboarding" | "hired";
  uploadedDocuments?: DocumentItem[];
  profileImage?: string;
  phoneNumber?: string;
  address?: string;
  joinDate?: string;
  salary?: string;
  offerStatus?: "pending" | "accepted" | "rejected";
  verificationStatus?: "pending" | "in_progress" | "completed" | "failed";
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: "verified" | "pending" | "rejected";
  notes?: string;
  url?: string;
}

export interface CandidateFormData {
  name: string;
  email: string;
  position: string;
  department: string;
  phoneNumber?: string;
  address?: string;
  expectedJoinDate?: string;
  salaryOffered?: string;
}

export interface AssignDetailsData {
  candidateId: string;
  manager?: string;
  team?: string;
  department?: string;
  assets?: string[];
  tasks?: string[];
}

export interface OfferLetterData {
  candidateId: string;
  templateId?: string;
  customizations?: Record<string, string>;
  salaryDetails?: Record<string, string | number>;
  startDate?: string;
  jobTitle?: string;
}

export interface SendInviteData {
  email: string;
  name: string;
  position?: string;
  message?: string;
  expiryDays?: number;
  includeOnboardingUrl?: boolean;
}

export interface InviteResponse {
  sent: boolean;
  token?: string;
  inviteUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API functions

// GET /api/profiles/candidate-onboarding/
export const getCandidates = async (): Promise<ApiResponse<Candidate[]>> => {
  try {
    const response = await apiClient.get('/profiles/candidate-onboarding/');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return handleApiError(error);
  }
};

// POST /api/profiles/candidate-onboarding/
export const createCandidate = async (candidateData: CandidateFormData): Promise<ApiResponse<Candidate>> => {
  try {
    const response = await apiClient.post('/profiles/candidate-onboarding/', candidateData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error creating candidate:', error);
    return handleApiError(error);
  }
};

// GET /api/profiles/candidate-onboarding/{id}/
export const getCandidateById = async (id: string): Promise<ApiResponse<Candidate>> => {
  try {
    const response = await apiClient.get(`/profiles/candidate-onboarding/${id}/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error fetching candidate with id ${id}:`, error);
    return handleApiError(error);
  }
};

// PUT /api/profiles/candidate-onboarding/{id}/
export const updateCandidate = async (id: string, candidateData: Partial<CandidateFormData>): Promise<ApiResponse<Candidate>> => {
  try {
    const response = await apiClient.put(`/profiles/candidate-onboarding/${id}/`, candidateData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error updating candidate with id ${id}:`, error);
    return handleApiError(error);
  }
};

// PATCH /api/profiles/candidate-onboarding/{id}/
export const patchCandidate = async (id: string, candidateData: Partial<CandidateFormData>): Promise<ApiResponse<Candidate>> => {
  try {
    const response = await apiClient.patch(`/profiles/candidate-onboarding/${id}/`, candidateData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error patching candidate with id ${id}:`, error);
    return handleApiError(error);
  }
};

// DELETE /api/profiles/candidate-onboarding/{id}/
export const deleteCandidate = async (id: string): Promise<ApiResponse<null>> => {
  try {
    await apiClient.delete(`/profiles/candidate-onboarding/${id}/`);
    return { success: true, message: 'Candidate deleted successfully' };
  } catch (error) {
    console.error(`Error deleting candidate with id ${id}:`, error);
    return handleApiError(error);
  }
};

// POST /api/profiles/candidate-onboarding/{id}/send-credentials/
export const sendCredentials = async (id: string, data?: { customMessage?: string }): Promise<ApiResponse<{ sent: boolean }>> => {
  try {
    const response = await apiClient.post(`/profiles/candidate-onboarding/${id}/send-credentials/`, data || {});
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error sending credentials to candidate with id ${id}:`, error);
    return handleApiError(error);
  }
};

// GET /api/profiles/candidate-onboarding/{id}/view-form/
export const viewCandidateForm = async (id: string): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.get(`/profiles/candidate-onboarding/${id}/view-form/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error viewing form for candidate with id ${id}:`, error);
    return handleApiError(error);
  }
};

// POST /api/profiles/candidate-onboarding/assign-details/
export const assignCandidateDetails = async (assignData: AssignDetailsData): Promise<ApiResponse<Candidate>> => {
  try {
    const response = await apiClient.post('/profiles/candidate-onboarding/assign-details/', assignData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error assigning details to candidate:', error);
    return handleApiError(error);
  }
};

// POST /api/profiles/candidate-onboarding/create-profiles/
export const createCandidateProfiles = async (candidateIds: string[]): Promise<ApiResponse<{ created: number }>> => {
  try {
    const response = await apiClient.post('/profiles/candidate-onboarding/create-profiles/', { candidateIds });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error creating candidate profiles:', error);
    return handleApiError(error);
  }
};

// GET /api/profiles/candidate-onboarding/form/{token}/
export const getCandidateFormByToken = async (token: string): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.get(`/profiles/candidate-onboarding/form/${token}/`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error fetching candidate form with token ${token}:`, error);
    return handleApiError(error);
  }
};

// GET /api/profiles/candidate-onboarding/pending-candidates/
export const getPendingCandidates = async (): Promise<ApiResponse<Candidate[]>> => {
  try {
    const response = await apiClient.get('/profiles/candidate-onboarding/pending-candidates/');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching pending candidates:', error);
    return handleApiError(error);
  }
};

// POST /api/profiles/candidate-onboarding/send-invite/
export const sendCandidateInvite = async (inviteData: SendInviteData): Promise<ApiResponse<InviteResponse>> => {
  try {
    // Set includeOnboardingUrl to true by default if not specified
    const dataToSend = {
      ...inviteData,
      includeOnboardingUrl: inviteData.includeOnboardingUrl !== false
    };
    
    const response = await apiClient.post('/profiles/candidate-onboarding/send-invite/', dataToSend);
    
    // For development mocking - creates a valid invite URL 
    if (process.env.NODE_ENV === 'development' && !response.data.inviteUrl) {
      const mockToken = Math.random().toString(36).substring(2, 15);
      response.data = {
        ...response.data,
        sent: true,
        token: mockToken,
        inviteUrl: `${window.location.origin}/onboarding/candidate-form/${mockToken}`
      };
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending candidate invite:', error);
    return handleApiError(error);
  }
};

// POST /api/profiles/candidate-onboarding/submit-form/{token}/
export const submitCandidateForm = async (token: string, formData: any): Promise<ApiResponse<{ submitted: boolean }>> => {
  try {
    const response = await apiClient.post(`/profiles/candidate-onboarding/submit-form/${token}/`, formData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error submitting form with token ${token}:`, error);
    return handleApiError(error);
  }
};

// Document operations
export const uploadCandidateDocument = async (candidateId: string, file: File, documentType: string): Promise<ApiResponse<DocumentItem>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    
    const response = await apiClient.post(
      `/profiles/candidate-onboarding/${candidateId}/documents/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error uploading document for candidate ${candidateId}:`, error);
    return handleApiError(error);
  }
};

export const updateDocumentStatus = async (
  candidateId: string, 
  documentId: string, 
  status: 'verified' | 'pending' | 'rejected', 
  notes?: string
): Promise<ApiResponse<DocumentItem>> => {
  try {
    const response = await apiClient.patch(
      `/profiles/candidate-onboarding/${candidateId}/documents/${documentId}/`, 
      { status, notes }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error updating document status for candidate ${candidateId}, document ${documentId}:`, error);
    return handleApiError(error);
  }
};

export const deleteDocument = async (candidateId: string, documentId: string): Promise<ApiResponse<null>> => {
  try {
    await apiClient.delete(`/profiles/candidate-onboarding/${candidateId}/documents/${documentId}/`);
    return { success: true, message: 'Document deleted successfully' };
  } catch (error) {
    console.error(`Error deleting document ${documentId} for candidate ${candidateId}:`, error);
    return handleApiError(error);
  }
};

// Offer Letter Operations
export const generateOfferLetter = async (offerData: OfferLetterData): Promise<ApiResponse<{ url: string }>> => {
  try {
    const response = await apiClient.post('/profiles/candidate-onboarding/generate-offer/', offerData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error generating offer letter:', error);
    return handleApiError(error);
  }
};

export const getOfferLetterTemplates = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await apiClient.get('/profiles/candidate-onboarding/offer-templates/');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching offer letter templates:', error);
    return handleApiError(error);
  }
};

// Helper function to handle API errors
const handleApiError = (error: any): ApiResponse<any> => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{message?: string}>;
    return { 
      success: false, 
      error: axiosError.response?.data?.message || axiosError.message || 'An unknown error occurred'
    };
  }
  return { success: false, error: 'An unknown error occurred' };
};
