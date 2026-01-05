import { useIsMobile } from "@/hooks/use-is-mobile";

/**
 * A responsive container component that renders different content based on device type
 * @param {Object} props
 * @param {React.ReactNode} props.mobileContent - Content to render on mobile devices
 * @param {React.ReactNode} props.desktopContent - Content to render on desktop devices
 * @param {React.ReactNode} [props.children] - Fallback content
 * @returns {React.ReactNode}
 */
export function ResponsiveContainer({ mobileContent, desktopContent, children }) {
  const isMobile = useIsMobile();

  if (mobileContent && desktopContent) {
    return isMobile ? mobileContent : desktopContent;
  }

  return children || null;
}

/**
 * A hook that returns different values based on device type
 * @param {*} mobileValue - Value to return on mobile devices
 * @param {*} desktopValue - Value to return on desktop devices
 * @returns {*} The appropriate value based on device type
 */
export function useResponsiveValue(mobileValue, desktopValue) {
  const isMobile = useIsMobile();
  return isMobile ? mobileValue : desktopValue;
}

/**
 * A hook that returns different functions based on device type
 * @param {Function} mobileFunction - Function to return on mobile devices
 * @param {Function} desktopFunction - Function to return on desktop devices
 * @returns {Function} The appropriate function based on device type
 */
export function useResponsiveFunction(mobileFunction, desktopFunction) {
  const isMobile = useIsMobile();
  return isMobile ? mobileFunction : desktopFunction;
}
