
export interface Artwork {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  category: string;
  dimensions: string;
  medium: string;
  year: string;
}

export const artworks: Artwork[] = [
  {
    id: '1',
    title: 'Mountain Serenity',
    description: 'A breathtaking landscape capturing the tranquil beauty of mountain peaks at sunset.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    price: '$1,200',
    category: 'Landscapes',
    dimensions: '24" x 36"',
    medium: 'Oil on Canvas',
    year: '2023'
  },
  {
    id: '2',
    title: 'Urban Dreams',
    description: 'An abstract interpretation of city life with vibrant colors and dynamic forms.',
    image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop',
    price: '$800',
    category: 'Abstract',
    dimensions: '18" x 24"',
    medium: 'Acrylic on Canvas',
    year: '2023'
  },
  {
    id: '3',
    title: 'Ocean Depths',
    description: 'A mesmerizing seascape that captures the power and beauty of ocean waves.',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop',
    price: '$950',
    category: 'Seascapes',
    dimensions: '20" x 30"',
    medium: 'Watercolor',
    year: '2023'
  },
  {
    id: '4',
    title: 'Forest Light',
    description: 'Sunbeams filtering through ancient trees, creating a magical woodland scene.',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=600&fit=crop',
    price: '$1,100',
    category: 'Landscapes',
    dimensions: '22" x 28"',
    medium: 'Oil on Canvas',
    year: '2023'
  },
  {
    id: '5',
    title: 'Desert Bloom',
    description: 'A vibrant display of wildflowers blooming in an unexpected desert landscape.',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop',
    price: '$750',
    category: 'Nature',
    dimensions: '16" x 20"',
    medium: 'Acrylic on Canvas',
    year: '2023'
  },
  {
    id: '6',
    title: 'Alpine Majesty',
    description: 'Towering peaks covered in snow, representing the raw power of nature.',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
    price: '$1,400',
    category: 'Landscapes',
    dimensions: '30" x 40"',
    medium: 'Oil on Canvas',
    year: '2023'
  }
];

export const categories = ['All', 'Landscapes', 'Abstract', 'Seascapes', 'Nature'];
