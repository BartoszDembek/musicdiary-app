import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import EmailVerificationScreen from '../../screens/EmailVerificationScreen';
import { authService } from '../../services/authService';

// Mock dependencies
jest.mock('../../services/authService', () => ({
  authService: {
    checkEmailVerification: jest.fn(),
    resendVerificationEmail: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('EmailVerificationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and checks verification status', async () => {
    authService.checkEmailVerification.mockResolvedValue({ isVerified: false });

    const { getByText } = render(<EmailVerificationScreen />);

    await waitFor(() => {
      expect(getByText('Zweryfikuj swój email')).toBeTruthy();
      expect(getByText('Status: Oczekuje na weryfikację')).toBeTruthy();
    });
  });

  it('handles resend email', async () => {
    authService.checkEmailVerification.mockResolvedValue({ isVerified: false });
    authService.resendVerificationEmail.mockResolvedValue({});

    const { getByText } = render(<EmailVerificationScreen />);

    await waitFor(() => {
      expect(getByText('Wyślij ponownie email weryfikacyjny')).toBeTruthy();
    });

    fireEvent.press(getByText('Wyślij ponownie email weryfikacyjny'));

    await waitFor(() => {
      expect(authService.resendVerificationEmail).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        "Sukces",
        "Email weryfikacyjny został wysłany ponownie",
        expect.any(Array)
      );
    });
  });
});
