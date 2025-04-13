import 'package:ayni_mobile_app/shared/utils/colors.dart';
import 'package:flutter/material.dart';

class CheckboxWidget extends StatefulWidget {
  final bool value;
  final ValueChanged<bool?> onChanged;
  final String text;

  const CheckboxWidget({
    super.key,
    required this.value,
    required this.onChanged,
    required this.text,
  });

  @override
  State<CheckboxWidget> createState() => _CheckboxWidget();
}

class _CheckboxWidget extends State<CheckboxWidget> {
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Checkbox(
          value: widget.value,
          onChanged: widget.onChanged,
          activeColor: colors["color-main-green"],
        ),
        Expanded(
          child: Text(
            widget.text,
            style: TextStyle(
              fontSize: 14,
              color: colors["color-50-black"],
            ),
          ),
        ),
      ],
    );
  }
}
