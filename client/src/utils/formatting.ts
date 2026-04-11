// Format date to readable format
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

// Format case ID to readable format
export const formatCaseId = (caseId: string): string => {
  return caseId.substring(0, 8).toUpperCase();
};

// Get status badge color
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    under_review: 'bg-blue-100 text-blue-800 border-blue-300',
    investigating: 'bg-purple-100 text-purple-800 border-purple-300',
    resolved: 'bg-green-100 text-green-800 border-green-300',
    closed: 'bg-gray-100 text-gray-800 border-gray-300',
  };
  return colors[status] || colors.pending;
};

// Get priority badge color
export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };
  return colors[priority] || colors.low;
};

// Truncate text
export const truncate = (text: string, length: number = 50): string => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};
