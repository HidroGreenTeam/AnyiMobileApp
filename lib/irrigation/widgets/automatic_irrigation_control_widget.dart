import 'package:ayni_mobile_app/shared/utils/colors.dart';
import 'package:flutter/material.dart';

class AutomaticIrrigationControlWidget extends StatelessWidget {
  final bool isEnabled;
  final ValueChanged<bool> onToggle;

  const AutomaticIrrigationControlWidget({
    super.key,
    required this.isEnabled,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: colors["color-white"],
        borderRadius: BorderRadius.circular(6),
        boxShadow: const [
          BoxShadow(
            color: Color.fromRGBO(18, 18, 18, 0.25),
            offset: Offset(0, 4),
            blurRadius: 6,
          ),
        ],
      ),
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'AUTOMATIC IRRIGATION CONTROL',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Enabled automatic Irrigation'),
              Switch(
                value: isEnabled,
                onChanged: onToggle,
                activeColor: Colors.green,
              ),
            ],
          ),
          SizedBox(height: 8),
          Container(
            padding: EdgeInsets.all(8.0),
            decoration: BoxDecoration(
              color: Colors.lightGreenAccent.withOpacity(0.3),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              'Allow the system to activate irrigation based on soil moisture levels.',
              style: TextStyle(color: Colors.green),
            ),
          ),
        ],
      ),
    );
  }
}
