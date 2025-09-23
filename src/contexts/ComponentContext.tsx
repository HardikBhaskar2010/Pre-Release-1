import React, {createContext, useContext, useState, ReactNode} from 'react';
import {Component} from '../services/api';

interface ComponentContextType {
  selectedComponents: Component[];
  inventory: Component[];
  addToInventory: (component: Component) => void;
  removeFromInventory: (componentId: string) => void;
  updateQuantity: (componentId: string, quantity: number) => void;
  clearInventory: () => void;
  isComponentSelected: (componentId: string) => boolean;
  getSelectedComponentNames: () => string[];
}

const ComponentContext = createContext<ComponentContextType | undefined>(undefined);

interface ComponentProviderProps {
  children: ReactNode;
}

export const ComponentProvider: React.FC<ComponentProviderProps> = ({children}) => {
  const [inventory, setInventory] = useState<Component[]>([]);

  const addToInventory = (component: Component) => {
    setInventory(prev => {
      const existing = prev.find(item => item.id === component.id);
      if (existing) {
        // Component already exists, don't add duplicate
        return prev;
      }
      return [...prev, {...component, quantity: 1}];
    });
  };

  const removeFromInventory = (componentId: string) => {
    setInventory(prev => prev.filter(item => item.id !== componentId));
  };

  const updateQuantity = (componentId: string, quantity: number) => {
    setInventory(prev => 
      prev.map(item => 
        item.id === componentId 
          ? {...item, quantity} 
          : item
      )
    );
  };

  const clearInventory = () => {
    setInventory([]);
  };

  const isComponentSelected = (componentId: string): boolean => {
    return inventory.some(item => item.id === componentId);
  };

  const getSelectedComponentNames = (): string[] => {
    return inventory.map(component => component.name);
  };

  const value: ComponentContextType = {
    selectedComponents: inventory,
    inventory,
    addToInventory,
    removeFromInventory,
    updateQuantity,
    clearInventory,
    isComponentSelected,
    getSelectedComponentNames,
  };

  return (
    <ComponentContext.Provider value={value}>
      {children}
    </ComponentContext.Provider>
  );
};

export const useComponents = (): ComponentContextType => {
  const context = useContext(ComponentContext);
  if (context === undefined) {
    throw new Error('useComponents must be used within a ComponentProvider');
  }
  return context;
};