import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, grade, interests } = body;

    // Validate required fields
    if (!name || !email || !grade) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields.' },
        { status: 400 }
      );
    }
    
    // Prepare data for Google Sheets
    const newMemberRow = [
      crypto.randomUUID(),
      name,
      email,
      grade,
      interests.join(', '), // Convert array to comma-separated string
      new Date().toISOString(),
    ];

    // Authenticate with Google
    let rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
    
    if (!rawKey) {
      return NextResponse.json(
        { success: false, message: 'GOOGLE_PRIVATE_KEY is missing' },
        { status: 500 }
      );
    }

    // Clean and strictly format the private key for OpenSSL compatibility
    // 1. Remove literal escaped newlines, quotes, and existing headers to get the raw base64
    const cleanBase64 = rawKey
      .replace(/\\n/g, '\n')
      .replace(/^"(.*)"$/, '$1')
      .replace(/^'(.*)'$/, '$1')
      .replace(/-----BEGIN PRIVATE KEY-----/g, '')
      .replace(/-----END PRIVATE KEY-----/g, '')
      .replace(/\s/g, ''); // Remove all whitespace/newlines

    // 2. Reconstruct the key with standard PEM formatting (64-character lines)
    const matches = cleanBase64.match(/.{1,64}/g);
    const formattedKey = [
      '-----BEGIN PRIVATE KEY-----',
      ...(matches || []),
      '-----END PRIVATE KEY-----',
      '' // Final trailing newline
    ].join('\n');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: formattedKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Append the new row
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'A1:F1', // The range to search for a table, A1 notation is fine
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [newMemberRow],
      },
    });

    return NextResponse.json({ success: true, message: 'Registration successful!' });
    
  } catch (error) {
    console.error('Registration error:', error);
    // Provide a more specific error message if it's a known type
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json(
      { success: false, message: `Failed to register: ${message}` },
      { status: 500 }
    );
  }
}
