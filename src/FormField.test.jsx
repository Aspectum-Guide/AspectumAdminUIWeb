import { render, screen } from '@testing-library/react';
import { createRef, useEffect, useRef } from 'react';
import { describe, expect, it } from 'vitest';
import Checkbox from './Checkbox';
import { Field, Select, Textarea, TextInput } from './FormField';

// React 18 only hands `ref` to function components wrapped in forwardRef; without it the ref
// was silently dropped and callers had to work around the kit.
describe('form controls forward their ref to the native element', () => {
  it('TextInput', () => {
    const ref = createRef();
    render(<TextInput ref={ref} aria-label="Имя" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(screen.getByLabelText('Имя'));
  });

  it('Textarea', () => {
    const ref = createRef();
    render(<Textarea ref={ref} aria-label="Описание" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('Select', () => {
    const ref = createRef();
    render(<Select ref={ref} aria-label="Роль"><option>admin</option></Select>);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('Checkbox', () => {
    const ref = createRef();
    render(<Checkbox ref={ref} aria-label="Включено" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current.type).toBe('checkbox');
  });

  it('a ref can focus the control from an effect (the reason refs are needed)', () => {
    function Autofocus() {
      const ref = useRef(null);
      useEffect(() => { ref.current?.focus(); }, []);
      return <TextInput ref={ref} aria-label="Токен" />;
    }
    render(<Autofocus />);
    expect(document.activeElement).toBe(screen.getByLabelText('Токен'));
  });

  it('keeps the Field wiring (label, description, invalid) when a ref is passed', () => {
    const ref = createRef();
    render(
      <Field label="Имя" error="Обязательно" required>
        <TextInput ref={ref} />
      </Field>,
    );
    const input = screen.getByLabelText(/Имя/);
    expect(ref.current).toBe(input);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('still works without a ref and merges class names', () => {
    render(<TextInput aria-label="Без ref" className="extra-class" />);
    expect(screen.getByLabelText('Без ref').className).toContain('extra-class');
  });
});