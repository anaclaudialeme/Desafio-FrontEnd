import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ResultsPage from './page';
import { useSearchUsers } from '@/shared/lib/hooks/useSearchUsers';
import { useSearchParams } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: any) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock('./page.module.scss', () => ({}));

vi.mock('@/shared/lib/hooks/useSearchUsers', () => ({
  useSearchUsers: vi.fn(),
}));

const mockSearch = vi.fn();

const mockUsers = [
  {
    id: 1,
    login: 'user1',
    name: 'Ana',
    avatar_url: 'avatar1.jpg',
    bio: 'Frontend Developer',
    followers: 100,
    following: 50,
    location: 'São Paulo',
    primaryRepository: {
      name: 'repo-a',
      stars: 200,
    },
  },
  {
    id: 2,
    login: 'user2',
    name: 'Bruno',
    avatar_url: 'avatar2.jpg',
    bio: 'Backend Developer',
    followers: 80,
    following: 20,
    location: 'Rio',
    primaryRepository: {
      name: 'repo-b',
      stars: 50,
    },
  },
];

describe('ResultsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useSearchParams as any).mockReturnValue({
      get: vi.fn().mockReturnValue('octocat'),
    });
  });

  it('should call search on mount', async () => {
    (useSearchUsers as any).mockReturnValue({
      users: [],
      loading: false,
      error: null,
      search: mockSearch,
    });

    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith('octocat');
    });
  });

  it('should render loading state', () => {
    (useSearchUsers as any).mockReturnValue({
      users: [],
      loading: true,
      error: null,
      search: mockSearch,
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render error state', () => {
    (useSearchUsers as any).mockReturnValue({
      users: [],
      loading: false,
      error: 'Erro de API',
      search: mockSearch,
    });

    expect(screen.getByText(/Erro de API/i)).toBeInTheDocument();
  });

  it('should retry search when button is clicked', () => {
    (useSearchUsers as any).mockReturnValue({
      users: [],
      loading: false,
      error: 'Erro',
      search: mockSearch,
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: /tentar novamente/i,
      }),
    );

    expect(mockSearch).toHaveBeenCalledWith('octocat');
  });

  it('should render empty state', () => {
    (useSearchUsers as any).mockReturnValue({
      users: [],
      loading: false,
      error: null,
      search: mockSearch,
    });

    expect(
      screen.getByText(/Nenhum usuário encontrado/i),
    ).toBeInTheDocument();
  });

  it('should render users list', () => {
    (useSearchUsers as any).mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
      search: mockSearch,
    });

    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Bruno')).toBeInTheDocument();

    expect(screen.getByText('⭐ 200 estrelas')).toBeInTheDocument();
    expect(screen.getByText('⭐ 50 estrelas')).toBeInTheDocument();
  });

  it('should show user count', () => {
    (useSearchUsers as any).mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
      search: mockSearch,
    });

    expect(
      screen.getByText('2 usuários encontrados'),
    ).toBeInTheDocument();
  });

  it('should change sort type', () => {
    (useSearchUsers as any).mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
      search: mockSearch,
    });

    const select = screen.getByRole('combobox');

    fireEvent.change(select, {
      target: { value: 'name' },
    });

    expect(select).toHaveValue('name');
  });

  it('should toggle sort order', () => {
    (useSearchUsers as any).mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
      search: mockSearch,
    });

    const button = screen.getByRole('button', {
      name: /↓ decrescente/i,
    });

    fireEvent.click(button);

    expect(
      screen.getByRole('button', {
        name: /↑ crescente/i,
      }),
    ).toBeInTheDocument();
  });

  it('should render query text', () => {
    (useSearchUsers as any).mockReturnValue({
      users: [],
      loading: false,
      error: null,
      search: mockSearch,
    });

    expect(
      screen.getByText(/Resultado para:/i),
    ).toBeInTheDocument();

    expect(screen.getByText('octocat')).toBeInTheDocument();
  });
});