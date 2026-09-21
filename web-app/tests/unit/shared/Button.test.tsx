import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '@shared/components'

describe('Button component', () => {
  it('renders button with children label', () => {
    render(<Button>Submit Application</Button>)
    expect(screen.getByRole('button', { name: /submit application/i })).toBeInTheDocument()
  })

  it('handles click events when enabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)

    await user.click(screen.getByRole('button', { name: /click me/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant and size classes', () => {
    const { container } = render(
      <Button variant="secondary" size="lg">
        Cancel
      </Button>
    )
    const btn = container.querySelector('button')
    expect(btn).toHaveClass('btn--secondary')
    expect(btn).toHaveClass('btn--lg')
  })

  it('disables button when disabled or isLoading is true', () => {
    const { rerender } = render(<Button disabled>Disabled Button</Button>)
    expect(screen.getByRole('button', { name: /disabled button/i })).toBeDisabled()

    rerender(<Button isLoading>Loading Button</Button>)
    const button = screen.getByRole('button', { name: /loading button/i })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })
})
