import { useEffect, useState } from 'react';

export interface GstStat {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  iconType: 'status' | 'returns' | 'due' | 'exposure';
}

export interface GstService {
  id: string;
  title: string;
  description: string;
  price: string;
  priceType: string;
  iconType: 'registration' | 'filing' | 'compliance' | 'cancellation' | 'amendment' | 'certificate';
}

export interface GstAppRecord {
  id: string;
  title: string;
  reference: string;
  details: string;
  assignee: string;
  status: string;
  progress: number;
}

export const useGstDashboardData = () => {
  const [stats, setStats] = useState<GstStat[]>([]);
  const [services, setServices] = useState<GstService[]>([]);
  const [applications, setApplications] = useState<GstAppRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call for dynamic data
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      // Development mock
      const mockStats: GstStat[] = [
        { id: '1', title: 'GSTIN status', value: 'Active', subtitle: 'Registered 18 Jul 2026', iconType: 'status' },
        { id: '2', title: 'Returns filed', value: '14', subtitle: 'FY 2026-27 to date', iconType: 'returns' },
        { id: '3', title: 'Next due', value: '20 Sep', subtitle: 'GSTR-3B · August 2026', iconType: 'due' },
        { id: '4', title: 'Late fee exposure', value: '₹0', subtitle: 'No pending returns', iconType: 'exposure' },
      ];

      const mockServices: GstService[] = [
        { id: '1', title: 'GST Registration', description: 'New GSTIN for your business, end to end with the department.', price: '₹5,000', priceType: 'one time', iconType: 'registration' },
        { id: '2', title: 'GST Filing', description: 'Monthly or quarterly GSTR-1 and GSTR-3B preparation and filing.', price: '₹2,500', priceType: 'per period', iconType: 'filing' },
        { id: '3', title: 'GST Compliance', description: 'Annual return, reconciliation and notice handling.', price: '₹4,000', priceType: 'per year', iconType: 'compliance' },
        { id: '4', title: 'GST Cancellation', description: 'Surrender a GSTIN and close out pending returns.', price: '₹3,500', priceType: 'one time', iconType: 'cancellation' },
        { id: '5', title: 'GST Amendment', description: 'Change address, business name, or authorised signatory.', price: '₹2,000', priceType: 'per change', iconType: 'amendment' },
        { id: '6', title: 'GST Certificate', description: 'Download a fresh registration certificate copy.', price: '₹750', priceType: 'per copy', iconType: 'certificate' },
      ];

      const mockApplications: GstAppRecord[] = [
        { id: '1', title: 'GST Monthly Filing', reference: 'GST-2026-00118', details: 'August 2026 · GSTR-1 & GSTR-3B', assignee: 'Rohit Kulkarni', status: 'ARN Generated', progress: 58 },
        { id: '2', title: 'GST Registration', reference: 'GST-2026-00092', details: 'Shree Deshmukh Traders', assignee: 'Rohit Kulkarni', status: 'Completed', progress: 100 },
      ];

      setTimeout(() => {
        setStats(mockStats);
        setServices(mockServices);
        setApplications(mockApplications);
        setIsLoading(false);
      }, 500);
    };

    fetchDashboardData();
  }, []);

  return { stats, services, applications, isLoading };
};
