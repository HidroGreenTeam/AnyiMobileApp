import 'package:ayni_mobile_app/shared/utils/input_field_decoration.dart';
import 'package:flutter/material.dart';

class StringFieldWidget extends StatefulWidget {
  final TextEditingController controller;
  final String labelText;
  final String? Function(String?)? validator;

  const StringFieldWidget({
    super.key,
    required this.controller,
    required this.labelText,
    this.validator,
  });

  @override
  State<StringFieldWidget> createState() => _StringFieldWidgetState();
}

class _StringFieldWidgetState extends State<StringFieldWidget> {
  bool _hasErrors = false;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: widget.controller,
      validator: (value) {
        final error = widget.validator?.call(value);
        setState(() {
          _hasErrors = error != null;
        });
        return error;
      },
      decoration: buildInputFieldDecoration(widget.labelText, _hasErrors),
    );
  }
}
