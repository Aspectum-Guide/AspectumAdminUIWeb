import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PageHeader from './PageHeader';

describe('PageHeader', () => {
  it('lets the actions wrap under the title on narrow screens', () => {
    const { container } = render(
      <PageHeader title="Servers" actions={<button type="button">Add server</button>} />,
    );

    expect(screen.getByRole('heading', { name: 'Servers' })).toBeTruthy();
    expect(container.firstChild.className).toContain('flex-wrap');
    expect(screen.getByRole('button', { name: 'Add server' })).toBeTruthy();
  });
});
