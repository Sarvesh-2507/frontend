import { organizationAPI } from '../services/organizationApi';
import { CreateOrganizationData } from '../types/organization';

// Test function to create an organization
export const testCreateOrganization = async () => {
  console.log('🧪 Testing Organization Creation API...');
  
  const testData: CreateOrganizationData = {
    company_name: 'Test Organization ' + Date.now(),
    name: 'Test Org Alt Name',
    description: 'This is a test organization created via API',
    location: 'Test City, Test Country',
    industry_type: 'Technology',
    employee_count: 50
  };

  try {
    console.log('📝 Creating organization with data:', testData);
    const response = await organizationAPI.createOrganization(testData);
    console.log('✅ Organization created successfully!');
    console.log('📊 Response data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Organization creation failed:', error);
    
    if (error.response) {
      console.error('❌ Error response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('❌ No response received:', error.request);
    } else {
      console.error('❌ Request setup error:', error.message);
    }
    
    throw error;
  }
};

// Test function to get organizations
export const testGetOrganizations = async () => {
  console.log('🧪 Testing Get Organizations API...');
  
  try {
    const response = await organizationAPI.getOrganizations();
    console.log('✅ Organizations fetched successfully!');
    console.log('📊 Organizations count:', response.data.length);
    console.log('📊 Organizations data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Get organizations failed:', error);
    
    if (error.response) {
      console.error('❌ Error response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('❌ No response received:', error.request);
    } else {
      console.error('❌ Request setup error:', error.message);
    }
    
    throw error;
  }
};

// Make test functions available globally for browser console testing
(window as any).testCreateOrganization = testCreateOrganization;
(window as any).testGetOrganizations = testGetOrganizations;

console.log('🔧 Organization API test functions loaded!');
console.log('💡 Use testCreateOrganization() or testGetOrganizations() in browser console to test');
