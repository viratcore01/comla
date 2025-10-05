import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './Navbar';

// Mock useAuth hook
jest.mock('./AuthContext', () => ({
  ...jest.requireActual('./AuthContext'),
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth;

// Test wrapper component
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Navbar Component', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  it('renders brand name correctly', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      email: '',
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    expect(screen.getByText('Comla')).toBeInTheDocument();
    expect(screen.getByText('Building Cool Stuff')).toBeInTheDocument();
  });

  it('shows login and signup buttons when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      email: '',
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  it('shows user dropdown when authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      email: 'test@example.com',
      user: { _id: '123', email: 'test@example.com' },
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    expect(screen.getByText('test')).toBeInTheDocument(); // First part of email
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', () => {
    const mockLogout = jest.fn();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      email: 'test@example.com',
      user: { _id: '123', email: 'test@example.com', role: 'student' },
      login: jest.fn(),
      logout: mockLogout,
    });

    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    // Click on the user dropdown button
    const dropdownButton = screen.getByText('test');
    fireEvent.click(dropdownButton);

    // Click logout
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('shows My Applications for student users', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      email: 'student@example.com',
      user: { _id: '123', email: 'student@example.com', role: 'student' },
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    // Click on the user dropdown button
    const dropdownButton = screen.getByText('student');
    fireEvent.click(dropdownButton);

    expect(screen.getByText('My Applications')).toBeInTheDocument();
  });

  it('shows Manage Applications for college users', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      email: 'college@example.com',
      user: { _id: '123', email: 'college@example.com', role: 'college' },
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    );

    // Click on the user dropdown button
    const dropdownButton = screen.getByText('college');
    fireEvent.click(dropdownButton);

    expect(screen.getByText('Manage Applications')).toBeInTheDocument();
  });
});