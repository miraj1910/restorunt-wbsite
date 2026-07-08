import type {
  AdminMenuItem,
  AdminEmployee,
  AdminCustomer,
  AdminReservation,
  AdminOrder,
  AdminInventoryItem,
  AdminReview,
  RevenueData,
  RestaurantSettings,
  Notification,
  KPITrend,
  DashboardStats,
  TableStatus,
} from './types'

const today = new Date()
const currentYear = today.getFullYear()
const currentMonth = today.getMonth()
const currentDate = today.getDate()

function daysAgo(n: number): string {
  const d = new Date(today)
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

function daysFromNow(n: number): string {
  const d = new Date(today)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function monthsAgo(n: number): string {
  const d = new Date(today)
  d.setMonth(d.getMonth() - n)
  return d.toISOString().split('T')[0]
}

function hoursAgo(n: number): string {
  const d = new Date(today)
  d.setHours(d.getHours() - n)
  return d.toISOString()
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

export const menuItems: AdminMenuItem[] = [
  { id: 'm1', name: 'Bruschetta al Pomodoro', description: 'Toasted ciabatta with vine-ripened tomatoes, fresh basil, garlic, and extra virgin olive oil', category: 'starters', price: 10, discount: 0, available: true, prepTime: 8, calories: 220, featured: false, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm2', name: 'Calamari Fritti', description: 'Crispy fried squid rings served with marinara sauce and lemon aioli', category: 'starters', price: 12, discount: 0, available: true, prepTime: 10, calories: 380, featured: true, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm3', name: 'Carpaccio di Manzo', description: 'Thinly sliced prime beef tenderloin with arugula, shaved parmesan, and truffle oil', category: 'starters', price: 16, discount: 0, available: true, prepTime: 12, calories: 290, featured: false, hidden: false, createdAt: monthsAgo(5) },
  { id: 'm4', name: 'Zuppa del Giorno', description: 'Chef\'s daily soup made with fresh seasonal ingredients', category: 'starters', price: 9, discount: 0, available: true, prepTime: 5, calories: 180, featured: false, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm5', name: 'Insalata Cesare', description: 'Crisp romaine lettuce, house-made croutons, shaved parmesan with classic Caesar dressing', category: 'starters', price: 11, discount: 0, available: true, prepTime: 7, calories: 310, featured: false, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm6', name: 'Pollo alla Milanese', description: 'Breaded chicken cutlet served with arugula, cherry tomatoes, and lemon butter sauce', category: 'main-course', price: 22, discount: 0, available: true, prepTime: 20, calories: 620, featured: false, hidden: false, createdAt: monthsAgo(4) },
  { id: 'm7', name: 'Salmone al Limone', description: 'Pan-seared Atlantic salmon with lemon caper butter sauce and roasted asparagus', category: 'main-course', price: 28, discount: 0, available: true, prepTime: 18, calories: 480, featured: true, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm8', name: 'Filetto di Manzo', description: '8oz certified angus beef filet mignon with truffle mashed potatoes and demi-glace', category: 'main-course', price: 38, discount: 0, available: true, prepTime: 25, calories: 710, featured: true, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm9', name: 'Branzino al Forno', description: 'Whole roasted Mediterranean sea bass with herbs, lemon, and roasted vegetables', category: 'main-course', price: 32, discount: 0, available: true, prepTime: 22, calories: 390, featured: false, hidden: false, createdAt: monthsAgo(3) },
  { id: 'm10', name: 'Costolette d\'Agnello', description: 'Herb-crusted New Zealand lamb rack with rosemary jus and garlic roasted potatoes', category: 'main-course', price: 42, discount: 0, available: true, prepTime: 28, calories: 680, featured: false, hidden: false, createdAt: monthsAgo(5) },
  { id: 'm11', name: 'Margherita', description: 'San Marzano tomato sauce, fresh mozzarella, basil, and extra virgin olive oil on a thin Neapolitan crust', category: 'pizza', price: 14, discount: 0, available: true, prepTime: 15, calories: 720, featured: false, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm12', name: 'Diavola', description: 'Spicy salami, San Marzano tomatoes, mozzarella, chili flakes, and oregano', category: 'pizza', price: 16, discount: 0, available: true, prepTime: 16, calories: 810, featured: false, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm13', name: 'Quattro Formaggi', description: 'Mozzarella, gorgonzola, fontina, and parmesan on a crispy thin crust with honey drizzle', category: 'pizza', price: 17, discount: 0, available: true, prepTime: 16, calories: 890, featured: false, hidden: false, createdAt: monthsAgo(5) },
  { id: 'm14', name: 'Prosciutto e Funghi', description: 'Prosciutto di Parma, wild mushrooms, mozzarella, truffle oil, and arugula', category: 'pizza', price: 18, discount: 0, available: true, prepTime: 17, calories: 780, featured: true, hidden: false, createdAt: monthsAgo(4) },
  { id: 'm15', name: 'Spaghetti Carbonara', description: 'Guanciale, egg yolk, pecorino romano, and black pepper served al dente', category: 'pasta', price: 18, discount: 0, available: true, prepTime: 14, calories: 640, featured: false, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm16', name: 'Penne all\'Arrabbiata', description: 'Penne in a spicy tomato sauce with garlic, chili, and fresh parsley', category: 'pasta', price: 16, discount: 0, available: true, prepTime: 13, calories: 520, featured: false, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm17', name: 'Lasagna Classica', description: 'House-made pasta layered with bolognese, béchamel, and melted mozzarella', category: 'pasta', price: 20, discount: 0, available: true, prepTime: 22, calories: 780, featured: true, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm18', name: 'Risotto ai Funghi', description: 'Arborio rice with wild mushrooms, parmesan, white wine, and truffle oil', category: 'pasta', price: 22, discount: 0, available: true, prepTime: 20, calories: 560, featured: false, hidden: false, createdAt: monthsAgo(5) },
  { id: 'm19', name: 'Bistro Aurelia Burger', description: 'Wagyu beef patty, aged cheddar, caramelized onions, and truffle aioli on a brioche bun with hand-cut fries', category: 'burgers', price: 18, discount: 0, available: true, prepTime: 15, calories: 920, featured: true, hidden: false, createdAt: monthsAgo(4) },
  { id: 'm20', name: 'Double Cheeseburger', description: 'Two angus beef patties, American cheese, pickles, lettuce, tomato, and house sauce', category: 'burgers', price: 20, discount: 0, available: true, prepTime: 14, calories: 1080, featured: false, hidden: false, createdAt: monthsAgo(4) },
  { id: 'm21', name: 'Mushroom Swiss Burger', description: 'Beef patty topped with sautéed wild mushrooms, swiss cheese, and garlic aioli', category: 'burgers', price: 19, discount: 0, available: true, prepTime: 15, calories: 940, featured: false, hidden: false, createdAt: monthsAgo(3) },
  { id: 'm22', name: 'Tiramisù', description: 'Classic Italian dessert with espresso-soaked ladyfingers, mascarpone cream, and cocoa', category: 'desserts', price: 10, discount: 0, available: true, prepTime: 5, calories: 410, featured: true, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm23', name: 'Panna Cotta', description: 'Vanilla bean panna cotta with mixed berry compote and fresh mint', category: 'desserts', price: 9, discount: 0, available: true, prepTime: 4, calories: 340, featured: false, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm24', name: 'Gelato Misto', description: 'Selection of three house-made gelato flavors: vanilla, chocolate, and pistachio', category: 'desserts', price: 8, discount: 0, available: true, prepTime: 3, calories: 290, featured: false, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm25', name: 'Acqua Minerale', description: 'Sparkling or still mineral water, 750ml', category: 'drinks', price: 4, discount: 0, available: true, prepTime: 1, calories: 0, featured: false, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm26', name: 'Coca Cola', description: 'Ice-cold Coca Cola served with lemon', category: 'drinks', price: 3, discount: 0, available: true, prepTime: 1, calories: 140, featured: false, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm27', name: 'Succo d\'Arancia', description: 'Freshly squeezed orange juice', category: 'drinks', price: 5, discount: 0, available: true, prepTime: 2, calories: 120, featured: false, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm28', name: 'Espresso', description: 'Double shot of our signature Italian roast espresso', category: 'coffee', price: 3, discount: 0, available: true, prepTime: 2, calories: 5, featured: false, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm29', name: 'Cappuccino', description: 'Espresso with steamed milk foam and a dusting of cocoa', category: 'coffee', price: 5, discount: 0, available: true, prepTime: 4, calories: 120, featured: false, hidden: false, createdAt: monthsAgo(6) },
  { id: 'm30', name: 'Chef\'s Tasting Menu', description: 'Seven-course tasting menu featuring the chef\'s seasonal selections with wine pairings', category: 'specials', price: 65, discount: 0, available: true, prepTime: 60, calories: 1400, featured: true, hidden: false, createdAt: monthsAgo(2) },
  { id: 'm31', name: 'Lobster Linguine', description: 'Fresh Maine lobster tossed with linguine in a saffron cream sauce', category: 'specials', price: 38, discount: 0, available: true, prepTime: 24, calories: 620, featured: false, hidden: false, createdAt: monthsAgo(1) },
  { id: 'm32', name: 'Osso Buco', description: 'Braised veal shank with gremolata, saffron risotto, and roasted vegetables', category: 'specials', price: 45, discount: 0, available: true, prepTime: 30, calories: 740, featured: false, hidden: false, createdAt: monthsAgo(1) },
]

export const employees: AdminEmployee[] = [
  { id: 'e1', name: 'James Wilson', role: 'manager', email: 'james.wilson@bistroaurelia.com', phone: '(212) 555-0142', shift: 'morning', salary: 72000, status: 'active', joinedAt: monthsAgo(24), workingHours: 45, performance: 95 },
  { id: 'e2', name: 'Isabella Martinez', role: 'chef', email: 'isabella.martinez@bistroaurelia.com', phone: '(212) 555-0187', shift: 'evening', salary: 65000, status: 'active', joinedAt: monthsAgo(18), workingHours: 42, performance: 92 },
  { id: 'e3', name: 'Marcus Johnson', role: 'chef', email: 'marcus.johnson@bistroaurelia.com', phone: '(212) 555-0231', shift: 'evening', salary: 58000, status: 'active', joinedAt: monthsAgo(14), workingHours: 40, performance: 88 },
  { id: 'e4', name: 'Sophia Chen', role: 'waiter', email: 'sophia.chen@bistroaurelia.com', phone: '(212) 555-0345', shift: 'evening', salary: 35000, status: 'active', joinedAt: monthsAgo(10), workingHours: 36, performance: 90 },
  { id: 'e5', name: 'David Thompson', role: 'waiter', email: 'david.thompson@bistroaurelia.com', phone: '(212) 555-0456', shift: 'evening', salary: 35000, status: 'active', joinedAt: monthsAgo(8), workingHours: 35, performance: 85 },
  { id: 'e6', name: 'Olivia Davis', role: 'waiter', email: 'olivia.davis@bistroaurelia.com', phone: '(212) 555-0567', shift: 'morning', salary: 32000, status: 'active', joinedAt: monthsAgo(6), workingHours: 34, performance: 82 },
  { id: 'e7', name: 'Ethan Brown', role: 'waiter', email: 'ethan.brown@bistroaurelia.com', phone: '(212) 555-0678', shift: 'evening', salary: 35000, status: 'active', joinedAt: monthsAgo(12), workingHours: 38, performance: 87 },
  { id: 'e8', name: 'Emily Rodriguez', role: 'receptionist', email: 'emily.rodriguez@bistroaurelia.com', phone: '(212) 555-0789', shift: 'evening', salary: 38000, status: 'active', joinedAt: monthsAgo(16), workingHours: 38, performance: 93 },
  { id: 'e9', name: 'Michael Kim', role: 'waiter', email: 'michael.kim@bistroaurelia.com', phone: '(212) 555-0890', shift: 'morning', salary: 32000, status: 'active', joinedAt: monthsAgo(5), workingHours: 32, performance: 78 },
  { id: 'e10', name: 'Charlotte Lee', role: 'cashier', email: 'charlotte.lee@bistroaurelia.com', phone: '(212) 555-0901', shift: 'evening', salary: 34000, status: 'active', joinedAt: monthsAgo(9), workingHours: 36, performance: 91 },
  { id: 'e11', name: 'William Taylor', role: 'chef', email: 'william.taylor@bistroaurelia.com', phone: '(212) 555-1012', shift: 'morning', salary: 52000, status: 'vacation', joinedAt: monthsAgo(20), workingHours: 38, performance: 86 },
  { id: 'e12', name: 'Amelia Anderson', role: 'cleaner', email: 'amelia.anderson@bistroaurelia.com', phone: '(212) 555-1123', shift: 'morning', salary: 28000, status: 'active', joinedAt: monthsAgo(7), workingHours: 28, performance: 94 },
  { id: 'e13', name: 'Benjamin White', role: 'waiter', email: 'benjamin.white@bistroaurelia.com', phone: '(212) 555-1234', shift: 'evening', salary: 35000, status: 'active', joinedAt: monthsAgo(11), workingHours: 37, performance: 84 },
  { id: 'e14', name: 'Harper Jackson', role: 'receptionist', email: 'harper.jackson@bistroaurelia.com', phone: '(212) 555-1345', shift: 'morning', salary: 36000, status: 'sick', joinedAt: monthsAgo(4), workingHours: 30, performance: 79 },
  { id: 'e15', name: 'Lucas Garcia', role: 'waiter', email: 'lucas.garcia@bistroaurelia.com', phone: '(212) 555-1456', shift: 'evening', salary: 35000, status: 'active', joinedAt: monthsAgo(3), workingHours: 33, performance: 81 },
]

export const customers: AdminCustomer[] = [
  { id: 'c1', name: 'Sarah Mitchell', email: 'sarah.mitchell@gmail.com', phone: '(917) 555-2014', totalReservations: 8, totalOrders: 12, totalSpent: 2150, loyaltyPoints: 430, joinedAt: monthsAgo(14), notes: 'Prefers window table, allergic to nuts', lastVisit: daysAgo(3) },
  { id: 'c2', name: 'Robert Anderson', email: 'robert.anderson@outlook.com', phone: '(646) 555-3025', totalReservations: 5, totalOrders: 8, totalSpent: 1480, loyaltyPoints: 296, joinedAt: monthsAgo(10), notes: 'Regular Friday dinner, loves wine pairings', lastVisit: daysAgo(7) },
  { id: 'c3', name: 'Jennifer Williams', email: 'jennifer.williams@yahoo.com', phone: '(347) 555-4036', totalReservations: 12, totalOrders: 18, totalSpent: 3240, loyaltyPoints: 648, joinedAt: monthsAgo(20), notes: 'Celebrates birthdays here, brings large groups', lastVisit: daysAgo(1) },
  { id: 'c4', name: 'Christopher Brown', email: 'chris.brown@gmail.com', phone: '(212) 555-5047', totalReservations: 3, totalOrders: 5, totalSpent: 680, loyaltyPoints: 136, joinedAt: monthsAgo(6), notes: 'Quiet diner, usually alone', lastVisit: daysAgo(14) },
  { id: 'c5', name: 'Amanda Davis', email: 'amanda.davis@icloud.com', phone: '(917) 555-6058', totalReservations: 6, totalOrders: 9, totalSpent: 1560, loyaltyPoints: 312, joinedAt: monthsAgo(12), notes: 'Gluten-free diet, always orders branzino', lastVisit: daysAgo(5) },
  { id: 'c6', name: 'Kevin Wilson', email: 'kevin.wilson@gmail.com', phone: '(646) 555-7069', totalReservations: 4, totalOrders: 6, totalSpent: 890, loyaltyPoints: 178, joinedAt: monthsAgo(8), notes: 'Loves the burger, brings kids sometimes', lastVisit: daysAgo(21) },
  { id: 'c7', name: 'Michelle Garcia', email: 'michelle.garcia@outlook.com', phone: '(347) 555-8070', totalReservations: 9, totalOrders: 14, totalSpent: 2780, loyaltyPoints: 556, joinedAt: monthsAgo(16), notes: 'Wine club member, prefers booth seating', lastVisit: daysAgo(2) },
  { id: 'c8', name: 'Ryan Martinez', email: 'ryan.martinez@gmail.com', phone: '(212) 555-9081', totalReservations: 2, totalOrders: 4, totalSpent: 520, loyaltyPoints: 104, joinedAt: monthsAgo(4), notes: 'New regular, tends to order pasta', lastVisit: daysAgo(10) },
  { id: 'c9', name: 'Lauren Thompson', email: 'lauren.thompson@yahoo.com', phone: '(917) 555-0092', totalReservations: 7, totalOrders: 11, totalSpent: 1940, loyaltyPoints: 388, joinedAt: monthsAgo(18), notes: 'Vegetarian, requests chef\'s special modifications', lastVisit: daysAgo(6) },
  { id: 'c10', name: 'Jason Robinson', email: 'jason.robinson@gmail.com', phone: '(646) 555-1103', totalReservations: 1, totalOrders: 2, totalSpent: 310, loyaltyPoints: 62, joinedAt: monthsAgo(2), notes: 'First time visitor turned regular', lastVisit: daysAgo(12) },
  { id: 'c11', name: 'Nicole White', email: 'nicole.white@icloud.com', phone: '(347) 555-2214', totalReservations: 10, totalOrders: 16, totalSpent: 3100, loyaltyPoints: 620, joinedAt: monthsAgo(22), notes: 'VIP customer, owns local boutique, refers often', lastVisit: daysAgo(0) },
  { id: 'c12', name: 'Daniel Harris', email: 'daniel.harris@outlook.com', phone: '(212) 555-3325', totalReservations: 4, totalOrders: 7, totalSpent: 1250, loyaltyPoints: 250, joinedAt: monthsAgo(9), notes: 'Business dinners, prefers private corner', lastVisit: daysAgo(18) },
  { id: 'c13', name: 'Stephanie Clark', email: 'stephanie.clark@gmail.com', phone: '(917) 555-4436', totalReservations: 6, totalOrders: 10, totalSpent: 1720, loyaltyPoints: 344, joinedAt: monthsAgo(11), notes: 'Birthday dinner regular, likes tiramisu', lastVisit: daysAgo(8) },
  { id: 'c14', name: 'Andrew Lewis', email: 'andrew.lewis@yahoo.com', phone: '(646) 555-5547', totalReservations: 3, totalOrders: 5, totalSpent: 760, loyaltyPoints: 152, joinedAt: monthsAgo(7), notes: 'Occasional diner, always orders steak', lastVisit: daysAgo(25) },
  { id: 'c15', name: 'Rebecca Walker', email: 'rebecca.walker@gmail.com', phone: '(347) 555-6658', totalReservations: 11, totalOrders: 17, totalSpent: 2890, loyaltyPoints: 578, joinedAt: monthsAgo(19), notes: 'Loves our Sunday brunch, brings family', lastVisit: daysAgo(4) },
  { id: 'c16', name: 'Matthew Hall', email: 'matthew.hall@icloud.com', phone: '(212) 555-7769', totalReservations: 2, totalOrders: 3, totalSpent: 430, loyaltyPoints: 86, joinedAt: monthsAgo(3), notes: 'Recently moved to neighborhood', lastVisit: daysAgo(16) },
  { id: 'c17', name: 'Kimberly Allen', email: 'kimberly.allen@outlook.com', phone: '(917) 555-8870', totalReservations: 8, totalOrders: 13, totalSpent: 2340, loyaltyPoints: 468, joinedAt: monthsAgo(15), notes: 'Food blogger, always photographs dishes', lastVisit: daysAgo(9) },
  { id: 'c18', name: 'Justin Young', email: 'justin.young@gmail.com', phone: '(646) 555-9981', totalReservations: 5, totalOrders: 8, totalSpent: 1130, loyaltyPoints: 226, joinedAt: monthsAgo(13), notes: 'Date night regular, requests romantic table', lastVisit: daysAgo(11) },
  { id: 'c19', name: 'Vanessa King', email: 'vanessa.king@yahoo.com', phone: '(347) 555-0091', totalReservations: 4, totalOrders: 6, totalSpent: 980, loyaltyPoints: 196, joinedAt: monthsAgo(5), notes: 'Loves our pizza, orders Diavola every time', lastVisit: daysAgo(20) },
  { id: 'c20', name: 'Brandon Wright', email: 'brandon.wright@gmail.com', phone: '(212) 555-1102', totalReservations: 7, totalOrders: 11, totalSpent: 2050, loyaltyPoints: 410, joinedAt: monthsAgo(17), notes: 'Regular lunch customer, works nearby', lastVisit: daysAgo(13) },
]

export const reservations: AdminReservation[] = [
  { id: 'r1', customerName: 'Sarah Mitchell', phone: '(917) 555-2014', email: 'sarah.mitchell@gmail.com', date: daysAgo(28), time: '19:00', guests: 4, tableNumber: 7, status: 'completed', specialRequests: 'Nut allergy, please ensure no nuts in any dish', createdAt: daysAgo(30) },
  { id: 'r2', customerName: 'Robert Anderson', phone: '(646) 555-3025', email: 'robert.anderson@outlook.com', date: daysAgo(27), time: '20:00', guests: 2, tableNumber: 3, status: 'completed', createdAt: daysAgo(29) },
  { id: 'r3', customerName: 'Jennifer Williams', phone: '(347) 555-4036', email: 'jennifer.williams@yahoo.com', date: daysAgo(26), time: '18:30', guests: 8, tableNumber: 12, status: 'completed', specialRequests: 'Birthday celebration, need room for cake', createdAt: daysAgo(28) },
  { id: 'r4', customerName: 'Amanda Davis', phone: '(917) 555-6058', email: 'amanda.davis@icloud.com', date: daysAgo(25), time: '19:30', guests: 3, tableNumber: 5, status: 'completed', createdAt: daysAgo(27) },
  { id: 'r5', customerName: 'Kevin Wilson', phone: '(646) 555-7069', email: 'kevin.wilson@gmail.com', date: daysAgo(24), time: '18:00', guests: 2, tableNumber: 9, status: 'cancelled', createdAt: daysAgo(26) },
  { id: 'r6', customerName: 'Michelle Garcia', phone: '(347) 555-8070', email: 'michelle.garcia@outlook.com', date: daysAgo(23), time: '20:30', guests: 5, tableNumber: 14, status: 'completed', createdAt: daysAgo(25) },
  { id: 'r7', customerName: 'Lauren Thompson', phone: '(917) 555-0092', email: 'lauren.thompson@yahoo.com', date: daysAgo(22), time: '19:00', guests: 2, tableNumber: 2, status: 'completed', createdAt: daysAgo(24) },
  { id: 'r8', customerName: 'Nicole White', phone: '(347) 555-2214', email: 'nicole.white@icloud.com', date: daysAgo(21), time: '20:00', guests: 6, tableNumber: 11, status: 'completed', createdAt: daysAgo(23) },
  { id: 'r9', customerName: 'Christopher Brown', phone: '(212) 555-5047', email: 'chris.brown@gmail.com', date: daysAgo(20), time: '18:30', guests: 1, tableNumber: 1, status: 'no-show', createdAt: daysAgo(22) },
  { id: 'r10', customerName: 'Stephanie Clark', phone: '(917) 555-4436', email: 'stephanie.clark@gmail.com', date: daysAgo(19), time: '19:30', guests: 4, tableNumber: 8, status: 'completed', createdAt: daysAgo(21) },
  { id: 'r11', customerName: 'Rebecca Walker', phone: '(347) 555-6658', email: 'rebecca.walker@gmail.com', date: daysAgo(18), time: '21:00', guests: 3, tableNumber: 6, status: 'completed', createdAt: daysAgo(20) },
  { id: 'r12', customerName: 'Vanessa King', phone: '(347) 555-0091', email: 'vanessa.king@yahoo.com', date: daysAgo(17), time: '19:00', guests: 2, tableNumber: 4, status: 'completed', createdAt: daysAgo(19) },
  { id: 'r13', customerName: 'Brandon Wright', phone: '(212) 555-1102', email: 'brandon.wright@gmail.com', date: daysAgo(16), time: '20:00', guests: 4, tableNumber: 10, status: 'cancelled', createdAt: daysAgo(18) },
  { id: 'r14', customerName: 'Ryan Martinez', phone: '(212) 555-9081', email: 'ryan.martinez@gmail.com', date: daysAgo(15), time: '18:30', guests: 2, tableNumber: 3, status: 'completed', createdAt: daysAgo(17) },
  { id: 'r15', customerName: 'Daniel Harris', phone: '(212) 555-3325', email: 'daniel.harris@outlook.com', date: daysAgo(14), time: '20:30', guests: 6, tableNumber: 15, status: 'completed', createdAt: daysAgo(16) },
  { id: 'r16', customerName: 'Andrew Lewis', phone: '(646) 555-5547', email: 'andrew.lewis@yahoo.com', date: daysAgo(13), time: '19:00', guests: 3, tableNumber: 7, status: 'completed', createdAt: daysAgo(15) },
  { id: 'r17', customerName: 'Kimberly Allen', phone: '(917) 555-8870', email: 'kimberly.allen@outlook.com', date: daysAgo(12), time: '18:00', guests: 2, tableNumber: 5, status: 'completed', createdAt: daysAgo(14) },
  { id: 'r18', customerName: 'Justin Young', phone: '(646) 555-9981', email: 'justin.young@gmail.com', date: daysAgo(11), time: '20:00', guests: 2, tableNumber: 1, status: 'completed', createdAt: daysAgo(13) },
  { id: 'r19', customerName: 'Matthew Hall', phone: '(212) 555-7769', email: 'matthew.hall@icloud.com', date: daysAgo(10), time: '19:30', guests: 4, tableNumber: 9, status: 'completed', createdAt: daysAgo(12) },
  { id: 'r20', customerName: 'Jason Robinson', phone: '(646) 555-1103', email: 'jason.robinson@gmail.com', date: daysAgo(9), time: '21:00', guests: 2, tableNumber: 14, status: 'completed', createdAt: daysAgo(11) },
  { id: 'r21', customerName: 'Sarah Mitchell', phone: '(917) 555-2014', email: 'sarah.mitchell@gmail.com', date: daysAgo(8), time: '19:00', guests: 4, tableNumber: 7, status: 'completed', createdAt: daysAgo(10) },
  { id: 'r22', customerName: 'Michelle Garcia', phone: '(347) 555-8070', email: 'michelle.garcia@outlook.com', date: daysAgo(7), time: '20:00', guests: 3, tableNumber: 6, status: 'completed', createdAt: daysAgo(9) },
  { id: 'r23', customerName: 'Nicole White', phone: '(347) 555-2214', email: 'nicole.white@icloud.com', date: daysAgo(6), time: '18:30', guests: 4, tableNumber: 12, status: 'completed', createdAt: daysAgo(8) },
  { id: 'r24', customerName: 'Rebecca Walker', phone: '(347) 555-6658', email: 'rebecca.walker@gmail.com', date: daysAgo(5), time: '19:30', guests: 5, tableNumber: 11, status: 'completed', createdAt: daysAgo(7) },
  { id: 'r25', customerName: 'Brandon Wright', phone: '(212) 555-1102', email: 'brandon.wright@gmail.com', date: daysAgo(4), time: '20:00', guests: 2, tableNumber: 3, status: 'completed', createdAt: daysAgo(6) },
  { id: 'r26', customerName: 'Jennifer Williams', phone: '(347) 555-4036', email: 'jennifer.williams@yahoo.com', date: daysAgo(3), time: '19:00', guests: 6, tableNumber: 15, status: 'completed', createdAt: daysAgo(5) },
  { id: 'r27', customerName: 'Lauren Thompson', phone: '(917) 555-0092', email: 'lauren.thompson@yahoo.com', date: daysAgo(2), time: '18:30', guests: 2, tableNumber: 2, status: 'completed', createdAt: daysAgo(4) },
  { id: 'r28', customerName: 'Stephanie Clark', phone: '(917) 555-4436', email: 'stephanie.clark@gmail.com', date: daysAgo(1), time: '20:30', guests: 4, tableNumber: 8, status: 'completed', createdAt: daysAgo(3) },
  { id: 'r29', customerName: 'Amanda Davis', phone: '(917) 555-6058', email: 'amanda.davis@icloud.com', date: daysAgo(0), time: '19:00', guests: 3, tableNumber: 5, status: 'confirmed', createdAt: daysAgo(2) },
  { id: 'r30', customerName: 'Robert Anderson', phone: '(646) 555-3025', email: 'robert.anderson@outlook.com', date: daysAgo(0), time: '20:00', guests: 2, tableNumber: 4, status: 'confirmed', createdAt: daysAgo(1) },
  { id: 'r31', customerName: 'Kevin Wilson', phone: '(646) 555-7069', email: 'kevin.wilson@gmail.com', date: daysFromNow(1), time: '18:00', guests: 4, tableNumber: 7, status: 'confirmed', createdAt: daysAgo(1) },
  { id: 'r32', customerName: 'Vanessa King', phone: '(347) 555-0091', email: 'vanessa.king@yahoo.com', date: daysFromNow(1), time: '19:30', guests: 2, tableNumber: 1, status: 'confirmed', createdAt: daysAgo(1) },
  { id: 'r33', customerName: 'Daniel Harris', phone: '(212) 555-3325', email: 'daniel.harris@outlook.com', date: daysFromNow(1), time: '20:30', guests: 6, tableNumber: 14, status: 'pending', createdAt: hoursAgo(3) },
  { id: 'r34', customerName: 'Kimberly Allen', phone: '(917) 555-8870', email: 'kimberly.allen@outlook.com', date: daysFromNow(2), time: '19:00', guests: 3, tableNumber: 6, status: 'confirmed', createdAt: daysAgo(1) },
  { id: 'r35', customerName: 'Christopher Brown', phone: '(212) 555-5047', email: 'chris.brown@gmail.com', date: daysFromNow(2), time: '18:30', guests: 1, tableNumber: 2, status: 'pending', createdAt: hoursAgo(5) },
  { id: 'r36', customerName: 'Justin Young', phone: '(646) 555-9981', email: 'justin.young@gmail.com', date: daysFromNow(2), time: '21:00', guests: 2, tableNumber: 9, status: 'confirmed', createdAt: daysAgo(2) },
  { id: 'r37', customerName: 'Nicole White', phone: '(347) 555-2214', email: 'nicole.white@icloud.com', date: daysFromNow(3), time: '19:30', guests: 8, tableNumber: 12, status: 'confirmed', createdAt: daysAgo(2) },
  { id: 'r38', customerName: 'Sarah Mitchell', phone: '(917) 555-2014', email: 'sarah.mitchell@gmail.com', date: daysFromNow(3), time: '20:00', guests: 4, tableNumber: 7, status: 'confirmed', createdAt: daysAgo(1) },
  { id: 'r39', customerName: 'Rebecca Walker', phone: '(347) 555-6658', email: 'rebecca.walker@gmail.com', date: daysFromNow(3), time: '18:00', guests: 5, tableNumber: 15, status: 'pending', createdAt: hoursAgo(8) },
  { id: 'r40', customerName: 'Andrew Lewis', phone: '(646) 555-5547', email: 'andrew.lewis@yahoo.com', date: daysFromNow(4), time: '19:00', guests: 3, tableNumber: 5, status: 'confirmed', createdAt: daysAgo(2) },
  { id: 'r41', customerName: 'Jennifer Williams', phone: '(347) 555-4036', email: 'jennifer.williams@yahoo.com', date: daysFromNow(4), time: '20:30', guests: 6, tableNumber: 11, status: 'confirmed', createdAt: daysAgo(3) },
  { id: 'r42', customerName: 'Brandon Wright', phone: '(212) 555-1102', email: 'brandon.wright@gmail.com', date: daysFromNow(5), time: '19:00', guests: 4, tableNumber: 8, status: 'pending', createdAt: hoursAgo(12) },
  { id: 'r43', customerName: 'Michelle Garcia', phone: '(347) 555-8070', email: 'michelle.garcia@outlook.com', date: daysFromNow(5), time: '20:00', guests: 2, tableNumber: 3, status: 'confirmed', createdAt: daysAgo(3) },
  { id: 'r44', customerName: 'Lauren Thompson', phone: '(917) 555-0092', email: 'lauren.thompson@yahoo.com', date: daysFromNow(5), time: '18:30', guests: 2, tableNumber: 4, status: 'confirmed', createdAt: daysAgo(4) },
  { id: 'r45', customerName: 'Ryan Martinez', phone: '(212) 555-9081', email: 'ryan.martinez@gmail.com', date: daysFromNow(6), time: '19:30', guests: 2, tableNumber: 1, status: 'pending', createdAt: hoursAgo(6) },
  { id: 'r46', customerName: 'Matthew Hall', phone: '(212) 555-7769', email: 'matthew.hall@icloud.com', date: daysFromNow(6), time: '21:00', guests: 4, tableNumber: 10, status: 'confirmed', createdAt: daysAgo(3) },
  { id: 'r47', customerName: 'Stephanie Clark', phone: '(917) 555-4436', email: 'stephanie.clark@gmail.com', date: daysFromNow(7), time: '19:00', guests: 4, tableNumber: 9, status: 'confirmed', createdAt: daysAgo(3) },
  { id: 'r48', customerName: 'Amanda Davis', phone: '(917) 555-6058', email: 'amanda.davis@icloud.com', date: daysFromNow(7), time: '20:00', guests: 3, tableNumber: 6, status: 'pending', createdAt: hoursAgo(10) },
  { id: 'r49', customerName: 'Jason Robinson', phone: '(646) 555-1103', email: 'jason.robinson@gmail.com', date: daysFromNow(8), time: '18:30', guests: 2, tableNumber: 2, status: 'confirmed', createdAt: daysAgo(5) },
  { id: 'r50', customerName: 'Vanessa King', phone: '(347) 555-0091', email: 'vanessa.king@yahoo.com', date: daysFromNow(8), time: '20:30', guests: 2, tableNumber: 5, status: 'confirmed', createdAt: daysAgo(4) },
  { id: 'r51', customerName: 'Justin Young', phone: '(646) 555-9981', email: 'justin.young@gmail.com', date: daysFromNow(10), time: '19:00', guests: 2, tableNumber: 3, status: 'pending', createdAt: hoursAgo(24) },
  { id: 'r52', customerName: 'Kimberly Allen', phone: '(917) 555-8870', email: 'kimberly.allen@outlook.com', date: daysFromNow(12), time: '20:00', guests: 4, tableNumber: 14, status: 'pending', createdAt: daysAgo(1) },
  { id: 'r53', customerName: 'Sarah Mitchell', phone: '(917) 555-2014', email: 'sarah.mitchell@gmail.com', date: daysFromNow(14), time: '19:30', guests: 4, tableNumber: 7, status: 'confirmed', createdAt: daysAgo(7) },
  { id: 'r54', customerName: 'Nicole White', phone: '(347) 555-2214', email: 'nicole.white@icloud.com', date: daysFromNow(16), time: '18:00', guests: 6, tableNumber: 15, status: 'pending', createdAt: daysAgo(2) },
  { id: 'r55', customerName: 'Daniel Harris', phone: '(212) 555-3325', email: 'daniel.harris@outlook.com', date: daysFromNow(21), time: '20:00', guests: 4, tableNumber: 11, status: 'confirmed', createdAt: daysAgo(10) },
]

export const orders: AdminOrder[] = [
  { id: 'o1', customerName: 'Sarah Mitchell', tableNumber: 7, items: [{ name: 'Calamari Fritti', qty: 1, price: 12 }, { name: 'Filetto di Manzo', qty: 1, price: 38 }, { name: 'Tiramisù', qty: 1, price: 10 }, { name: 'Acqua Minerale', qty: 1, price: 4 }, { name: 'Cappuccino', qty: 1, price: 5 }], total: 69, paymentStatus: 'paid', status: 'completed', waiterName: 'Sophia Chen', createdAt: daysAgo(28), completedAt: daysAgo(28) },
  { id: 'o2', customerName: 'Robert Anderson', tableNumber: 3, items: [{ name: 'Bruschetta al Pomodoro', qty: 1, price: 10 }, { name: 'Spaghetti Carbonara', qty: 2, price: 18 }, { name: 'Panna Cotta', qty: 1, price: 9 }, { name: 'Espresso', qty: 2, price: 3 }], total: 58, paymentStatus: 'paid', status: 'completed', waiterName: 'David Thompson', createdAt: daysAgo(27), completedAt: daysAgo(27) },
  { id: 'o3', customerName: 'Jennifer Williams', tableNumber: 12, items: [{ name: 'Carpaccio di Manzo', qty: 2, price: 16 }, { name: 'Pollo alla Milanese', qty: 3, price: 22 }, { name: 'Margherita', qty: 2, price: 14 }, { name: 'Tiramisù', qty: 3, price: 10 }, { name: 'Coca Cola', qty: 4, price: 3 }, { name: 'Succo d\'Arancia', qty: 2, price: 5 }], total: 176, paymentStatus: 'paid', status: 'completed', waiterName: 'Ethan Brown', createdAt: daysAgo(26), completedAt: daysAgo(26) },
  { id: 'o4', customerName: 'Amanda Davis', tableNumber: 5, items: [{ name: 'Insalata Cesare', qty: 1, price: 11 }, { name: 'Branzino al Forno', qty: 1, price: 32 }, { name: 'Gelato Misto', qty: 1, price: 8 }, { name: 'Acqua Minerale', qty: 1, price: 4 }], total: 55, paymentStatus: 'paid', status: 'completed', waiterName: 'Olivia Davis', createdAt: daysAgo(25), completedAt: daysAgo(25) },
  { id: 'o5', customerName: 'Michelle Garcia', tableNumber: 14, items: [{ name: 'Zuppa del Giorno', qty: 1, price: 9 }, { name: 'Osso Buco', qty: 2, price: 45 }, { name: 'Risotto ai Funghi', qty: 1, price: 22 }, { name: 'Panna Cotta', qty: 2, price: 9 }, { name: 'Cappuccino', qty: 2, price: 5 }], total: 144, paymentStatus: 'paid', status: 'completed', waiterName: 'Sophia Chen', createdAt: daysAgo(23), completedAt: daysAgo(23) },
  { id: 'o6', customerName: 'Lauren Thompson', tableNumber: 2, items: [{ name: 'Zuppa del Giorno', qty: 1, price: 9 }, { name: 'Risotto ai Funghi', qty: 1, price: 22 }, { name: 'Gelato Misto', qty: 1, price: 8 }, { name: 'Espresso', qty: 1, price: 3 }], total: 42, paymentStatus: 'paid', status: 'completed', waiterName: 'Michael Kim', createdAt: daysAgo(22), completedAt: daysAgo(22) },
  { id: 'o7', customerName: 'Nicole White', tableNumber: 11, items: [{ name: 'Calamari Fritti', qty: 2, price: 12 }, { name: 'Costolette d\'Agnello', qty: 2, price: 42 }, { name: 'Lasagna Classica', qty: 1, price: 20 }, { name: 'Tiramisù', qty: 2, price: 10 }, { name: 'Cappuccino', qty: 3, price: 5 }, { name: 'Acqua Minerale', qty: 2, price: 4 }], total: 185, paymentStatus: 'paid', status: 'completed', waiterName: 'Ethan Brown', createdAt: daysAgo(21), completedAt: daysAgo(21) },
  { id: 'o8', customerName: 'Stephanie Clark', tableNumber: 8, items: [{ name: 'Bruschetta al Pomodoro', qty: 1, price: 10 }, { name: 'Salmone al Limone', qty: 1, price: 28 }, { name: 'Penne all\'Arrabbiata', qty: 1, price: 16 }, { name: 'Panna Cotta', qty: 1, price: 9 }, { name: 'Succo d\'Arancia', qty: 1, price: 5 }], total: 68, paymentStatus: 'paid', status: 'completed', waiterName: 'David Thompson', createdAt: daysAgo(19), completedAt: daysAgo(19) },
  { id: 'o9', customerName: 'Rebecca Walker', tableNumber: 6, items: [{ name: 'Carpaccio di Manzo', qty: 1, price: 16 }, { name: 'Filetto di Manzo', qty: 1, price: 38 }, { name: 'Tiramisù', qty: 1, price: 10 }, { name: 'Cappuccino', qty: 1, price: 5 }, { name: 'Acqua Minerale', qty: 1, price: 4 }], total: 73, paymentStatus: 'paid', status: 'completed', waiterName: 'Benjamin White', createdAt: daysAgo(18), completedAt: daysAgo(18) },
  { id: 'o10', customerName: 'Vanessa King', tableNumber: 4, items: [{ name: 'Diavola', qty: 1, price: 16 }, { name: 'Insalata Cesare', qty: 1, price: 11 }, { name: 'Gelato Misto', qty: 1, price: 8 }, { name: 'Coca Cola', qty: 1, price: 3 }], total: 38, paymentStatus: 'paid', status: 'completed', waiterName: 'Sophia Chen', createdAt: daysAgo(17), completedAt: daysAgo(17) },
  { id: 'o11', customerName: 'Ryan Martinez', tableNumber: 3, items: [{ name: 'Spaghetti Carbonara', qty: 1, price: 18 }, { name: 'Penne all\'Arrabbiata', qty: 1, price: 16 }, { name: 'Acqua Minerale', qty: 1, price: 4 }, { name: 'Espresso', qty: 1, price: 3 }], total: 41, paymentStatus: 'paid', status: 'completed', waiterName: 'Lucas Garcia', createdAt: daysAgo(15), completedAt: daysAgo(15) },
  { id: 'o12', customerName: 'Daniel Harris', tableNumber: 15, items: [{ name: 'Calamari Fritti', qty: 2, price: 12 }, { name: 'Filetto di Manzo', qty: 2, price: 38 }, { name: 'Risotto ai Funghi', qty: 1, price: 22 }, { name: 'Tiramisù', qty: 2, price: 10 }, { name: 'Cappuccino', qty: 2, price: 5 }, { name: 'Acqua Minerale', qty: 2, price: 4 }], total: 154, paymentStatus: 'paid', status: 'completed', waiterName: 'Ethan Brown', createdAt: daysAgo(14), completedAt: daysAgo(14) },
  { id: 'o13', customerName: 'Andrew Lewis', tableNumber: 7, items: [{ name: 'Bruschetta al Pomodoro', qty: 1, price: 10 }, { name: 'Filetto di Manzo', qty: 1, price: 38 }, { name: 'Gelato Misto', qty: 1, price: 8 }, { name: 'Espresso', qty: 1, price: 3 }], total: 59, paymentStatus: 'paid', status: 'completed', waiterName: 'David Thompson', createdAt: daysAgo(13), completedAt: daysAgo(13) },
  { id: 'o14', customerName: 'Kimberly Allen', tableNumber: 5, items: [{ name: 'Insalata Cesare', qty: 1, price: 11 }, { name: 'Salmone al Limone', qty: 1, price: 28 }, { name: 'Panna Cotta', qty: 1, price: 9 }, { name: 'Cappuccino', qty: 1, price: 5 }], total: 53, paymentStatus: 'paid', status: 'completed', waiterName: 'Olivia Davis', createdAt: daysAgo(12), completedAt: daysAgo(12) },
  { id: 'o15', customerName: 'Justin Young', tableNumber: 1, items: [{ name: 'Carpaccio di Manzo', qty: 1, price: 16 }, { name: 'Pollo alla Milanese', qty: 1, price: 22 }, { name: 'Tiramisù', qty: 1, price: 10 }, { name: 'Coca Cola', qty: 1, price: 3 }], total: 51, paymentStatus: 'paid', status: 'completed', waiterName: 'Benjamin White', createdAt: daysAgo(11), completedAt: daysAgo(11) },
  { id: 'o16', customerName: 'Matthew Hall', tableNumber: 9, items: [{ name: 'Zuppa del Giorno', qty: 2, price: 9 }, { name: 'Quattro Formaggi', qty: 1, price: 17 }, { name: 'Margherita', qty: 1, price: 14 }, { name: 'Panna Cotta', qty: 2, price: 9 }, { name: 'Coca Cola', qty: 2, price: 3 }], total: 77, paymentStatus: 'paid', status: 'completed', waiterName: 'Lucas Garcia', createdAt: daysAgo(10), completedAt: daysAgo(10) },
  { id: 'o17', customerName: 'Jason Robinson', tableNumber: 14, items: [{ name: 'Bistro Aurelia Burger', qty: 1, price: 18 }, { name: 'Double Cheeseburger', qty: 1, price: 20 }, { name: 'Coca Cola', qty: 2, price: 3 }], total: 44, paymentStatus: 'paid', status: 'completed', waiterName: 'Sophia Chen', createdAt: daysAgo(9), completedAt: daysAgo(9) },
  { id: 'o18', customerName: 'Sarah Mitchell', tableNumber: 7, items: [{ name: 'Calamari Fritti', qty: 1, price: 12 }, { name: 'Salmone al Limone', qty: 1, price: 28 }, { name: 'Branzino al Forno', qty: 1, price: 32 }, { name: 'Tiramisù', qty: 2, price: 10 }, { name: 'Acqua Minerale', qty: 2, price: 4 }, { name: 'Cappuccino', qty: 2, price: 5 }], total: 106, paymentStatus: 'paid', status: 'completed', waiterName: 'David Thompson', createdAt: daysAgo(8), completedAt: daysAgo(8) },
  { id: 'o19', customerName: 'Michelle Garcia', tableNumber: 6, items: [{ name: 'Bruschetta al Pomodoro', qty: 1, price: 10 }, { name: 'Lobster Linguine', qty: 1, price: 38 }, { name: 'Risotto ai Funghi', qty: 1, price: 22 }, { name: 'Panna Cotta', qty: 1, price: 9 }, { name: 'Cappuccino', qty: 1, price: 5 }, { name: 'Acqua Minerale', qty: 1, price: 4 }], total: 88, paymentStatus: 'paid', status: 'completed', waiterName: 'Ethan Brown', createdAt: daysAgo(7), completedAt: daysAgo(7) },
  { id: 'o20', customerName: 'Nicole White', tableNumber: 12, items: [{ name: 'Carpaccio di Manzo', qty: 1, price: 16 }, { name: 'Costolette d\'Agnello', qty: 1, price: 42 }, { name: 'Lasagna Classica', qty: 1, price: 20 }, { name: 'Tiramisù', qty: 1, price: 10 }, { name: 'Espresso', qty: 1, price: 3 }], total: 91, paymentStatus: 'paid', status: 'completed', waiterName: 'Benjamin White', createdAt: daysAgo(6), completedAt: daysAgo(6) },
  { id: 'o21', customerName: 'Rebecca Walker', tableNumber: 11, items: [{ name: 'Insalata Cesare', qty: 1, price: 11 }, { name: 'Pollo alla Milanese', qty: 2, price: 22 }, { name: 'Margherita', qty: 1, price: 14 }, { name: 'Gelato Misto', qty: 2, price: 8 }, { name: 'Coca Cola', qty: 2, price: 3 }, { name: 'Succo d\'Arancia', qty: 1, price: 5 }], total: 99, paymentStatus: 'paid', status: 'completed', waiterName: 'Sophia Chen', createdAt: daysAgo(5), completedAt: daysAgo(5) },
  { id: 'o22', customerName: 'Brandon Wright', tableNumber: 3, items: [{ name: 'Zuppa del Giorno', qty: 1, price: 9 }, { name: 'Filetto di Manzo', qty: 1, price: 38 }, { name: 'Penne all\'Arrabbiata', qty: 1, price: 16 }, { name: 'Panna Cotta', qty: 1, price: 9 }, { name: 'Espresso', qty: 1, price: 3 }], total: 75, paymentStatus: 'paid', status: 'completed', waiterName: 'Olivia Davis', createdAt: daysAgo(4), completedAt: daysAgo(4) },
  { id: 'o23', customerName: 'Jennifer Williams', tableNumber: 15, items: [{ name: 'Calamari Fritti', qty: 2, price: 12 }, { name: 'Osso Buco', qty: 1, price: 45 }, { name: 'Quattro Formaggi', qty: 2, price: 17 }, { name: 'Tiramisù', qty: 2, price: 10 }, { name: 'Cappuccino', qty: 3, price: 5 }, { name: 'Acqua Minerale', qty: 2, price: 4 }], total: 173, paymentStatus: 'paid', status: 'completed', waiterName: 'Lucas Garcia', createdAt: daysAgo(3), completedAt: daysAgo(3) },
  { id: 'o24', customerName: 'Lauren Thompson', tableNumber: 2, items: [{ name: 'Insalata Cesare', qty: 1, price: 11 }, { name: 'Risotto ai Funghi', qty: 1, price: 22 }, { name: 'Gelato Misto', qty: 1, price: 8 }], total: 41, paymentStatus: 'paid', status: 'completed', waiterName: 'Michael Kim', createdAt: daysAgo(2), completedAt: daysAgo(2) },
  { id: 'o25', customerName: 'Stephanie Clark', tableNumber: 8, items: [{ name: 'Bruschetta al Pomodoro', qty: 1, price: 10 }, { name: 'Salmone al Limone', qty: 1, price: 28 }, { name: 'Diavola', qty: 1, price: 16 }, { name: 'Tiramisù', qty: 1, price: 10 }, { name: 'Cappuccino', qty: 1, price: 5 }], total: 69, paymentStatus: 'paid', status: 'completed', waiterName: 'David Thompson', createdAt: daysAgo(1), completedAt: daysAgo(1) },
  { id: 'o26', customerName: 'Amanda Davis', tableNumber: 5, items: [{ name: 'Carpaccio di Manzo', qty: 1, price: 16 }, { name: 'Branzino al Forno', qty: 1, price: 32 }, { name: 'Panna Cotta', qty: 1, price: 9 }, { name: 'Acqua Minerale', qty: 1, price: 4 }], total: 61, paymentStatus: 'unpaid', status: 'served', waiterName: 'Sophia Chen', createdAt: daysAgo(0) },
  { id: 'o27', customerName: 'Robert Anderson', tableNumber: 4, items: [{ name: 'Calamari Fritti', qty: 1, price: 12 }, { name: 'Bistro Aurelia Burger', qty: 1, price: 18 }, { name: 'Mushroom Swiss Burger', qty: 1, price: 19 }, { name: 'Coca Cola', qty: 2, price: 3 }], total: 55, paymentStatus: 'unpaid', status: 'ready', waiterName: 'Ethan Brown', createdAt: daysAgo(0) },
  { id: 'o28', customerName: 'Kevin Wilson', tableNumber: 7, items: [{ name: 'Insalata Cesare', qty: 1, price: 11 }, { name: 'Bistro Aurelia Burger', qty: 2, price: 18 }, { name: 'Double Cheeseburger', qty: 1, price: 20 }, { name: 'Gelato Misto', qty: 2, price: 8 }, { name: 'Coca Cola', qty: 3, price: 3 }, { name: 'Succo d\'Arancia', qty: 1, price: 5 }], total: 100, paymentStatus: 'unpaid', status: 'preparing', waiterName: 'Benjamin White', createdAt: daysFromNow(1) },
  { id: 'o29', customerName: 'Vanessa King', tableNumber: 1, items: [{ name: 'Diavola', qty: 1, price: 16 }, { name: 'Prosciutto e Funghi', qty: 1, price: 18 }, { name: 'Coca Cola', qty: 2, price: 3 }], total: 40, paymentStatus: 'unpaid', status: 'pending', waiterName: 'Olivia Davis', createdAt: daysFromNow(1) },
  { id: 'o30', customerName: 'Kimberly Allen', tableNumber: 6, items: [{ name: 'Bruschetta al Pomodoro', qty: 1, price: 10 }, { name: 'Salmone al Limone', qty: 1, price: 28 }, { name: 'Risotto ai Funghi', qty: 1, price: 22 }, { name: 'Tiramisù', qty: 1, price: 10 }, { name: 'Cappuccino', qty: 1, price: 5 }], total: 75, paymentStatus: 'paid', status: 'completed', waiterName: 'Lucas Garcia', createdAt: daysAgo(0), completedAt: daysAgo(0) },
  { id: 'o31', customerName: 'Christopher Brown', tableNumber: 2, items: [{ name: 'Spaghetti Carbonara', qty: 1, price: 18 }, { name: 'Espresso', qty: 1, price: 3 }], total: 21, paymentStatus: 'paid', status: 'completed', waiterName: 'Michael Kim', createdAt: daysAgo(20), completedAt: daysAgo(20) },
  { id: 'o32', customerName: 'Justin Young', tableNumber: 9, items: [{ name: 'Carpaccio di Manzo', qty: 1, price: 16 }, { name: 'Pollo alla Milanese', qty: 1, price: 22 }, { name: 'Tiramisù', qty: 1, price: 10 }, { name: 'Espresso', qty: 1, price: 3 }], total: 51, paymentStatus: 'paid', status: 'completed', waiterName: 'Sophia Chen', createdAt: daysAgo(10), completedAt: daysAgo(10) },
  { id: 'o33', customerName: 'Andrew Lewis', tableNumber: 5, items: [{ name: 'Filetto di Manzo', qty: 1, price: 38 }, { name: 'Insalata Cesare', qty: 1, price: 11 }, { name: 'Cappuccino', qty: 1, price: 5 }], total: 54, paymentStatus: 'paid', status: 'completed', waiterName: 'David Thompson', createdAt: daysAgo(1), completedAt: daysAgo(1) },
  { id: 'o34', customerName: 'Matthew Hall', tableNumber: 10, items: [{ name: 'Quattro Formaggi', qty: 1, price: 17 }, { name: 'Lasagna Classica', qty: 1, price: 20 }, { name: 'Panna Cotta', qty: 1, price: 9 }, { name: 'Coca Cola', qty: 2, price: 3 }, { name: 'Acqua Minerale', qty: 1, price: 4 }], total: 56, paymentStatus: 'paid', status: 'completed', waiterName: 'Benjamin White', createdAt: daysAgo(9), completedAt: daysAgo(9) },
  { id: 'o35', customerName: 'Nicole White', tableNumber: 15, items: [{ name: 'Chef\'s Tasting Menu', qty: 2, price: 65 }, { name: 'Lobster Linguine', qty: 1, price: 38 }, { name: 'Acqua Minerale', qty: 2, price: 4 }], total: 176, paymentStatus: 'paid', status: 'completed', waiterName: 'Ethan Brown', createdAt: daysAgo(2), completedAt: daysAgo(2) },
  { id: 'o36', customerName: 'Jennifer Williams', tableNumber: 11, items: [{ name: 'Chef\'s Tasting Menu', qty: 1, price: 65 }, { name: 'Osso Buco', qty: 1, price: 45 }, { name: 'Carpaccio di Manzo', qty: 1, price: 16 }, { name: 'Tiramisù', qty: 1, price: 10 }], total: 136, paymentStatus: 'paid', status: 'completed', waiterName: 'Lucas Garcia', createdAt: daysAgo(5), completedAt: daysAgo(5) },
  { id: 'o37', customerName: 'Sarah Mitchell', tableNumber: 7, items: [{ name: 'Calamari Fritti', qty: 1, price: 12 }, { name: 'Branzino al Forno', qty: 1, price: 32 }, { name: 'Penne all\'Arrabbiata', qty: 1, price: 16 }, { name: 'Panna Cotta', qty: 1, price: 9 }, { name: 'Cappuccino', qty: 1, price: 5 }, { name: 'Acqua Minerale', qty: 1, price: 4 }], total: 78, paymentStatus: 'paid', status: 'completed', waiterName: 'Sophia Chen', createdAt: daysAgo(14), completedAt: daysAgo(14) },
  { id: 'o38', customerName: 'Rebecca Walker', tableNumber: 11, items: [{ name: 'Zuppa del Giorno', qty: 1, price: 9 }, { name: 'Pollo alla Milanese', qty: 1, price: 22 }, { name: 'Lasagna Classica', qty: 1, price: 20 }, { name: 'Gelato Misto', qty: 1, price: 8 }, { name: 'Succo d\'Arancia', qty: 1, price: 5 }], total: 64, paymentStatus: 'paid', status: 'completed', waiterName: 'Michael Kim', createdAt: daysAgo(0), completedAt: daysAgo(0) },
]

export const inventoryItems: AdminInventoryItem[] = [
  { id: 'i1', name: 'San Marzano Tomatoes', quantity: 25, unit: 'kg', supplier: 'Italian Imports Co.', expiryDate: daysFromNow(45), lowStockAlert: 5 },
  { id: 'i2', name: 'Mozzarella di Bufala', quantity: 8, unit: 'kg', supplier: 'Dairy Fresh Supply', expiryDate: daysFromNow(14), lowStockAlert: 3 },
  { id: 'i3', name: 'Extra Virgin Olive Oil', quantity: 12, unit: 'l', supplier: 'Mediterranean Foods', expiryDate: daysFromNow(180), lowStockAlert: 3 },
  { id: 'i4', name: 'All-Purpose Flour', quantity: 30, unit: 'kg', supplier: 'Restaurant Depot', expiryDate: daysFromNow(120), lowStockAlert: 10 },
  { id: 'i5', name: 'Parmigiano Reggiano', quantity: 6, unit: 'kg', supplier: 'Italian Imports Co.', expiryDate: daysFromNow(60), lowStockAlert: 2 },
  { id: 'i6', name: 'Atlantic Salmon Fillets', quantity: 10, unit: 'kg', supplier: 'Fresh Catch Seafood', expiryDate: daysFromNow(5), lowStockAlert: 3 },
  { id: 'i7', name: 'Angus Beef Tenderloin', quantity: 15, unit: 'kg', supplier: 'Prime Meats LLC', expiryDate: daysFromNow(10), lowStockAlert: 4 },
  { id: 'i8', name: 'Spaghetti Pasta', quantity: 20, unit: 'kg', supplier: 'Restaurant Depot', expiryDate: daysFromNow(200), lowStockAlert: 5 },
  { id: 'i9', name: 'Arborio Rice', quantity: 8, unit: 'kg', supplier: 'Restaurant Depot', expiryDate: daysFromNow(180), lowStockAlert: 3 },
  { id: 'i10', name: 'Fresh Basil', quantity: 2, unit: 'kg', supplier: 'Local Greens Farm', expiryDate: daysFromNow(4), lowStockAlert: 1 },
  { id: 'i11', name: 'Coca Cola Syrup', quantity: 6, unit: 'bottles', supplier: 'Beverage Distributors', expiryDate: daysFromNow(90), lowStockAlert: 2 },
  { id: 'i12', name: 'Coffee Beans - Italian Roast', quantity: 15, unit: 'kg', supplier: 'La Casa del Caffè', expiryDate: daysFromNow(60), lowStockAlert: 4 },
  { id: 'i13', name: 'Prosciutto di Parma', quantity: 4, unit: 'kg', supplier: 'Italian Imports Co.', expiryDate: daysFromNow(21), lowStockAlert: 1 },
  { id: 'i14', name: 'Brioche Buns', quantity: 60, unit: 'pcs', supplier: 'Artisan Bakery', expiryDate: daysFromNow(3), lowStockAlert: 20 },
  { id: 'i15', name: 'Heavy Cream', quantity: 8, unit: 'l', supplier: 'Dairy Fresh Supply', expiryDate: daysFromNow(10), lowStockAlert: 3 },
]

export const reviews: AdminReview[] = [
  { id: 'rev1', customerName: 'Sarah Mitchell', rating: 5, comment: 'Absolutely incredible dining experience! The filet mignon was cooked to perfection and the tiramisu was the best I have ever had.', date: daysAgo(8), approved: true, hidden: false, reply: 'Thank you Sarah! We are thrilled you enjoyed your evening with us.' },
  { id: 'rev2', customerName: 'Robert Anderson', rating: 4, comment: 'Great atmosphere and excellent service. The carbonara was authentic and delicious. Would have liked a bigger wine selection by the glass.', date: daysAgo(15), approved: true, hidden: false, reply: 'Thank you Robert! We are adding new wines by the glass next month.' },
  { id: 'rev3', customerName: 'Jennifer Williams', rating: 5, comment: 'We celebrated my birthday here and it was perfect. They accommodated our large party of 8 beautifully. The osso buco is a must-try!', date: daysAgo(12), approved: true, hidden: false },
  { id: 'rev4', customerName: 'Kevin Wilson', rating: 3, comment: 'Food was good but service was slow. We waited 20 minutes just for our drinks. The burger was excellent though.', date: daysAgo(20), approved: true, hidden: false, reply: 'Kevin, we apologize for the slow service. We have addressed this with our team. Hope you give us another chance.' },
  { id: 'rev5', customerName: 'Michelle Garcia', rating: 5, comment: 'Bistro Aurelia never disappoints. The branzino is my favorite dish in the city. The staff always remembers our preferences.', date: daysAgo(10), approved: true, hidden: false },
  { id: 'rev6', customerName: 'Lauren Thompson', rating: 4, comment: 'As a vegetarian, I appreciate that they have options beyond just salad. The risotto ai funghi was divine. Would love more plant-based mains.', date: daysAgo(18), approved: true, hidden: false, reply: 'Thank you Lauren! Our chef is working on new vegetarian dishes for next season.' },
  { id: 'rev7', customerName: 'Nicole White', rating: 5, comment: 'The Chef\'s Tasting Menu is an incredible value for the quality. Each course was beautifully presented and bursting with flavor. A true culinary journey.', date: daysAgo(6), approved: true, hidden: false },
  { id: 'rev8', customerName: 'Christopher Brown', rating: 2, comment: 'Disappointing experience. My steak was overcooked and the server was inattentive. For these prices, I expect much better.', date: daysAgo(25), approved: true, hidden: true, reply: 'Christopher, we are sorry to hear this. Please contact us directly so we can make this right.' },
  { id: 'rev9', customerName: 'Rebecca Walker', rating: 5, comment: 'Our go-to spot for family dinners. The kids love the pizza and my husband and I enjoy the pasta. The Sunday brunch is fantastic too!', date: daysAgo(9), approved: true, hidden: false },
  { id: 'rev10', customerName: 'Brandon Wright', rating: 4, comment: 'Excellent lunch spot near my office. The lunch specials are well-priced and the service is always fast during the weekday rush.', date: daysAgo(14), approved: true, hidden: false },
]

export const notifications: Notification[] = [
  { id: 'n1', type: 'reservation', message: 'New reservation from Daniel Harris for 6 guests on Friday at 20:30', time: hoursAgo(3), read: false },
  { id: 'n2', type: 'cancellation', message: 'Reservation #r5 cancelled by Kevin Wilson - 2 guests', time: hoursAgo(8), read: false },
  { id: 'n3', type: 'stock', message: 'Low stock alert: Fresh Basil (1kg remaining) - below minimum threshold', time: hoursAgo(5), read: false },
  { id: 'n4', type: 'review', message: 'New 5-star review from Nicole White', time: hoursAgo(12), read: false },
  { id: 'n5', type: 'customer', message: 'Customer Jason Robinson booked their second visit', time: hoursAgo(24), read: true },
  { id: 'n6', type: 'revenue', message: 'Today\'s revenue has reached $4,520 - 15% above yesterday\'s pace', time: hoursAgo(2), read: false },
  { id: 'n7', type: 'reservation', message: 'Rebecca Walker booked a table for 5 next Wednesday at 18:00', time: hoursAgo(8), read: true },
  { id: 'n8', type: 'stock', message: 'Reorder needed: Atlantic Salmon Fillets - only 3 days until expiry', time: hoursAgo(10), read: false },
  { id: 'n9', type: 'reservation', message: 'New reservation from Matthew Hall for 4 guests - Saturday at 21:00', time: hoursAgo(6), read: false },
  { id: 'n10', type: 'revenue', message: 'Weekly revenue tracking at $42,800 - on pace for record week', time: hoursAgo(4), read: true },
  { id: 'n11', type: 'cancellation', message: 'Table 15 reservation for 6 guests cancelled by Brandon Wright', time: hoursAgo(18), read: true },
  { id: 'n12', type: 'customer', message: 'Customer Nicole White reached 500 loyalty points - Gold Tier achieved', time: hoursAgo(20), read: false },
]

export const restaurantSettings: RestaurantSettings = {
  name: 'Bistro Aurelia',
  logo: '/images/logo.png',
  address: '245 West 48th Street, New York, NY 10036',
  contact: '(212) 555-0199',
  openingHours: [
    { day: 'Monday', open: '11:00', close: '22:00', closed: false },
    { day: 'Tuesday', open: '11:00', close: '22:00', closed: false },
    { day: 'Wednesday', open: '11:00', close: '22:00', closed: false },
    { day: 'Thursday', open: '11:00', close: '23:00', closed: false },
    { day: 'Friday', open: '11:00', close: '23:00', closed: false },
    { day: 'Saturday', open: '10:00', close: '23:00', closed: false },
    { day: 'Sunday', open: '10:00', close: '21:00', closed: false },
  ],
  tax: 8.875,
  currency: 'USD',
  timezone: 'America/New_York',
  maxGuestsPerReservation: 8,
  autoConfirmReservations: false,
  reservationNotice: 2,
}

const revenueGen = seededRandom(42)

function generateRevenueData(): RevenueData[] {
  const data: RevenueData[] = []
  for (let i = 90; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dayOfWeek = d.getDay()
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6
    const isSunday = dayOfWeek === 0
    const base = isWeekend ? 7000 : isSunday ? 5000 : 3500
    const variance = revenueGen() * 5000
    const gross = Math.round((base + variance) * 100) / 100
    const tax = Math.round(gross * 0.08875 * 100) / 100
    const discounts = Math.round(revenueGen() * 300 * 100) / 100
    const refunds = revenueGen() > 0.85 ? Math.round(revenueGen() * 200 * 100) / 100 : 0
    const net = Math.round((gross - tax - discounts - refunds) * 100) / 100
    data.push({ date: d.toISOString().split('T')[0], gross, net, tax, discounts, refunds })
  }
  return data
}

export const revenueData: RevenueData[] = generateRevenueData()

export const kpiTrends: Record<string, KPITrend> = {
  todayRevenue: { value: 4520, change: 15, trend: [3200, 3800, 4100, 3900, 4500, 4200, 4520] },
  weeklyRevenue: { value: 42800, change: 8, trend: [36500, 38200, 39500, 41000, 39800, 41500, 42800] },
  monthlyRevenue: { value: 142500, change: 12, trend: [118000, 122000, 128000, 132000, 138000, 140000, 142500] },
  totalReservations: { value: 55, change: 10, trend: [42, 45, 48, 50, 52, 53, 55] },
  activeReservations: { value: 18, change: -5, trend: [22, 21, 20, 21, 19, 18, 18] },
  cancelledReservations: { value: 5, change: -20, trend: [8, 7, 7, 6, 6, 5, 5] },
  tablesOccupied: { value: 12, change: 9, trend: [8, 10, 9, 11, 12, 11, 12] },
  availableTables: { value: 8, change: -11, trend: [12, 11, 12, 10, 9, 9, 8] },
  totalCustomers: { value: 850, change: 18, trend: [620, 680, 720, 760, 800, 830, 850] },
  newCustomers: { value: 45, change: 25, trend: [28, 32, 35, 38, 40, 42, 45] },
  totalEmployees: { value: 15, change: 0, trend: [14, 14, 15, 15, 15, 15, 15] },
  todayOrders: { value: 38, change: 12, trend: [28, 30, 32, 35, 34, 36, 38] },
  pendingOrders: { value: 6, change: -25, trend: [10, 9, 8, 8, 7, 7, 6] },
}

export function getDashboardStats(): DashboardStats {
  const todayStr = today.toISOString().split('T')[0]
  const todayRevenueEntries = revenueData.filter(r => r.date === todayStr)
  const todayRev = todayRevenueEntries.length > 0 ? todayRevenueEntries[0].gross : 0

  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekStr = weekAgo.toISOString().split('T')[0]
  const weeklyRev = revenueData.filter(r => r.date >= weekStr && r.date <= todayStr).reduce((sum, r) => sum + r.gross, 0)

  const monthAgo = new Date(today)
  monthAgo.setDate(monthAgo.getDate() - 30)
  const monthStr = monthAgo.toISOString().split('T')[0]
  const monthlyRev = revenueData.filter(r => r.date >= monthStr && r.date <= todayStr).reduce((sum, r) => sum + r.gross, 0)

  const todayReservations = reservations.filter(r => r.date === todayStr)
  const activeReservationsCount = reservations.filter(r => r.status === 'confirmed' || r.status === 'pending').length
  const cancelledCount = reservations.filter(r => r.status === 'cancelled').length

  const todayOrdersList = orders.filter(o => o.createdAt.split('T')[0] === todayStr)
  const pendingOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length

  const totalEmployees = employees.length

  const tablesInUse = orders.filter(o => o.createdAt.split('T')[0] === todayStr && o.status !== 'completed' && o.status !== 'cancelled').length
  const totalTables = 28

  const newCustomersCount = 45

  return {
    todayRevenue: todayRev,
    weeklyRevenue: Math.round(weeklyRev * 100) / 100,
    monthlyRevenue: Math.round(monthlyRev * 100) / 100,
    totalReservations: reservations.length,
    activeReservations: activeReservationsCount,
    cancelledReservations: cancelledCount,
    tablesOccupied: tablesInUse,
    availableTables: totalTables - tablesInUse,
    totalCustomers: customers.length,
    newCustomers: newCustomersCount,
    totalEmployees,
    todayOrders: todayOrdersList.length,
    pendingOrders: pendingOrdersCount,
  }
}

export function getRevenueByPeriod(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): { labels: string[]; data: number[] } {
  const labels: string[] = []
  const data: number[] = []

  if (period === 'daily') {
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const entry = revenueData.find(r => r.date === dateStr)
      labels.push(dateStr.slice(5))
      data.push(entry ? entry.gross : 0)
    }
  } else if (period === 'weekly') {
    for (let i = 11; i >= 0; i--) {
      const end = new Date(today)
      end.setDate(end.getDate() - i * 7)
      const start = new Date(end)
      start.setDate(start.getDate() - 6)
      const startStr = start.toISOString().split('T')[0]
      const endStr = end.toISOString().split('T')[0]
      const weekRevenue = revenueData.filter(r => r.date >= startStr && r.date <= endStr).reduce((sum, r) => sum + r.gross, 0)
      labels.push(`${startStr.slice(5)}-${endStr.slice(5)}`)
      data.push(Math.round(weekRevenue * 100) / 100)
    }
  } else if (period === 'monthly') {
    const months: string[] = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today)
      d.setMonth(d.getMonth() - i)
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const monthRevenue = revenueData.filter(r => r.date.startsWith(monthKey)).reduce((sum, r) => sum + r.gross, 0)
      const monthName = d.toLocaleString('default', { month: 'short' })
      labels.push(monthName)
      data.push(Math.round(monthRevenue * 100) / 100)
    }
  } else {
    labels.push(String(currentYear - 1), String(currentYear))
    const lastYear = revenueData.filter(r => r.date.startsWith(String(currentYear - 1))).reduce((sum, r) => sum + r.gross, 0)
    const thisYear = revenueData.filter(r => r.date.startsWith(String(currentYear))).reduce((sum, r) => sum + r.gross, 0)
    data.push(Math.round(lastYear * 100) / 100, Math.round(thisYear * 100) / 100)
  }

  return { labels, data }
}

