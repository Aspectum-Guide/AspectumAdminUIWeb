import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Sidebar from './Sidebar';
import SidebarNav from './SidebarNav';
import SidebarOverlay from './SidebarOverlay';
import SidebarIconButton from './SidebarIconButton';

describe('Sidebar UI primitives', () => {
  it('renders the shell with side and mobile metadata', () => {
    render(
      <Sidebar side="right" mobile expanded={false}>
        <span>Actions</span>
      </Sidebar>
    );

    const sidebar = screen.getByRole('complementary');
    expect(sidebar.getAttribute('data-side')).toBe('right');
    expect(sidebar.getAttribute('data-mobile')).toBe('true');
    expect(sidebar.getAttribute('aria-label')).toBe('Основная навигация');
    expect(sidebar.getAttribute('aria-expanded')).toBe('false');
    expect(sidebar.textContent).toContain('Actions');
  });

  it('renders section labels and delegates item rendering', () => {
    const renderItem = vi.fn((item) => <a key={item.to} href={item.to}>{item.label}</a>);

    render(
      <SidebarNav
        expanded
        sections={[{ title: 'Content', items: [{ label: 'Cities', to: '/cities' }] }]}
        renderItem={renderItem}
      />
    );

    expect(screen.getByText('Content')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Cities' }).getAttribute('href')).toBe('/cities');
    expect(renderItem).toHaveBeenCalledWith(
      { label: 'Cities', to: '/cities' },
      { title: 'Content', items: [{ label: 'Cities', to: '/cities' }] }
    );
  });

  it('closes through the overlay callback', () => {
    const onClick = vi.fn();
    render(<SidebarOverlay onClick={onClick} />);
    screen.getByRole('button', { name: 'Закрыть меню' }).click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders an accessible icon button', () => {
    const onClick = vi.fn();
    render(<SidebarIconButton label="Collapse" onClick={onClick}>←</SidebarIconButton>);
    screen.getByRole('button', { name: 'Collapse' }).click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards extra props to the aside without losing its own attributes', () => {
    const { container } = render(
      <Sidebar id="main-navigation" data-testid="rail" label="Main navigation">
        <span>content</span>
      </Sidebar>,
    );
    const aside = container.querySelector('aside');

    expect(aside.id).toBe('main-navigation');
    expect(aside.getAttribute('data-testid')).toBe('rail');
    expect(aside.getAttribute('data-ui')).toBe('sidebar');
    expect(aside.getAttribute('aria-label')).toBe('Main navigation');
  });
});
