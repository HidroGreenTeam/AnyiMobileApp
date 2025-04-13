import 'package:ayni_mobile_app/shared/utils/colors.dart';
import 'package:flutter/material.dart';

class IrrigationHistoryModal extends StatelessWidget {
  final List<Map<String, String>> history;

  const IrrigationHistoryModal({super.key, required this.history});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Irrigation history',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 24),
          Table(
            border: TableBorder.all(color: Colors.transparent),
            children: [
              TableRow(
                decoration: BoxDecoration(color: colors["color-light-green"]),
                children: const [
                  Padding(
                    padding: EdgeInsets.all(8.0),
                    child: Text('Date',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                  Padding(
                    padding: EdgeInsets.all(8.0),
                    child: Text('Status',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              ...history.map((entry) {
                return TableRow(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(entry['date'] ?? ''),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(entry['status'] ?? ''),
                    ),
                  ],
                );
              }),
            ],
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(),
            style: ElevatedButton.styleFrom(
              backgroundColor: colors["color-main-green"],
              padding: const EdgeInsets.symmetric(vertical: 12.0),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(6)),
            ),
            child: SizedBox(
              width: double.infinity,
              child: Center(
                child: Text(
                  "Ok",
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
    );
  }
}
