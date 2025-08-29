import axios from 'axios';

// Types for candidate onboarding
export interface CandidateProfile {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: 'pending' | 'invited' | 'submitted' | 'completed' | 'rejected';
  invited_at?: string;
  submitted_at?: string;
  form_data?: string;
  position?: string;
  department?: string;
  joining_date?: string;
}

export interface SendCredentialsPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

export interface SendInvitePayload {
  first_name: string;
  last_name: string;
  email: string;
  organization: number;
  organization_name_for_email?: string;
  position?: string;
  joining_date?: string;
}

export interface FormSubmissionPayload {
  form_data: any; // This would be the actual form data structure
  documents?: File[];
}

const API_BASE_URL = 'http://192.168.1.132:8000/api/profiles/api/candidate-onboarding';

/**
 * Fetch all candidates who are in onboarding
 */
export const getAllCandidates = async (): Promise<CandidateProfile[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

/**
 * Create a new candidate profile
 */
export const createCandidate = async (candidateData: CandidateProfile): Promise<CandidateProfile> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/`, candidateData);
    return response.data;
  } catch (error) {
    console.error('Error creating candidate:', error);
    throw error;
  }
};

/**
 * Fetch details of a specific candidate by ID
 */
export const getCandidateById = async (id: string): Promise<CandidateProfile> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching candidate with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Update the entire candidate profile
 */
export const updateCandidate = async (id: string, candidateData: CandidateProfile): Promise<CandidateProfile> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}/`, candidateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating candidate with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Partially update candidate data
 */
export const patchCandidate = async (id: string, partialData: Partial<CandidateProfile>): Promise<CandidateProfile> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${id}/`, partialData);
    return response.data;
  } catch (error) {
    console.error(`Error patching candidate with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a candidate profile
 */
export const deleteCandidate = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}/`);
  } catch (error) {
    console.error(`Error deleting candidate with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Send login credentials to the candidate's email
 * IMPORTANT: This must trigger email sending
 */
export const sendCredentials = async (id: string, payload: SendCredentialsPayload): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/${id}/send-credentials/`, payload);
  } catch (error) {
    console.error(`Error sending credentials to candidate with ID ${id}:`, error);
    throw error;
  }
};

/**
 * View the submitted onboarding form of a candidate
 */
export const viewCandidateForm = async (id: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}/view-form/`);
    return response.data;
  } catch (error) {
    console.error(`Error viewing form for candidate with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Assign additional details to a candidate
 */
export const assignCandidateDetails = async (payload: any): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/assign-details/`, payload);
    return response.data;
  } catch (error) {
    console.error('Error assigning details to candidate:', error);
    throw error;
  }
};

/**
 * Bulk create candidate profiles
 */
export const bulkCreateCandidates = async (candidates: CandidateProfile[]): Promise<CandidateProfile[]> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-profiles/`, candidates);
    return response.data;
  } catch (error) {
    console.error('Error bulk creating candidates:', error);
    throw error;
  }
};

/**
 * Retrieve a candidate form via token-based link
 */
export const getCandidateFormByToken = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/form/${token}/`);
    return response.data;
  } catch (error) {
    console.error(`Error retrieving form with token ${token}:`, error);
    throw error;
  }
};

/**
 * Fetch candidates whose status is still pending
 */
export const getPendingCandidates = async (): Promise<CandidateProfile[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pending-candidates/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pending candidates:', error);
    throw error;
  }
};

/**
 * Send an email invite to a candidate
 * IMPORTANT: This requires first_name, last_name, and email in the request
 */
export const sendCandidateInvite = async (payload: SendInvitePayload): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/send-invite/`, payload);
  } catch (error) {
    console.error('Error sending invite to candidate:', error);
    throw error;
  }
};

/**
 * Candidate submits their onboarding form using a token
 */
export const submitCandidateForm = async (token: string, formData: FormSubmissionPayload): Promise<void> => {
  try {
    // If there are files to upload, need to use FormData
    if (formData.documents && formData.documents.length > 0) {
      const formDataObj = new FormData();
      formDataObj.append('form_data', JSON.stringify(formData.form_data));
      
      formData.documents.forEach((doc, index) => {
        formDataObj.append(`document_${index}`, doc);
      });
      
      await axios.post(`${API_BASE_URL}/submit-form/${token}/`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // No files, just send JSON
      await axios.post(`${API_BASE_URL}/submit-form/${token}/`, formData);
    }
  } catch (error) {
    console.error(`Error submitting form with token ${token}:`, error);
    throw error;
  }
};
