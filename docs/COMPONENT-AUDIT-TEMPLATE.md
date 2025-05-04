# Component Audit Template

Use this template to audit each component in the codebase. Copy this template for each component and fill in the details.

## Component Information

- **Component Name:** [ComponentName]
- **File Path:** [Path/to/ComponentName.tsx]
- **Type:** [Client/Server]
- **Purpose:** [Brief description of the component's purpose]
- **Usage Locations:** [List where this component is used]

## Code Quality Assessment

### TypeScript & Props

- [ ] Uses proper TypeScript interfaces for props
- [ ] Properly handles optional props with defaults
- [ ] Uses proper typing for event handlers
- [ ] Avoids use of `any` type

### State Management

- [ ] Uses appropriate state management (useState, useReducer, Zustand, etc.)
- [ ] Properly initializes state
- [ ] Handles side effects properly with useEffect
- [ ] Avoids unnecessary state updates

### Performance

- [ ] Properly memoized with React.memo where appropriate
- [ ] Uses useMemo and useCallback for expensive operations
- [ ] Avoids unnecessary re-renders
- [ ] Efficient rendering of lists (key prop, virtualization if needed)

### Accessibility

- [ ] Uses semantic HTML elements
- [ ] Includes proper ARIA attributes
- [ ] Handles keyboard navigation
- [ ] Has appropriate color contrast

### Code Structure

- [ ] Single responsibility principle is followed
- [ ] Logic is properly separated from presentation
- [ ] Size is appropriate (under 300 lines)
- [ ] Code is well-commented

## Issues Identified

1. [Issue 1]
2. [Issue 2]
3. [Issue 3]

## Refactoring Recommendations

1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

## Redundancy Assessment

- **Similar Components:** [List similar components that could be consolidated]
- **Duplicate Logic:** [Identify logic that exists elsewhere]
- **Recommendation:** [Keep/Refactor/Replace/Consolidate]

## Priority

- **Refactoring Priority:** [High/Medium/Low]
- **Justification:** [Why this priority level]

## Notes

[Any additional notes about this component] 