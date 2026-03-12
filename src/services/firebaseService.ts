import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Job, UserProfile, CompanyProfile, Application } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Profile
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as UserProfile : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    return null;
  }
}

export async function createUserProfile(profile: UserProfile): Promise<void> {
  try {
    await setDoc(doc(db, 'users', profile.uid), profile);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `users/${profile.uid}`);
  }
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', uid), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
}

// Jobs
export function subscribeToJobs(callback: (jobs: Job[]) => void) {
  const q = query(collection(db, 'jobs'), where('active', '==', true), orderBy('postedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
    callback(jobs);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'jobs');
  });
}

export async function createJob(job: Omit<Job, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'jobs'), {
      ...job,
      postedAt: Timestamp.now(),
      active: true
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'jobs');
    return '';
  }
}

// Saved Jobs
export async function toggleSaveJob(uid: string, jobId: string, isSaved: boolean): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      savedJobs: isSaved ? arrayRemove(jobId) : arrayUnion(jobId)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
}

// Companies
export async function getCompany(id: string): Promise<CompanyProfile | null> {
  try {
    const docRef = doc(db, 'companies', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as CompanyProfile : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `companies/${id}`);
    return null;
  }
}

export async function createCompany(company: Omit<CompanyProfile, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'companies'), company);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'companies');
    return '';
  }
}

// Applications
export async function applyToJob(jobId: string, candidateUid: string): Promise<void> {
  try {
    await addDoc(collection(db, 'applications'), {
      jobId,
      candidateUid,
      status: 'pending',
      appliedAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'applications');
  }
}

export function subscribeToUserApplications(uid: string, callback: (apps: Application[]) => void) {
  const q = query(collection(db, 'applications'), where('candidateUid', '==', uid), orderBy('appliedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
    callback(apps);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'applications');
  });
}
