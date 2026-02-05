import { User } from '@/types';
import { LoginFormData, RegisterFormData } from '@/schemas';
import { delay, generateId } from '@/utils/formatters';

// Mock user storage
const mockUsers: Map<string, { user: User; password: string }> = new Map();

// Pre-populate with a demo user
mockUsers.set('demo@example.com', {
  user: {
    id: 'demo-user',
    email: 'demo@example.com',
    name: 'Demo User',
    createdAt: new Date(),
  },
  password: 'demo123',
});

export const authService = {
  async login(data: LoginFormData): Promise<User> {
    await delay(500);
    
    const stored = mockUsers.get(data.email);
    if (!stored || stored.password !== data.password) {
      throw new Error('Invalid email or password');
    }
    
    return stored.user;
  },

  async register(data: RegisterFormData): Promise<User> {
    await delay(500);
    
    if (mockUsers.has(data.email)) {
      throw new Error('Email already registered');
    }
    
    const user: User = {
      id: generateId(),
      email: data.email,
      name: data.name,
      createdAt: new Date(),
    };
    
    mockUsers.set(data.email, { user, password: data.password });
    return user;
  },

  async logout(): Promise<void> {
    await delay(300);
    // In real implementation, invalidate session
  },
};
