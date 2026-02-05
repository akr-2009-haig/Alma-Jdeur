import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Custom API client with unique patterns
class HospitalAPIClient {
  private baseEndpoint = '/api';

  private async makeRequest<T>(
    endpoint: string,
    config?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseEndpoint}${endpoint}`, {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'حدث خطأ' }));
      throw new Error(errorData.message || 'فشل الطلب');
    }

    return response.json();
  }

  // Surgeon authentication operations
  async registerNewSurgeon(credentials: { email: string; password: string; name: string; role?: string }) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async authenticateSurgeon(credentials: { email: string; password: string }) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async fetchCurrentSurgeon() {
    return this.makeRequest('/auth/me');
  }

  async terminateSession() {
    return this.makeRequest('/auth/logout', { method: 'POST' });
  }

  // Patient operations with unique naming
  async admitNewPatient(patientInfo: any) {
    return this.makeRequest('/patients', {
      method: 'POST',
      body: JSON.stringify(patientInfo),
    });
  }

  async retrieveAllPatients() {
    return this.makeRequest('/patients');
  }

  async retrieveActivePatients() {
    return this.makeRequest('/patients/active');
  }

  async retrievePatientDetails(patientId: number) {
    return this.makeRequest(`/patients/${patientId}`);
  }

  async modifyPatientInfo(patientId: number, updates: any) {
    return this.makeRequest(`/patients/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async dischargePatientToArchive(patientId: number, dischargeInfo: any) {
    return this.makeRequest(`/patients/${patientId}/discharge`, {
      method: 'POST',
      body: JSON.stringify(dischargeInfo),
    });
  }

  // Medical notes operations
  async addMedicalNote(noteData: any) {
    return this.makeRequest('/followups', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  async retrievePatientNotes(patientId: number) {
    return this.makeRequest(`/followups/patient/${patientId}`);
  }

  // Medical files operations
  async uploadMedicalDocument(fileInfo: any) {
    return this.makeRequest('/media', {
      method: 'POST',
      body: JSON.stringify(fileInfo),
    });
  }

  async retrievePatientDocuments(patientId: number) {
    return this.makeRequest(`/media/patient/${patientId}`);
  }

  // Archive operations
  async retrieveArchivedCases() {
    return this.makeRequest('/archive');
  }

  // Announcements operations
  async publishNewAnnouncement(announcementInfo: any) {
    return this.makeRequest('/news', {
      method: 'POST',
      body: JSON.stringify(announcementInfo),
    });
  }

  async retrieveAllAnnouncements() {
    return this.makeRequest('/news');
  }

  async modifyAnnouncement(id: number, updates: any) {
    return this.makeRequest(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async removeAnnouncement(id: number) {
    return this.makeRequest(`/news/${id}`, { method: 'DELETE' });
  }

  // Discussion operations
  async addDiscussionPost(discussionInfo: any) {
    return this.makeRequest('/comments', {
      method: 'POST',
      body: JSON.stringify(discussionInfo),
    });
  }

  async retrieveAnnouncementDiscussions(newsId: number) {
    return this.makeRequest(`/comments/news/${newsId}`);
  }

  async removeDiscussionPost(id: number) {
    return this.makeRequest(`/comments/${id}`, { method: 'DELETE' });
  }

  // Statistics operations
  async retrieveDashboardMetrics() {
    return this.makeRequest('/statistics/dashboard');
  }

  // Bed management
  async retrieveDepartmentBeds(department: string) {
    return this.makeRequest(`/beds/${department}`);
  }

  async modifyDepartmentBeds(department: string, updates: any) {
    return this.makeRequest(`/beds/${department}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Surgeon management
  async retrieveAllSurgeons() {
    return this.makeRequest('/users');
  }

  async changeSurgeonPermissions(id: number, role: string) {
    return this.makeRequest(`/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }
}

export const hospitalAPI = new HospitalAPIClient();

// Custom React hooks with unique patterns
export function useAuthenticatedSurgeon() {
  return useQuery({
    queryKey: ['currentSurgeon'],
    queryFn: () => hospitalAPI.fetchCurrentSurgeon(),
    retry: false,
  });
}

export function useSurgeonAuthentication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: hospitalAPI.authenticateSurgeon.bind(hospitalAPI),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentSurgeon'] });
    },
  });
}

export function useSurgeonRegistration() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: hospitalAPI.registerNewSurgeon.bind(hospitalAPI),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentSurgeon'] });
    },
  });
}

