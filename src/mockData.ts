import type { Product, Store, SidebarPromotion } from './types/schema';

// Data passed as props to the root component
export const mockRootProps = {
  nearbyStores: [
    {
      id: "1",
      name: "Makketin",
      description: "Buat Makan Bersama",
      price: 50500,
      image: "https://images.unsplash.com/photo-1633101723794-5c13d1564ea3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHxmb29kJTIwYm93bCUyMEluZG9uZXNpYW4lMjBjdWlzaW5lJTIwbWVhbHxlbnwwfDJ8fHwxNzYxMjI2NjM1fDA&ixlib=rb-4.1.0&q=85"
    },
    {
      id: "2",
      name: "Serepeh",
      description: "Selamat",
      price: 84030,
      image: "https://images.unsplash.com/photo-1636298272582-9cbef6a663eb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxzbmFjayUyMGJldmVyYWdlJTIwcGFja2FnZWQlMjBmb29kJTIwcHJvZHVjdHxlbnwwfDJ8fHwxNzYxMjI2NjM1fDA&ixlib=rb-4.1.0&q=85"
    }
  ] as Store[],
  popularProducts: [
    {
      id: "1",
      name: "Noast Fitamin",
      price: 84630,
      rating: 4,
      reviewCount: 1830,
      image: "https://images.unsplash.com/photo-1562166453-964fd947f2a4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxMHx8aGVhbHRoeSUyMHNuYWNrJTIwbWVhbCUyMGtpdCUyMGZvb2QlMjBib3glMjBuYXR1cmFsJTIwZm9vZHxlbnwwfDJ8fHwxNzYxMjI2NjM1fDA&ixlib=rb-4.1.0&q=85"
    },
    {
      id: "2",
      name: "Trusti e Repise",
      price: 93300,
      rating: 4,
      reviewCount: 1850,
      image: "https://images.unsplash.com/photo-1585221330389-24fb30535ec7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxnaWZ0JTIwYmFza2V0JTIwZm9vZCUyMGhhbXBlciUyMGFydGlzYW4lMjBwcm9kdWN0cyUyMHByZW1pdW0lMjBwYWNrYWdpbmd8ZW58MHwyfHx8MTc2MTIyNjYzNXww&ixlib=rb-4.1.0&q=85"
    },
    {
      id: "3",
      name: "Drop Pasinvi",
      price: 96200,
      rating: 4,
      reviewCount: 1930,
      image: "https://images.unsplash.com/photo-1739785937091-0765ba121c99?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxzbmFjayUyMGJveCUyMHRyYWRpdGlvbmFsJTIwZm9vZCUyMGRlY29yYXRpdmUlMjBwYWNrYWdpbmclMjBsb2NhbCUyMHByb2R1Y3R8ZW58MHwyfHx8MTc2MTIyNjYzNXww&ixlib=rb-4.1.0&q=85"
    },
    {
      id: "4",
      name: "Yent Momiasha",
      price: 93300,
      rating: 4,
      reviewCount: 1668,
      image: "https://images.unsplash.com/photo-1719622144233-7f4a09ee199b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxmb29kJTIwaGFtcGVyJTIwbmF0dXJhbCUyMHByb2R1Y3RzJTIwZWNvJTIwcGFja2FnaW5nJTIwZ2lmdCUyMGJveHxlbnwwfDJ8fHwxNzYxMjI2NjM1fDA&ixlib=rb-4.1.0&q=85"
    },
    {
      id: "5",
      name: "Rosis Dedieash",
      price: 89360,
      rating: 4,
      reviewCount: 1930,
      image: "https://images.unsplash.com/photo-1726561814480-29deb5a63ca6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHxzbmFjayUyMGJhc2tldCUyMHdvdmVuJTIwcGFja2FnaW5nJTIwdHJhZGl0aW9uYWwlMjBmb29kJTIwYXJ0aXNhbiUyMHByb2R1Y3R8ZW58MHwyfHx8MTc2MTIyNjYzOXww&ixlib=rb-4.1.0&q=85"
    },
    {
      id: "6",
      name: "Mesas Kottomphe",
      price: 86560,
      rating: 4,
      reviewCount: 1940,
      image: "https://images.unsplash.com/photo-1692624024502-6a7675b17ea8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxnaWZ0JTIwYm94JTIwYXNzb3J0ZWQlMjBzbmFja3MlMjBwcmVtaXVtJTIwcGFja2FnaW5nJTIwZm9vZCUyMGhhbXBlcnxlbnwwfDJ8fHwxNzYxMjI2NjM5fDA&ixlib=rb-4.1.0&q=85"
    }
  ] as Product[],
  sidebarPromotions: [
    {
      id: "1",
      shopName: "Shop abi",
      description: "Produk toko abi",
      price: 21650,
      image: "https://images.unsplash.com/photo-1643636180039-654854ab205b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHxmb29kJTIwZGlzcGxheSUyMHNuYWNrJTIwcHJvZHVjdHMlMjBzaG9wJTIwcHJvbW90aW9uJTIwcGFja2FnZWQlMjBmb29kfGVufDB8Mnx8fDE3NjEyMjY2NDB8MA&ixlib=rb-4.1.0&q=85"
    },
    {
      id: "2",
      shopName: "Shop Eheniwati",
      rating: 4,
      reviewCount: 1950,
      image: "https://images.unsplash.com/photo-1588257456273-5db322e1676e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHxmb29kJTIwcHJvZHVjdHMlMjBhcnRpc2FuJTIwc25hY2tzJTIwc2hvcCUyMGJhbm5lciUyMHRyYWRpdGlvbmFsJTIwZm9vZHxlbnwwfDJ8fHwxNzYxMjI2NjQwfDA&ixlib=rb-4.1.0&q=85"
    },
    {
      id: "3",
      shopName: "Straw on",
      description: "Prom UMKM toko abi",
      image: "https://images.unsplash.com/photo-1542344807-658fcdfb5cf6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHxiZXZlcmFnZSUyMGZvb2QlMjBwcm9kdWN0JTIwc2hvcCUyMGRpc3BsYXklMjBwcm9tb3Rpb25hbCUyMGltYWdlfGVufDB8Mnx8fDE3NjEyMjY2NDF8MA&ixlib=rb-4.1.0&q=85"
    }
  ] as SidebarPromotion[]
};