export function getReservationsByDay(): { labels: string[]; data: number[] } {
  const dayMap: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 }
  reservations.forEach(r => {
    const d = new Date(r.date)
    const dayName = d.toLocaleString('default', { weekday: 'short' })
    dayMap[dayName] = (dayMap[dayName] || 0) + 1
  })
  return { labels: Object.keys(dayMap), data: Object.values(dayMap) }
}

export function getReservationsByTime(): { labels: string[]; data: number[] } {
  const timeSlots = ['18:00-18:30', '18:30-19:00', '19:00-19:30', '19:30-20:00', '20:00-20:30', '20:30-21:00', '21:00-21:30', '21:30-22:00']
  const slotMap: Record<string, number> = {}
  timeSlots.forEach(s => { slotMap[s] = 0 })
  reservations.forEach(r => {
    const hour = parseInt(r.time.split(':')[0])
    const min = parseInt(r.time.split(':')[1])
    let slot = ''
    if (min < 30) slot = `${String(hour).padStart(2, '0')}:00-${String(hour).padStart(2, '0')}:30`
    else slot = `${String(hour).padStart(2, '0')}:30-${String(hour + 1).padStart(2, '0')}:00`
    if (slotMap[slot] !== undefined) slotMap[slot]++
  })
  return { labels: Object.keys(slotMap), data: Object.values(slotMap) }
}

