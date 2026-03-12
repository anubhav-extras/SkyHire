export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Part-time';
  category: string;
  salary: string;
  postedAt: any; // Timestamp
  description: string;
  requirements: string[];
  logo?: string;
  active?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  resumeUrl?: string;
  role: 'candidate' | 'company_admin';
  savedJobs?: string[];
  companyId?: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  benefits?: string[];
  adminUid: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateUid: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedAt: any; // Timestamp
}
