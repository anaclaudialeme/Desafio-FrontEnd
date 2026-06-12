import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import SearchPage from './page';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('./page.module.scss', () => ({}));

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render page title', () => {
    expect(
      screen.getByText('GitHub User Search'),
    ).toBeInTheDocument();
  });

  it('should render subtitle', () => {
    expect(
      screen.getByText(
        'Encontre os usuários no GitHub e explore seus repositórios',
      ),
    ).toBeInTheDocument();
  });

  it('should render search input', () => {
    expect(
      screen.getByPlaceholderText(
        'Digite o usuário GitHub...',
      ),
    ).toBeInTheDocument();
  });

  it('should render search button', () => {
    expect(
      screen.getByRole('button', {
        name: 'Pesquisar',
      }),
    ).toBeInTheDocument();
  });

  it('should update input value when typing', () => {
    const input = screen.getByPlaceholderText(
      'Digite o usuário GitHub...',
    );

    fireEvent.change(input, {
      target: { value: 'octocat' },
    });

    expect(input).toHaveValue('octocat');
  });

  it('should navigate to results page on valid search', () => {
    const input = screen.getByPlaceholderText(
      'Digite o usuário GitHub...',
    );

    fireEvent.change(input, {
      target: { value: 'octocat' },
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Pesquisar',
      }),
    );

    expect(pushMock).toHaveBeenCalledWith(
      '/results?q=octocat',
    );
  });

  it('should navigate when form is submitted with Enter', () => {
    const input = screen.getByPlaceholderText(
      'Digite o usuário GitHub...',
    );

    fireEvent.change(input, {
      target: { value: 'octocat' },
    });

    fireEvent.submit(input.closest('form')!);

    expect(pushMock).toHaveBeenCalledWith(
      '/results?q=octocat',
    );
  });

  it('should not navigate when input is empty', () => {
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Pesquisar',
      }),
    );

    expect(pushMock).not.toHaveBeenCalled();
  });

  it('should not navigate when input contains only spaces', () => {
    const input = screen.getByPlaceholderText(
      'Digite o usuário GitHub...',
    );

    fireEvent.change(input, {
      target: { value: '     ' },
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Pesquisar',
      }),
    );

    expect(pushMock).not.toHaveBeenCalled();
  });

  it('should encode special characters in query', () => {
    const input = screen.getByPlaceholderText(
      'Digite o usuário GitHub...',
    );

    fireEvent.change(input, {
      target: { value: 'ana cláudia' },
    });

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Pesquisar',
      }),
    );

    expect(pushMock).toHaveBeenCalledWith(
      '/results?q=ana%20cl%C3%A1udia',
    );
  });

  it('should keep autofocus attribute on input', () => {
    const input = screen.getByPlaceholderText(
      'Digite o usuário GitHub...',
    );

    expect(input).toHaveAttribute('autofocus');
  });
});