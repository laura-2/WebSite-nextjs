import { StyleSheet } from '@src/theme/StyleSheet';
import React from 'react';


interface BoxProps {
  // Vamos resolver esse any depois
  tag: any;
  children: React.ReactNode;
  styleSheet: StyleSheet;
}
export default function Box({ styleSheet, children, tag }: BoxProps) {
  const Tag = tag || 'div';
  return (
    <Tag as={Tag} styleSheet={styleSheet} >
      {children}
    </Tag>
  );
}