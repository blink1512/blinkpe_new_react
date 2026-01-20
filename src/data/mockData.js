// Mock data for fintech admin dashboard

export const transactions = [
  { id: 'TXN001', date: '2024-01-15 14:30', customer: 'John Smith', email: 'john@example.com', amount: 1250, status: 'completed', type: 'payment', method: 'Visa •••• 4242' },
  { id: 'TXN002', date: '2024-01-15 13:45', customer: 'Sarah Wilson', email: 'sarah@example.com', amount: 890.5, status: 'completed', type: 'payment', method: 'Mastercard •••• 5555' },
  { id: 'TXN003', date: '2024-01-15 12:20', customer: 'Mike Johnson', email: 'mike@example.com', amount: 2100, status: 'pending', type: 'transfer', method: 'Bank Transfer' },
  { id: 'TXN004', date: '2024-01-15 11:15', customer: 'Emily Brown', email: 'emily@example.com', amount: 450, status: 'failed', type: 'payment', method: 'Visa •••• 1234' },
  { id: 'TXN005', date: '2024-01-15 10:00', customer: 'David Lee', email: 'david@example.com', amount: 3200, status: 'completed', type: 'payment', method: 'Amex •••• 3782' },
  { id: 'TXN006', date: '2024-01-14 16:45', customer: 'Lisa Garcia', email: 'lisa@example.com', amount: 125, status: 'completed', type: 'refund', method: 'Original Payment' },
  { id: 'TXN007', date: '2024-01-14 15:30', customer: 'James Wilson', email: 'james@example.com', amount: 780, status: 'completed', type: 'payment', method: 'Visa •••• 9012' },
  { id: 'TXN008', date: '2024-01-14 14:20', customer: 'Anna Martinez', email: 'anna@example.com', amount: 1650, status: 'pending', type: 'transfer', method: 'Wire Transfer' },
  { id: 'TXN009', date: '2024-01-14 12:00', customer: 'Robert Taylor', email: 'robert@example.com', amount: 920, status: 'completed', type: 'payment', method: 'Mastercard •••• 6789' },
  { id: 'TXN010', date: '2024-01-14 10:30', customer: 'Jennifer White', email: 'jennifer@example.com', amount: 2450, status: 'completed', type: 'payment', method: 'Visa •••• 3456' }
];

export const weeklyStats = [
  { date: 'Mon', transactions: 145, revenue: 28500 },
  { date: 'Tue', transactions: 168, revenue: 32400 },
  { date: 'Wed', transactions: 152, revenue: 29800 },
  { date: 'Thu', transactions: 189, revenue: 41200 },
  { date: 'Fri', transactions: 201, revenue: 45600 },
  { date: 'Sat', transactions: 134, revenue: 24300 },
  { date: 'Sun', transactions: 98, revenue: 18700 }
];

export const monthlyStats = [
  { date: 'Week 1', transactions: 890, revenue: 178000 },
  { date: 'Week 2', transactions: 1024, revenue: 215000 },
  { date: 'Week 3', transactions: 956, revenue: 198000 },
  { date: 'Week 4', transactions: 1087, revenue: 220500 }
];

export const apiKeys = [
  { id: 'key_1', name: 'Production API Key', key: 'pk_live_********3x8f', created: '2024-01-01', lastUsed: '2024-01-15 14:32', status: 'active' },
  { id: 'key_2', name: 'Development API Key', key: 'pk_test_********7k2m', created: '2023-12-15', lastUsed: '2024-01-15 12:15', status: 'active' },
  { id: 'key_3', name: 'Old Integration Key', key: 'pk_live_********9n4p', created: '2023-06-20', lastUsed: '2023-11-30 09:45', status: 'revoked' }
];

export const webhooks = [
  { id: 'wh_1', url: 'https://api.myapp.com/webhooks/payments', events: ['payment.completed', 'payment.failed'], status: 'active', created: '2024-01-05', lastTriggered: '2024-01-15 14:30' },
  { id: 'wh_2', url: 'https://api.myapp.com/webhooks/refunds', events: ['refund.created', 'refund.completed'], status: 'active', created: '2024-01-08', lastTriggered: '2024-01-14 16:45' },
  { id: 'wh_3', url: 'https://staging.myapp.com/webhooks', events: ['payment.completed'], status: 'inactive', created: '2023-12-20', lastTriggered: '2024-01-10 11:20' }
];
