import 'package:ayni_mobile_app/shared/utils/colors.dart';
import 'package:ayni_mobile_app/shared/utils/input_field_decoration.dart';
import 'package:flutter/material.dart';

class DateFieldWidget extends StatefulWidget {
  final TextEditingController controller;
  final String labelText;
  final String? Function(String?)? validator;

  const DateFieldWidget({
    super.key,
    required this.controller,
    required this.labelText,
    this.validator,
  });

  @override
  State<DateFieldWidget> createState() => _DateFieldWidgetState();
}

class _DateFieldWidgetState extends State<DateFieldWidget> {
  bool _hasErrors = false;

  Theme _buildDatePickerDecoration(context, child) {
    return Theme(
      data: Theme.of(context).copyWith(
        colorScheme: ColorScheme.light(
          primary: colors["color-main-green"]!,
          onPrimary: colors["color-white"]!,
          onSurface: colors["color-black"]!,
        ),
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
              backgroundColor: colors["color-light-green"]!),
        ),
      ),
      child: child!,
    );
  }

  Future<void> _selectDate() async {
    DateTime? picked = await showDatePicker(
        context: context,
        initialDate: DateTime.now(),
        firstDate: DateTime(2020),
        lastDate: DateTime(2050),
        builder: (context, child) =>
            _buildDatePickerDecoration(context, child));

    if (picked != null) {
      // Convert formatDatetime to dd-mm-yyyy
      setState(() {
        widget.controller.text = picked
            .toString()
            .split(" ")[0]
            .split("-")
            .reversed
            .toList()
            .join("-");
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: widget.controller,
      readOnly: true,
      onTap: () {
        _selectDate();
      },
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
