import type { UMKMAccount } from '../types/admin';
import type { ApiPendingUMKMUser, ApiUMKMProfileWithUser, ApiUser, ApiUMKMProfile } from '../types/admin';

/**
 * Maps API response data to UMKMAccount format used by the UI component
 * Handles both response formats:
 * 1. From getPendingUmkm: user with umkmProfile relation
 * 2. From getAllUmkmProfiles: profile with user relation
 */
export function mapApiToUMKMAccount(
  apiData: ApiPendingUMKMUser | ApiUMKMProfileWithUser
): UMKMAccount {
  // Debug log the incoming data
  // console.log('Mapping API data:', apiData);

  // Determine if this is a user-based or profile-based response
  let user: ApiUser | undefined;
  let profile: ApiUMKMProfile | null | undefined;

  if ('umkmProfile' in apiData) {
    // Response from getPendingUmkm - user with umkmProfile
    user = apiData as ApiPendingUMKMUser;
    profile = apiData.umkmProfile;
  } else if ('user' in apiData) {
    // Response from getAllUmkmProfiles - profile with user
    const profileData = apiData as ApiUMKMProfileWithUser;
    user = profileData.user;
    profile = profileData;
  } else {
    // Fallback: assume it's a user object
    user = apiData as ApiUser;
    profile = null;
  }

  // Add null checks for user
  if (!user) {
    console.error('User is null or undefined:', apiData);
    throw new Error('User data is missing or invalid');
  }

  if (!user.id) {
    console.error('User ID is missing:', user);
    throw new Error('User ID is missing or invalid');
  }
  
  // Generate a placeholder image based on category or use a default
  const getPlaceholderImage = (category?: string): string => {
    const categoryImages: Record<string, string> = {
      'Makanan & Minuman': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
      'Kue & Bakery': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      'Jasa Laundry': 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400',
      'Buah & Sayur': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
      'Jasa Bengkel': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400',
      'Kafe & Minuman': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    };
    
    return category && categoryImages[category] 
      ? categoryImages[category]
      : 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400';
  };

  // Extract category from description or use default
  const extractCategory = (description?: string | null): string => {
    if (!description) return 'Lainnya';
    
    const categoryKeywords: Record<string, string[]> = {
      'Makanan & Minuman': ['makanan', 'makan', 'warung', 'restoran', 'kuliner'],
      'Kue & Bakery': ['kue', 'bakery', 'roti', 'cake'],
      'Jasa Laundry': ['laundry', 'cuci'],
      'Buah & Sayur': ['buah', 'sayur', 'segar'],
      'Jasa Bengkel': ['bengkel', 'motor', 'mobil', 'service'],
      'Kafe & Minuman': ['kopi', 'kafe', 'cafe', 'minuman'],
    };

    const lowerDesc = description.toLowerCase();
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        return category;
      }
    }
    
    return 'Lainnya';
  };

  // Map user status to UMKMAccount status
  const mapStatus = (userStatus: string): 'pending' | 'approved' | 'rejected' => {
    switch (userStatus) {
      case 'active':
        return 'approved';
      case 'rejected':
        return 'rejected';
      case 'pending':
      default:
        return 'pending';
    }
  };

  // Map account status for suspension
  const mapAccountStatus = (userStatus: string): 'active' | 'suspended' => {
    return userStatus === 'suspended' ? 'suspended' : 'active';
  };

  // Generate documents list based on available data
  const generateDocuments = (): string[] => {
    const docs: string[] = [];
    if (profile) {
      docs.push('Profil UMKM');
      if (profile.kontak_wa) docs.push('Kontak WhatsApp');
      if (profile.lintang && profile.bujur) docs.push('Koordinat Lokasi');
    }
    return docs.length > 0 ? docs : ['Belum ada dokumen'];
  };

  const category = profile ? extractCategory(profile.deskripsi) : 'Lainnya';

  return {
    id: user.id,
    name: profile?.nama_toko || 'Belum ada nama toko',
    owner: user.nama || 'Nama tidak tersedia',
    email: user.email || 'Email tidak tersedia',
    phone: user.nomor_hp || '-',
    location: profile?.alamat || 'Belum ada alamat',
    category,
    description: profile?.deskripsi || 'Belum ada deskripsi',
    documents: generateDocuments(),
    status: mapStatus(user.status),
    accountStatus: mapAccountStatus(user.status),
    submittedAt: user.created_at || new Date().toISOString(),
    reviewedAt: user.updated_at || undefined,
    image: getPlaceholderImage(category),
  };
}

/**
 * Maps array of API responses to UMKMAccount array
 * Handles both response formats from getPendingUmkm and getAllUmkmProfiles
 */
export function mapApiArrayToUMKMAccounts(
  apiDataArray: Array<ApiPendingUMKMUser | ApiUMKMProfileWithUser>
): UMKMAccount[] {
  return apiDataArray.map(mapApiToUMKMAccount);
}

/**
 * Maps pending UMKM users (from getPendingUmkm) to UMKMAccount array
 */
export function mapPendingUMKMToAccounts(users: ApiPendingUMKMUser[]): UMKMAccount[] {
  return users.map(mapApiToUMKMAccount);
}

/**
 * Maps UMKM profiles (from getAllUmkmProfiles) to UMKMAccount array
 */
export function mapUMKMProfilesToAccounts(profiles: ApiUMKMProfileWithUser[]): UMKMAccount[] {
  return profiles.map(mapApiToUMKMAccount);
}