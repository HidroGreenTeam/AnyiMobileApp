import 'package:ayni_mobile_app/shared/utils/colors.dart';
import 'package:flutter/material.dart';

OutlineInputBorder _buildBorder() {
  return OutlineInputBorder(
    borderSide: BorderSide(color: colors["color-main-green"]!),
    borderRadius: BorderRadius.circular(12),
  );
}

OutlineInputBorder _buildErrorBorder() {
  return OutlineInputBorder(
    borderSide: BorderSide(color: colors["color-error-red"]!),
    borderRadius: BorderRadius.circular(12),
  );
}

InputDecoration buildInputFieldDecoration(String? labelText, bool hasErrors) {
  return InputDecoration(
    labelText: labelText,
    labelStyle: TextStyle(
      color: hasErrors ? colors["color-error-red"] : colors["color-main-green"],
    ),
    focusedBorder: _buildBorder(),
    enabledBorder: _buildBorder(),
    errorBorder: _buildErrorBorder(),
    focusedErrorBorder: _buildErrorBorder(),
    contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 18),
  );
}
