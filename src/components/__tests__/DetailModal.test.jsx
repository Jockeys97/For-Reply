import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DetailModal from '../DetailModal.jsx';

describe('DetailModal', () => {
  it('opens and focuses close button', () => {
    render(
      <DetailModal title="Test" isOpen onClose={() => {}}>
        <div>Body</div>
      </DetailModal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    const close = screen.getAllByRole('button', { name: /chiudi/i })[1];
    expect(close).toHaveFocus();
  });

  it('closes on button click', () => {
    const onClose = vi.fn();
    render(
      <DetailModal title="Test" isOpen onClose={onClose}>
        <div>Body</div>
      </DetailModal>
    );
    const close = screen.getAllByRole('button', { name: /chiudi/i })[1];
    fireEvent.click(close);
    expect(onClose).toHaveBeenCalled();
  });
});


