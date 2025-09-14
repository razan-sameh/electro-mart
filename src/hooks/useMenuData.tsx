
// hooks/useMenuData.ts
"use client";
import { useMemo, useCallback } from 'react';
import {
  FaDesktop,
  FaGamepad,
  FaHeadphones,
  FaCamera,
  FaPrint,
} from "react-icons/fa";
import {
  IoHome,
  IoMusicalNotes,
  IoPhonePortrait,
  IoTabletPortrait,
  IoWatch,
} from "react-icons/io5";

export interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
}

export const useMenuData = () => {
  // Static menu items - could be moved to a separate file
  const menuItems: MenuItem[] = useMemo(() => [
    { id: "computers", icon: <FaDesktop />, label: "Computers", href: "/computers" },
    { id: "cell-phones", icon: <IoPhonePortrait />, label: "Cell phones", href: "/cell-phones" },
    { id: "gaming", icon: <FaGamepad />, label: "Gaming", href: "/gaming" },
    { id: "tablets", icon: <IoTabletPortrait />, label: "Tablets", href: "/tablets" },
    { id: "headphones", icon: <FaHeadphones />, label: "Headphones", href: "/headphones" },
    { id: "speakers", icon: <IoMusicalNotes />, label: "Speakers", href: "/speakers" },
    { id: "cameras", icon: <FaCamera />, label: "Cameras", href: "/cameras" },
    { id: "smart-watch", icon: <IoWatch />, label: "Smart watch", href: "/smart-watch" },
    { id: "printer", icon: <FaPrint />, label: "Printer", href: "/printer" },
    { id: "smart-home", icon: <IoHome />, label: "Smart home", href: "/smart-home" },
    { id: "accessories", icon: <IoMusicalNotes />, label: "Accessories", href: "/accessories" },
  ], []);

  // Utility functions
  const getMenuItemsWithIcons = useCallback((showIcons: boolean = true) => {
    return menuItems.map(item => ({
      ...item,
      icon: showIcons ? item.icon : null
    }));
  }, [menuItems]);

  const getMenuItemsLabelsOnly = useCallback(() => {
    return menuItems.map(({ id, label, href }) => ({ id, label, href }));
  }, [menuItems]);

  // Business logic
  const handleItemClick = useCallback((item: MenuItem) => {
    // Add analytics, logging, etc.
    console.log(`Clicked on ${item.label}`);
    
    // You can add more logic here:
    // - Analytics tracking
    // - User preference saving
    // - Navigation logic
  }, []);

  const getActiveItem = useCallback((pathname: string): MenuItem | null => {
    return menuItems.find(item => item.href === pathname) || null;
  }, [menuItems]);

  const isActiveItem = useCallback((pathname: string, itemId: string): boolean => {
    const activeItem = getActiveItem(pathname);
    return activeItem?.id === itemId;
  }, [getActiveItem]);

  return {
    menuItems,
    getMenuItemsWithIcons,
    getMenuItemsLabelsOnly,
    handleItemClick,
    getActiveItem,
    isActiveItem,
  };
};