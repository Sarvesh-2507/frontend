// Higher Order Components
export { default as withBackButton } from './withBackButton';
export { default as withLoading } from './withLoading';
export { default as withErrorBoundary } from './withErrorBoundary';
export { default as withAuth } from './withAuth';

// Utility function to compose multiple HOCs
export const compose = (...hocs: Array<(component: any) => any>) => 
  (component: any) => hocs.reduceRight((acc, hoc) => hoc(acc), component);

// Common HOC combinations
export const withAuthAndLoading = (options: any = {}) =>
  compose(
    withAuth,
    withLoading
  );

export const withAuthAndErrorBoundary = (options: any = {}) =>
  compose(
    withAuth,
    withErrorBoundary
  );

export const withFullProtection = (options: any = {}) =>
  compose(
    withAuth,
    withErrorBoundary,
    withLoading,
    withBackButton
  );
