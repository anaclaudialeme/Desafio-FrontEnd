import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API_BASE_URL = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_API_KEY || '';

/**
 * GET /api/users/[username]
 * Proxy endpoint to get GitHub user details
 */
export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const { username } = params;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const url = `${GITHUB_API_BASE_URL}/users/${username}`;

    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };

    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_API_BASE_URL}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
