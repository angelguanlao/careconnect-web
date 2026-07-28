import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagInput from '../components/TagInput.jsx';

function setup(tags = [], suggestions = []) {
  const setTags = jest.fn();
  render(
    <TagInput id="tags" label="Add tag" tags={tags} setTags={setTags} suggestions={suggestions} />
  );
  const input = screen.getByRole('combobox');
  return { setTags, input };
}

describe('TagInput', () => {
  it('renders existing tags', () => {
    setup(['Penicillin', 'Latex']);
    expect(screen.getByText('Penicillin')).toBeInTheDocument();
    expect(screen.getByText('Latex')).toBeInTheDocument();
  });

  it('has an accessible aria-label on the input', () => {
    setup();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-label', 'Add tag');
  });

  it('adds a tag on Enter', async () => {
    const { setTags, input } = setup([]);
    await userEvent.type(input, 'Aspirin');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(setTags).toHaveBeenCalledWith(['Aspirin']);
  });

  it('adds a tag on comma', async () => {
    const { setTags, input } = setup([]);
    await userEvent.type(input, 'Iodine');
    fireEvent.keyDown(input, { key: ',' });
    expect(setTags).toHaveBeenCalledWith(['Iodine']);
  });

  it('does not add a duplicate tag (case-insensitive)', async () => {
    const { setTags, input } = setup(['Penicillin']);
    await userEvent.type(input, 'penicillin');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(setTags).not.toHaveBeenCalled();
  });

  it('removes a tag when its × button is clicked', () => {
    const { setTags } = setup(['Penicillin', 'Latex']);
    fireEvent.click(screen.getByLabelText('Remove Penicillin'));
    expect(setTags).toHaveBeenCalledWith(['Latex']);
  });

  it('removes the last tag on Backspace when input is empty', () => {
    const { setTags, input } = setup(['Penicillin', 'Latex']);
    fireEvent.keyDown(input, { key: 'Backspace' });
    expect(setTags).toHaveBeenCalledWith(['Penicillin']);
  });

  it('does not remove a tag on Backspace when input has text', async () => {
    const { setTags, input } = setup(['Penicillin']);
    await userEvent.type(input, 'abc');
    fireEvent.keyDown(input, { key: 'Backspace' });
    expect(setTags).not.toHaveBeenCalled();
  });

  it('adds a tag on blur if the input has a value', () => {
    const { setTags, input } = setup([]);
    fireEvent.change(input, { target: { value: 'Shellfish' } });
    fireEvent.blur(input);
    expect(setTags).toHaveBeenCalledWith(['Shellfish']);
  });

  it('renders suggestions in a datalist', () => {
    setup([], ['Penicillin', 'Latex']);
    expect(document.getElementById('tags-list')).toBeInTheDocument();
    expect(document.querySelector('option[value="Penicillin"]')).toBeInTheDocument();
  });
});
