vi.mock('@/shared/lib/api/github-adapter', () => ({
  gitHubAdapter: {
    getUserDetails: vi.fn(),
  },
}));

export function getMockUsers() {
  return [
    { login: 'octocat', id: 1, avatar_url: '/logo.svg', html_url: 'https://github.com/octocat' }
  ];
}
