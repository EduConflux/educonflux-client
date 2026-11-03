import { describe, it, expect, vi } from 'vitest';
import { parentApi } from './parentApi';
import { apiClient } from '../../../api/client';

vi.mock('../../../api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('parentApi Client Unit Tests', () => {
  it('calls correct endpoint for getMyStudents', async () => {
    (apiClient.get as any).mockResolvedValueOnce({ data: [] });
    await parentApi.getMyStudents();
    expect(apiClient.get).toHaveBeenCalledWith('/parents/me/students');
  });

  it('calls correct endpoint for getStudentAttendanceSummary', async () => {
    (apiClient.get as any).mockResolvedValueOnce({ data: { attendancePercentage: 85.0 } });
    await parentApi.getStudentAttendanceSummary(42);
    expect(apiClient.get).toHaveBeenCalledWith('/parents/me/students/42/attendance/summary');
  });

  it('calls correct endpoint for createParent payload', async () => {
    const payload = {
      firstName: 'Martha',
      lastName: 'Wayne',
      email: 'martha@wayne.org',
      relationship: 'Mother',
    };
    (apiClient.post as any).mockResolvedValueOnce({ data: { id: 101, ...payload } });
    await parentApi.createParent(payload as any);
    expect(apiClient.post).toHaveBeenCalledWith('/parents', payload);
  });

  it('calls correct endpoint for linkStudent with parentId', async () => {
    const payload = { studentId: 99, relationship: 'Guardian' };
    (apiClient.post as any).mockResolvedValueOnce({ data: { id: 101 } });
    await parentApi.linkStudent(101, payload as any);
    expect(apiClient.post).toHaveBeenCalledWith('/parents/101/students', payload);
  });
});

