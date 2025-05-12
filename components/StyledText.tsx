import { Text, TextProps } from 'react-native';
import { Typography } from '@/constants';

interface StyledTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body';
  weight?: '400' | '500' | '600' | '700';
}

export function StyledText(props: StyledTextProps) {
  const { style, variant = 'body', weight = '400', ...otherProps } = props;
  
  // Determine font family based on weight
  const fontFamily = getFontFamily(weight);
  
  // Get typography styles based on variant
  const variantStyle = getVariantStyle(variant);

  return <Text style={[{ fontFamily }, variantStyle, style]} {...otherProps} />;
}

// Helper function to get the correct font family based on weight
function getFontFamily(weight: string) {
  switch (weight) {
    case '400':
      return 'Nunito_400Regular';
    case '500':
      return 'Nunito_500Medium';
    case '600':
      return 'Nunito_600SemiBold';
    case '700':
      return 'Nunito_700Bold';
    default:
      return 'Nunito_400Regular';
  }
}

// Helper function to get typography styles based on variant
function getVariantStyle(variant: string) {
  switch (variant) {
    case 'h1':
      return {
        fontSize: Typography.h1.fontSize,
        lineHeight: Typography.h1.lineHeight,
      };
    case 'h2':
      return {
        fontSize: Typography.h2.fontSize,
        lineHeight: Typography.h2.lineHeight,
      };
    case 'h3':
      return {
        fontSize: Typography.h3.fontSize,
        lineHeight: Typography.h3.lineHeight,
      };
    case 'h4':
      return {
        fontSize: Typography.h4.fontSize,
        lineHeight: Typography.h4.lineHeight,
      };
    case 'h5':
      return {
        fontSize: Typography.h5.fontSize,
        lineHeight: Typography.h5.lineHeight,
      };
    case 'h6':
      return {
        fontSize: Typography.h6.fontSize,
        lineHeight: Typography.h6.lineHeight,
      };
    case 'body':
    default:
      return {
        fontSize: 16,
        lineHeight: 16 * Typography.lineHeightRatio,
      };
  }
}