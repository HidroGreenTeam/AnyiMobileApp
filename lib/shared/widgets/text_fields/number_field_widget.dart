import 'package:ayni_mobile_app/shared/utils/input_field_decoration.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class NumberFieldWidget extends StatefulWidget {
  final TextEditingController controller;
  final String labelText;
  final String? Function(String?)? validator;

  const NumberFieldWidget({
    super.key,
    required this.controller,
    required this.labelText,
    this.validator,
  });

  @override
  State<NumberFieldWidget> createState() => _NumberFieldWidgetState();
}

class _NumberFieldWidgetState extends State<NumberFieldWidget> {
  bool _hasErrors = false;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: widget.controller,
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      inputFormatters: <TextInputFormatter>[
        FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d*'))
      ],
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