export function getMenuSalesByCategory(): { labels: string[]; data: number[]; colors: string[] } {
  const categoryRevenue: Record<string, number> = {}
  orders.forEach(order => {
    order.items.forEach(item => {
      const menuItem = menuItems.find(m => m.name === item.name)
      if (menuItem) {
        const total = item.qty * item.price
        categoryRevenue[menuItem.category] = (categoryRevenue[menuItem.category] || 0) + total
      }
    })
  })
  const labels = Object.keys(categoryRevenue)
  const data = Object.values(categoryRevenue)
  const categoryColors: Record<string, string> = {
    starters: '#c8a76a',
    'main-course': '#9f6f3b',
    pizza: '#0f0f11',
    pasta: '#1d2229',
    burgers: '#c8a76a',
    desserts: '#9f6f3b',
    drinks: '#f4efe6',
    coffee: '#c8a76a',
    specials: '#1d2229',
  }
  const colors = labels.map(l => categoryColors[l] || '#c8a76a')
  return { labels, data, colors }
}

export function getBestSellingItems(): { name: string; sales: number; revenue: number }[] {
  const itemSales: Record<string, { qty: number; revenue: number }> = {}
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!itemSales[item.name]) itemSales[item.name] = { qty: 0, revenue: 0 }
      itemSales[item.name].qty += item.qty
      itemSales[item.name].revenue += item.qty * item.price
    })
  })
  return Object.entries(itemSales)
    .map(([name, data]) => ({ name, sales: data.qty, revenue: data.revenue }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10)
}

export function getCustomerStats(): { returning: number; new: number; avgSpend: number } {
  const returning = customers.filter(c => c.totalReservations >= 2).length
  const firstTimers = customers.filter(c => c.totalReservations < 2).length
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  return { returning, new: firstTimers, avgSpend: Math.round(totalSpent / customers.length * 100) / 100 }
}
