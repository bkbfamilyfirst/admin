/**
 * Get last key generation info
 */
export interface LastKeyGeneration {
  count: number;
  generatedAt: string;
}

export const getLastKeyGeneration = async (): Promise<LastKeyGeneration> => {
  try {
    const response = await api.get('/admin/last-key-generation');
    return response.data;
  } catch (error) {
    console.error('Error fetching last key generation:', error);
    throw error;
  }
};
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.familyfirst.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token refreshing
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 Unauthorized and if it's an expired token
    // Assuming backend sends a flag like `error.response.data.expired` for expired access tokens
  if (error.response && error.response.status === 401 && error.response.data?.expired && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request to prevent infinite loops

      try {
        // Attempt to refresh the token
        const response = await api.post('/auth/refresh-token');
        const newAccessToken = response.data.accessToken;

        // Update the stored access token
        localStorage.setItem('accessToken', newAccessToken);

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login page
        console.error('Failed to refresh token:', refreshError);
        localStorage.removeItem('accessToken');
        // Redirect to your login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // For any other error, or if refresh token failed, just reject the promise
    return Promise.reject(error);
  }
);

/**
 * Fetch paginated list for ND, SS, DB, Retailer roles
 */
export const getRoleListPaginated = async (
  role: "nd" | "ss" | "db" | "retailer",
  page: number = 1,
  limit: number = 10
) => {
  const endpointMap = {
    nd: "/admin/nd-list-paginated",
    ss: "/admin/ss-list-paginated",
    db: "/admin/db-list-paginated",
    retailer: "/admin/retailer-list-paginated",
  };
  const endpoint = endpointMap[role];
  try {
    console.log(`${API_BASE_URL}${endpoint}`)
    const response = await api.get(`${API_BASE_URL}${endpoint}`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${role} list:`, error);
    throw error;
  }
};

export interface NationalDistributor {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  assignedKeys: number;
  usedKeys: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSummary {
  totalKeys: {
    total: number;
    monthlyGrowth: number;
    active: number;
    inactive: number;
  };
  totalActivations: {
    total: number;
    monthlyGrowth: number;
    active: number;
    inactive: number;
  };
  keyValidityTimeline: {
    "0-6": number;
    "6-12": number;
    "12-18": number;
    "18-24": number;
    summary: {
      validKeys: number;
      expiringSoon: number;
      averageValidity: number;
    }
  };
  keyInventory: {
    totalGenerated: number;
    transferred: number;
    remaining: number;
    transferProgress: number;
  };
  nd: number; // Represents active NDs
  db: number;
  ss: number;
  retailer: number;
  admin: number;
}

export const getAdminSummary = async (): Promise<AdminSummary> => {
  try {
    const response = await api.get('/admin/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin summary:', error);
    throw error;
  }
};

export const getNationalDistributors = async (): Promise<NationalDistributor[]> => {
  try {
    const response = await api.get('/admin/nd-list');
    return response.data.nds;
  } catch (error) {
    console.error('Error fetching national distributors:', error);
    throw error;
  }
};

export const getKeyInventory = async () => {
  try {
    const response = await api.get('/admin/key-inventory');
    return response.data;
  } catch (error) {
    console.error('Error fetching key inventory:', error);
    throw error;
  }
};

export const getKeyValidityTimeline = async () => {
  try {
    const response = await api.get('/admin/key-validity-timeline');
    return response.data;
  } catch (error) {
    console.error('Error fetching key validity timeline:', error);
    throw error;
  }
};

export const transferKeysToNationalDistributor = async (ndId: string, keysToTransfer: number) => {
  try {
    const response = await api.post('/admin/transfer-keys-to-nd', {
      ndId,
      keysToTransfer,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error transferring keys:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Request payload:', { ndId, keysToTransfer });
      // toast.error(error.response?.data?.message || "Failed to transfer keys");
    } else {
      console.error('No response received from server.');
    }
    throw error;
  }
};

export interface AddNDResponse {
  message: string;
  nd: {
    password: string;
    phone: any;
    username: any;
    id: string;
    name: string;
    email: string;
    defaultPassword: string;
    companyName: string;
    notes: string;
  };
}

export const addNationalDistributor = async (distributorData: {
  companyName: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  assignedKeys: number;
  password: string;
  notes?: string;
}): Promise<AddNDResponse> => {
  try {
    const response = await api.post('/admin/nd', distributorData);
    return response.data;
  } catch (error) {
    console.error('Error adding national distributor:', error);
    throw error;
  }
};

export const editNationalDistributor = async (ndId: string, updatedData: Partial<NationalDistributor>) => {
  try {
    const response = await api.patch(`/admin/nd/${ndId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error editing national distributor:', error);
    throw error;
  }
};

export const deactivateNationalDistributor = async (ndId: string) => {
  try {
    const response = await api.patch(`/admin/nd/deactivate/${ndId}`);
    return response.data;
  } catch (error) {
    console.error('Error deactivating national distributor:', error);
    throw error;
  }
};

export const blockNationalDistributor = async (ndId: string) => {
  try {
    const response = await api.patch(`/admin/nd/block/${ndId}`);
    return response.data;
  } catch (error) {
    console.error('Error blocking national distributor:', error);
    throw error;
  }
};

export const deleteNationalDistributor = async (ndId: string) => {
  try {
    const response = await api.delete(`/admin/nd/${ndId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting national distributor:', error);
    throw error;
  }
};

export interface Assignment {
  transferId: string;
  from: {
    id: string;
    name: string;
    role: string;
  } | null;
  to: {
    id: string;
    name: string;
    role: string;
  } | null;
  count: number;
  date: string;
}

export interface KeyTransferLog {
  transferId: string;
  timestamp: string;
  from: {
    id: string;
    name: string;
    role: string;
  } | null;
  to: {
    id: string;
    name: string;
    role: string;
  } | null;
  count: number;
  status: string;
  type: string;
  notes?: string;
}

export const getNdAssignments = async (page: number = 1, limit: number = 10, startDate: string = '', endDate: string = '', search: string = ''): Promise<{ message: string; assignments: Assignment[], total: number }> => {
  try {
    const response = await api.get('/admin/nd-assignments', {
      params: {
        page,
        limit,
        startDate,
        endDate,
        search,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching ND assignments:', error);
    throw error;
  }
};

export const getKeyTransferLogs = async (page: number = 1, limit: number = 10, sortBy: string = 'timestamp', sortOrder: 'asc' | 'desc' = 'desc', search: string = '', startDate: string = '', endDate: string = '', distributorId: string = '', status: string = '') => {
  try {
    const response = await api.get('/admin/key-transfer-logs', {
      params: {
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        startDate,
        endDate,
        distributorId,
        status,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching key transfer logs:', error);
    throw error;
  }
};

export const exportKeyTransferLogs = async (filters: { startDate: string, endDate: string, distributorId: string, status: string, search: string }) => {
  try {
    const response = await api.get('/admin/key-transfer-logs/export', {
      params: filters,
      responseType: 'blob', // Important for downloading files
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'key_transfer_logs.csv');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    return { message: "Export initiated successfully." };
  } catch (error) {
    console.error('Error exporting key transfer logs:', error);
    throw error;
  }
};

export const getTransferStats = async () => {
  try {
    const response = await api.get('/admin/transfer-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching transfer stats:', error);
    throw error;
  }
};

export interface AdminProfile {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  assignedKeys: number;
  usedKeys: number;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  status: string;
  notes: string;
  bio: string;
}

export const getAdminProfile = async (): Promise<AdminProfile> => {
  try {
    const response = await api.get('/admin/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    throw error;
  }
};

export const editAdminProfile = async (updatedData: Partial<AdminProfile>) => {
  try {
    const response = await api.patch('/admin/profile', updatedData);
    return response.data;
  } catch (error) {
    console.error('Error editing admin profile:', error);
    throw error;
  }
};

export const changeAdminPassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await api.patch('/admin/change-password', { currentPassword, newPassword });
    return response.data;
  } catch (error) {
    console.error('Error changing admin password:', error);
    throw error;
  }
};

export const generateKeys = async (count: number, keyLength: number = 16) => {
  try {
    const response = await api.post('/admin/generate-keys', {
      count,
      keyLength,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating keys:', error);
    throw error;
  }
};


/**
 * Logs out the user by removing the access token and optionally redirecting to login page.
 */
export const logout = (redirect: boolean = true) => {
  localStorage.removeItem('accessToken');
  if (redirect) {
    window.location.href = '/login';
  }
};

export default api;