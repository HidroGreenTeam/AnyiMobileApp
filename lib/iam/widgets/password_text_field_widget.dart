import 'package:ayni_mobile_app/shared/utils/colors.dart';
import 'package:flutter/material.dart';

class PasswordTextFieldWidget extends StatefulWidget {
  final TextEditingController controller;
  final String labelText;
  final String? Function(String?)? validator;

  const PasswordTextFieldWidget(
      {super.key,
      required this.controller,
      required this.labelText,
      this.validator});

  @override
  State<PasswordTextFieldWidget> createState() =>
      _PasswordTextFieldWidgetState();
}

class _PasswordTextFieldWidgetState extends State<PasswordTextFieldWidget> {
  bool _isObscureText = true;
  bool _hasErrors = false;

  String? _validatePassword(String? value) {
    if (widget.validator != null) return widget.validator!(value);

    if (value == null || value.isEmpty) {
      return 'Please enter your password';
    } else if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  }

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

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: widget.controller,
      obscureText: _isObscureText,
      validator: (value) {
        final error = _validatePassword.call(value);
        setState(() {
          _hasErrors = error != null;
        });
        return error;
      },
      decoration: InputDecoration(
        labelText: widget.labelText,
        labelStyle: TextStyle(
          color: _hasErrors
              ? colors["color-error-red"]
              : colors["color-main-green"],
        ),
        focusedBorder: _buildBorder(),
        enabledBorder: _buildBorder(),
        errorBorder: _buildErrorBorder(),
        focusedErrorBorder: _buildErrorBorder(),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 24, vertical: 18),
        suffixIcon: Padding(
          padding: const EdgeInsets.only(right: 16.0),
          child: IconButton(
            icon: Icon(
              _isObscureText ? Icons.visibility : Icons.visibility_off,
              color: colors["color-main-green"],
            ),
            onPressed: () {
              setState(() {
                _isObscureText = !_isObscureText;
              });
            },
          ),
        ),
      ),
    );
  }
}
