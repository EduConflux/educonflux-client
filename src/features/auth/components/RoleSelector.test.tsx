import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoleSelector, ROLES_DATA } from './RoleSelector';

describe('RoleSelector Component', () => {
  it('renders all four role options including PARENT and ADMIN', () => {
    const onSelect = vi.fn();
    render(<RoleSelector selectedRole="STUDENT" onSelectRole={onSelect} />);

    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Teacher')).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('Parent')).toBeInTheDocument();
  });

  it('calls onSelectRole when a role option is clicked', () => {
    const onSelect = vi.fn();
    render(<RoleSelector selectedRole="STUDENT" onSelectRole={onSelect} />);

    const parentOption = screen.getByText('Parent');
    fireEvent.click(parentOption);

    expect(onSelect).toHaveBeenCalledWith('PARENT');
  });

  it('contains valid role metadata for all roles', () => {
    expect(ROLES_DATA).toHaveLength(4);
    const parentRole = ROLES_DATA.find((r) => r.id === 'PARENT');
    expect(parentRole).toBeDefined();
    expect(parentRole?.badge).toBe('Guardian');
  });
});