export function useSessionTermination() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: hospitalAPI.terminateSession.bind(hospitalAPI),
    onSuccess: () => {
      queryClient.setQueryData(['currentSurgeon'], null);
    },
  });
}

export function usePatientAdmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: hospitalAPI.admitNewPatient.bind(hospitalAPI),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['activePatients'] });
    },
  });
}

export function usePatientsList() {
  return useQuery({
    queryKey: ['patients'],
    queryFn: () => hospitalAPI.retrieveAllPatients(),
  });
}

export function useActiveCasesList() {
  return useQuery({
    queryKey: ['activePatients'],
    queryFn: () => hospitalAPI.retrieveActivePatients(),
  });
}

export function usePatientDetails(patientId: number | null) {
  return useQuery({
    queryKey: ['patientDetails', patientId],
    queryFn: () => hospitalAPI.retrievePatientDetails(patientId!),
    enabled: !!patientId,
  });
}

export function usePatientModification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ patientId, updates }: { patientId: number; updates: any }) =>
      hospitalAPI.modifyPatientInfo(patientId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patientDetails', variables.patientId] });
    },
  });
}

export function usePatientDischarge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ patientId, dischargeInfo }: { patientId: number; dischargeInfo: any }) =>
      hospitalAPI.dischargePatientToArchive(patientId, dischargeInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['activePatients'] });
      queryClient.invalidateQueries({ queryKey: ['archive'] });
    },
  });
}

export function useMedicalNoteCreation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: hospitalAPI.addMedicalNote.bind(hospitalAPI),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patientNotes', variables.patientId] });
    },
  });
}

export function usePatientNotesList(patientId: number | null) {
  return useQuery({
    queryKey: ['patientNotes', patientId],
    queryFn: () => hospitalAPI.retrievePatientNotes(patientId!),
    enabled: !!patientId,
  });
}

export function useMedicalDocumentUpload() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: hospitalAPI.uploadMedicalDocument.bind(hospitalAPI),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patientDocuments', variables.patientId] });
    },
  });
}

export function usePatientDocumentsList(patientId: number | null) {
  return useQuery({
    queryKey: ['patientDocuments', patientId],
    queryFn: () => hospitalAPI.retrievePatientDocuments(patientId!),
    enabled: !!patientId,
  });
}

export function useArchivedCasesList() {
  return useQuery({
    queryKey: ['archive'],
    queryFn: () => hospitalAPI.retrieveArchivedCases(),
  });
}

export function useAnnouncementsList() {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: () => hospitalAPI.retrieveAllAnnouncements(),
  });
}

export function useAnnouncementPublishing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: hospitalAPI.publishNewAnnouncement.bind(hospitalAPI),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useAnnouncementModification() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) =>
      hospitalAPI.modifyAnnouncement(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useAnnouncementRemoval() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: hospitalAPI.removeAnnouncement.bind(hospitalAPI),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useDiscussionsList(newsId: number | null) {
  return useQuery({
    queryKey: ['discussions', newsId],
    queryFn: () => hospitalAPI.retrieveAnnouncementDiscussions(newsId!),
    enabled: !!newsId,
  });
}

export function useDiscussionPosting() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: hospitalAPI.addDiscussionPost.bind(hospitalAPI),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['discussions', variables.newsId] });
    },
  });
}

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: () => hospitalAPI.retrieveDashboardMetrics(),
  });
}

export function useSurgeonsList() {
  return useQuery({
    queryKey: ['surgeons'],
    queryFn: () => hospitalAPI.retrieveAllSurgeons(),
  });
}