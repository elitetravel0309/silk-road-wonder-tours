// Central tour data  used by index.astro and tours.astro
// Edit this file to update prices, routes, and tour listings
export interface Tour {
  title: string;
  slug: string;
  duration: string;
  route: string;
  image: string;
  features?: string[];
  price?: string;
  originalPrice?: string;
}

export const featured: Tour[] = [
  { title: "Silk Road Group Tour: Xinjiang, Gansu, Qinghai", slug: "13d-silk-road-group", duration: "13 Days", route: "Kashgar → Urumqi → Turpan → Dunhuang → Jiayuguan → Zhangye → Xining → Chaka", image: "/assets/images/hero-silkroad.jpg", features: ["⭐ 4-Star Hotels", "🎓 English Guide", "🚂 Train Included"], price: "$2,070", originalPrice: "$2,280" },
  { title: "Xinjiang China & Uzbekistan Tour", slug: "19d-china-uzbekistan", duration: "19 Days", route: "Kashgar → Taxkorgan → Kuqa → Urumqi → Turpan → Tashkent → Bukhara → Samarkand", image: "/assets/images/central-asia-architecture.jpg", features: ["⭐ 4-Star Hotels", "🎓 English Guide"], price: "$4,390", originalPrice: "$4,890" },
  { title: "Xinjiang Group Tour to Kashgar & Kanas", slug: "11d-kashgar-kanas", duration: "11 Days", route: "Kashgar → Taxkorgan → Urumqi → Turpan → Beitun → Hemu → Kanas → Urho", image: "/assets/images/xinjiang-landscape.jpg", features: ["⭐ 4-Star Hotels", "🎓 English Guide", "✈ Flight Included"], price: "$1,780", originalPrice: "$1,970" },
  { title: "Silk Road Group Travel: Xinjiang, Gansu & Qinghai", slug: "10d-xinjiang-gansu-qinghai", duration: "10 Days", route: "Urumqi → Turpan → Dunhuang → Jiayuguan → Zhangye → Xining → Chaka", image: "/assets/images/hero-silkroad.jpg", features: ["⭐ 4-Star Hotels", "🎓 English Guide", "🚂 Train Included"], price: "$1,450", originalPrice: "$1,670" },
  { title: "Silk Road Wonders to Uzbekistan & China", slug: "16d-uzbekistan-china", duration: "16 Days", route: "Beijing → Xi'an → Lanzhou → Jiayuguan → Dunhuang → Turpan → Urumqi → Kashgar → Tashkent → Samarkand → Bukhara → Khiva", image: "/assets/images/central-asia-architecture.jpg", features: ["⭐ 4-Star Hotels", "🎓 English Guide", "✈ Flight Included"], price: "$4,780" },
  { title: "Silk Road Group Tour to Gansu & Qinghai", slug: "7d-gansu-qinghai", duration: "7 Days", route: "Dunhuang → Jiayuguan → Zhangye → Xining → Chaka", image: "/assets/images/desert-dunes.jpg", features: ["⭐ 4-Star Hotels", "🎓 English Guide"], price: "$980", originalPrice: "$1,080" },
];

export const popular: Tour[] = [
  { title: "Silk Road Xinjiang Tour", slug: "11d-silk-road-xinjiang", duration: "11 Days", route: "Kashgar → Urumqi → Turpan → Dunhuang → Xi'an", image: "/assets/images/xinjiang-landscape.jpg", price: "$2,599" },
  { title: "China Silk Road Train Tour", slug: "12d-silk-road-train", duration: "12 Days", route: "Urumqi → Turpan → Dunhuang → Jiayuguan → Zhangye → Xining → Lanzhou → Xi'an", image: "/assets/images/desert-dunes.jpg", price: "$2,967" },
  { title: "Great Silk Road: Kashgar to Tashkent", slug: "15d-kashgar-tashkent", duration: "15 Days", route: "Kashgar → Kuqa → Turpan → Urumqi → Uzbekistan", image: "/assets/images/hero-silkroad.jpg", price: "$3,738" },
  { title: "Lanzhou to Urumqi", slug: "8d-lanzhou-urumqi", duration: "8 Days", route: "Lanzhou → Zhangye → Jiayuguan → Dunhuang → Turpan → Urumqi", image: "/assets/images/desert-dunes.jpg", price: "$1,633" },
  { title: "Luxury Silk Road: Xi'an to Urumqi", slug: "9d-luxury-xian-urumqi", duration: "9 Days", route: "Xi'an → Dunhuang → Turpan → Urumqi", image: "/assets/images/hero-silkroad.jpg", price: "$1,750" },
  { title: "Kashgar to Bishkek Kyrgyzstan Tour", slug: "7d-kashgar-bishkek", duration: "7 Days", route: "Kashgar → Taxkorgan → Naryn → Bishkek", image: "/assets/images/xinjiang-landscape.jpg", price: "$1,680" },
  { title: "China to Kyrgyzstan Overland", slug: "11d-urumqi-bishkek", duration: "11 Days", route: "Urumqi → Kashgar → Tash Rabat → Kochkor → Issyk Kul → Bishkek", image: "/assets/images/xinjiang-landscape.jpg", price: "$1,909" },
  { title: "Silk Road: Kashgar to Xi'an", slug: "11d-kashgar-xian", duration: "11 Days", route: "Kashgar → Urumqi → Turpan → Dunhuang → Jiayuguan → Xi'an", image: "/assets/images/hero-silkroad.jpg", price: "$2,050" },
  { title: "Dunhuang to Kashgar", slug: "9d-dunhuang-kashgar", duration: "9 Days", route: "Dunhuang → Turpan → Urumqi → Kashgar", image: "/assets/images/desert-dunes.jpg", price: "$1,450" },
];

export const extend: Tour[] = [
  { title: "Beijing, Chengdu, Zhangjiajie &amp; Shanghai Tour", slug: "beijing-chengdu-zhangjiajie-shanghai", duration: "12 Days", route: "Classic China highlights", image: "/assets/images/great-wall.jpg" },
  { title: "Silk Road &amp; Northern Xinjiang", slug: "silk-road-northern-xinjiang", duration: "18 Days", route: "Combine the ancient route with Kanas and Altay", image: "/assets/images/central-asia-architecture.jpg" },
  { title: "Silk Road &amp; Tibet Adventure", slug: "silk-road-tibet-adventure", duration: "15 Days", route: "Ancient trade routes meet the roof of the world", image: "/assets/tibet-banner.jpg" },
  { title: "Uzbekistan to Pakistan via Karakoram Highway", slug: "uzbekistan-pakistan-karakoram", duration: "23 Days", route: "The world's highest paved road", image: "/assets/images/central-asia-architecture.jpg" },
  { title: "Uzbekistan, Kyrgyzstan &amp; China", slug: "uzbekistan-kyrgyzstan-china", duration: "20 Days", route: "Three countries, three cultures", image: "/assets/images/central-asia-architecture.jpg" },
  { title: "Silk Road &amp; Yunnan Tour", slug: "silk-road-yunnan", duration: "16 Days", route: "Desert landscapes meet the lush south", image: "/assets/images/hero-mountains.jpg" },
];

export const all: Tour[] = [...featured, ...popular, ...extend];
