import { describe, expect, it } from 'vitest';

import { getURL } from './get-url';

describe('getURL', () => {
  it('returns localhost by default', () => {
    expect(getURL()).toBe('http://localhost:3000');
  });

  it('appends path', () => {
    expect(getURL('/pricing')).toBe('http://localhost:3000/pricing');
  });

  it('strips leading slashes from path', () => {
    expect(getURL('///pricing')).toBe('http://localhost:3000/pricing');
  });
});
