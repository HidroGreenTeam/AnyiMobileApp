import 'package:ayni_mobile_app/shared/utils/colors.dart';
import 'package:ayni_mobile_app/shared/widgets/text_fields/date_field_widget.dart';
import 'package:ayni_mobile_app/shared/widgets/text_fields/number_field_widget.dart';
import 'package:ayni_mobile_app/shared/widgets/text_fields/string_field_widget.dart';
import 'package:flutter/material.dart';

class AddCropModal extends StatefulWidget {
  const AddCropModal({super.key});

  @override
  State<AddCropModal> createState() => _AddCropModalState();
}

class _AddCropModalState extends State<AddCropModal> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _cropNameController = TextEditingController();
  final TextEditingController _areaController = TextEditingController();
  final TextEditingController _plantingDateController = TextEditingController();

  String? _validateCropName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter the crop name';
    }
    return null;
  }

  String? _validateCropArea(String? value) {
    if (value == null || value.isEmpty || double.parse(value) <= 0) {
      return 'Please enter a valid area';
    }
    return null;
  }

  String? _validatePlantingDate(String? value) {
    if (value == null || value.isEmpty) {
      return "Please enter a valid date";
    }

    final dateParts = value.split('-');

    final day = int.tryParse(dateParts[0]);
    final month = int.tryParse(dateParts[1]);
    final year = int.tryParse(dateParts[2]);

    try {
      final inputDate = DateTime(year!, month!, day!);
      final currentDate = DateTime.now();

      if (inputDate.isAfter(currentDate)) {
        return "The date must be before today";
      }
    } catch (e) {
      return "Invalid date";
    }

    return null;
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      Navigator.of(context).pop();
      showSuccessBottomSheet(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  "Add new crop",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 24),
                StringFieldWidget(
                  controller: _cropNameController,
                  labelText: "Crop name",
                  validator: _validateCropName,
                ),
                const SizedBox(height: 20),
                NumberFieldWidget(
                  controller: _areaController,
                  labelText: "Area (Hectares)",
                  validator: _validateCropArea,
                ),
                const SizedBox(height: 20),
                DateFieldWidget(
                  controller: _plantingDateController,
                  labelText: "Planting date",
                  validator: _validatePlantingDate,
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: _submitForm,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: colors["color-main-green"],
                    padding: const EdgeInsets.symmetric(vertical: 16.0),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  child: SizedBox(
                    width: double.infinity,
                    child: Center(
                      child: Text(
                        "Add crop",
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: colors["color-white"],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

void showSuccessBottomSheet(BuildContext context) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
    ),
    builder: (context) {
      return Container(
        width: MediaQuery.of(context).size.width,
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              height: 48,
              width: 48,
              decoration: const BoxDecoration(
                color: Colors.green,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.check,
                color: Colors.white,
                size: 26,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "Success",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
            ),
            const SizedBox(height: 8),
            const Text(
              "Crop successfully added!",
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: colors["color-main-green"],
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(6),
                ),
              ),
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text(
                "Ok",
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: colors["color-white"],
                ),
              ),
            ),
          ],
        ),
      );
    },
  );
}
