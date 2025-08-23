import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  container?: Element | string;
  className?: string;
  id?: string;
}

const Portal: React.FC<PortalProps> = ({
  children,
  container,
  className = '',
  id
}) => {
  const [portalRoot, setPortalRoot] = useState<Element | null>(null);

  useEffect(() => {
    let element: Element;

    if (typeof container === 'string') {
      // Find element by selector
      element = document.querySelector(container) || document.body;
    } else if (container instanceof Element) {
      element = container;
    } else {
      // Create or find portal root
      const existingPortalRoot = document.getElementById('portal-root');
      if (existingPortalRoot) {
        element = existingPortalRoot;
      } else {
        element = document.createElement('div');
        element.id = 'portal-root';
        if (className) {
          element.className = className;
        }
        document.body.appendChild(element);
      }
    }

    if (id && !element.id) {
      element.id = id;
    }

    setPortalRoot(element);

    // Cleanup function
    return () => {
      // Only remove if we created it and it's empty
      if (
        element.id === 'portal-root' &&
        element.children.length === 0 &&
        element.parentNode
      ) {
        element.parentNode.removeChild(element);
      }
    };
  }, [container, className, id]);

  if (!portalRoot) {
    return null;
  }

  return createPortal(children, portalRoot);
};

export default Portal;
