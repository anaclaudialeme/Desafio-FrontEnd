import { render, screen, waitFor } from '@testing-library/react';
import UserPage from './page';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { gitHubAdapter } from '@/shared/lib/api';

const mockFetchRepositories = vi.fn();
const mockSendEvent = vi.fn();
const mockGetUserDetails = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue('octocat'),
  }),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock('./page.module.scss', () => ({}));

vi.mock('@/shared/lib/hooks/useUserRepositories', () => ({
  useUserRepositories: () => ({
    fetchRepositories: mockFetchRepositories,
  }),
}));

vi.mock('@/shared/lib/api/github-adapter', () => ({
  gitHubAdapter: {
    getUserDetails: mockGetUserDetails,
  },
}));

vi.mock('@/shared/lib/api/analytics-adapter', () => ({
  analyticsAdapter: {
    sendEvent: mockSendEvent,
  },
}));

vi.mock('@/shared/lib/analytics/factory', () => ({
  SearchEventFactory: {
    createUserViewEvent: vi.fn(() => ({
      type: 'USER_VIEW',
    })),
    toDTO: vi.fn((event) => event),
  },
}));

describe('UserPage', () => {
  const mockUser = {
    login: 'octocat',
    id: 1,
    avatar_url: 'avatar.jpg',
    url: '',
    html_url: '',
    name: 'Octocat',
    company: null,
    blog: '',
    location: 'San Francisco',
    bio: 'GitHub mascot',
    public_repos: 10,
    followers: 100,
    following: 20,
    created_at: '',
    updated_at: '',
  };

  beforeEach(() => {
    vi.mocked(gitHubAdapter.getUserDetails).mockResolvedValue({
      login: 'octocat',
      id: 1,
      avatar_url: 'avatar.jpg',
      url: '',
      html_url: '',
      name: 'Octocat',
      company: null,
      blog: '',
      location: 'Brazil',
      bio: 'Test user',
      public_repos: 10,
      followers: 100,
      following: 50,
      created_at: '',
      updated_at: '',
    });

    vi.clearAllMocks();

    mockGetUserDetails.mockResolvedValue(mockUser);
    mockFetchRepositories.mockResolvedValue([]);
    mockSendEvent.mockResolvedValue({
      success: true,
    });
  });

  it('should render back button', () => {
    render(
      <UserPage
        params={{
          username: 'octocat',
        }}
      />
    );

    expect(screen.getByText('← Voltar aos resultados')).toBeInTheDocument();
  });

  it('should load user details on mount', async () => {
    render(
      <UserPage
        params={{
          username: 'octocat',
        }}
      />
    );

    await waitFor(() => {
      expect(mockGetUserDetails).toHaveBeenCalledWith('octocat');
    });
  });

  it('should fetch repositories on mount', async () => {
    render(
      <UserPage
        params={{
          username: 'octocat',
        }}
      />
    );

    await waitFor(() => {
      expect(mockFetchRepositories).toHaveBeenCalledWith('octocat');
    });
  });

  it('should send analytics event', async () => {
    render(
      <UserPage
        params={{
          username: 'octocat',
        }}
      />
    );

    await waitFor(() => {
      expect(mockSendEvent).toHaveBeenCalled();
    });
  });

  it('should render user information', async () => {
    render(
      <UserPage
        params={{
          username: 'octocat',
        }}
      />
    );

    expect(await screen.findByText('Octocat')).toBeInTheDocument();

    expect(screen.getByText('@octocat')).toBeInTheDocument();

    expect(screen.getByText('GitHub mascot')).toBeInTheDocument();

    expect(screen.getByText('📍 San Francisco')).toBeInTheDocument();
  });

  it('should render followers count', async () => {
    render(
      <UserPage
        params={{
          username: 'octocat',
        }}
      />
    );

    expect(await screen.findByText('100')).toBeInTheDocument();
  });

  it('should render following count', async () => {
    render(
      <UserPage
        params={{
          username: 'octocat',
        }}
      />
    );

    expect(await screen.findByText('20')).toBeInTheDocument();
  });

  it('should render public repositories count', async () => {
    render(
      <UserPage
        params={{
          username: 'octocat',
        }}
      />
    );

    expect(await screen.findByText('10')).toBeInTheDocument();
  });

  it('should render image with correct alt', async () => {
    render(
      <UserPage
        params={{
          username: 'octocat',
        }}
      />
    );

    const image = await screen.findByAltText('octocat');

    expect(image).toBeInTheDocument();
  });

  it('should hide bio when user has no bio', async () => {
    mockGetUserDetails.mockResolvedValue({
      ...mockUser,
      bio: null,
    });

    render(
      <UserPage
        params={{
          username: 'octocat',
        }}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('GitHub mascot')).not.toBeInTheDocument();
    });
  });

  it('should hide location when user has no location', async () => {
    mockGetUserDetails.mockResolvedValue({
      ...mockUser,
      location: null,
    });

    render(
      <UserPage
        params={{
          username: 'octocat',
        }}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText(/📍/)).not.toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockGetUserDetails.mockRejectedValue(new Error('API Error'));

    render(
      <UserPage
        params={{
          username: 'octocat',
        }}
      />
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('should create back link with query parameter', () => {
    render(
      <UserPage
        params={{
          username: 'octocat',
        }}
      />
    );

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', '/results?q=octocat');
  });
});
