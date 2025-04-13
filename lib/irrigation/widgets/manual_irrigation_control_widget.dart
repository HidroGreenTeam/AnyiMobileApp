import 'package:ayni_mobile_app/shared/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ManualIrrigationControlWidget extends StatefulWidget {
  final bool isSwitchEnabled;
  final ValueChanged<bool> onToggle;
  final TextEditingController durationController;

  const ManualIrrigationControlWidget(
      {super.key,
      required this.isSwitchEnabled,
      required this.onToggle,
      required this.durationController});

  @override
  State<ManualIrrigationControlWidget> createState() =>
      _ManualIrrigationControlWidgetState();
}

class _ManualIrrigationControlWidgetState
    extends State<ManualIrrigationControlWidget> {
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
            'MANUAL IRRIGATION CONTROL',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Active irrigation'),
              Switch(
                value: widget.isSwitchEnabled,
                onChanged: widget.onToggle,
                activeColor: Colors.green,
              ),
            ],
          ),
          SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Duration"),
              Row(
                children: [
                  TimeInput(
                    durationController: widget.durationController,
                    isSwitchOn: !widget.isSwitchEnabled,
                  ),
                  SizedBox(
                    width: 8,
                  ),
                  Text("minutes"),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class TimeInput extends StatelessWidget {
  const TimeInput({
    super.key,
    required TextEditingController durationController,
    required bool isSwitchOn,
  })  : _durationController = durationController,
        _isSwitchOn = isSwitchOn;

  final TextEditingController _durationController;
  final bool _isSwitchOn;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 64,
      height: 64,
      child: TextField(
        controller: _durationController,
        keyboardType: TextInputType.number,
        inputFormatters: [
          FilteringTextInputFormatter.digitsOnly,
        ],
        enabled: _isSwitchOn,
        decoration: InputDecoration(
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: colors["color-main-green"]!),
          ),
          enabledBorder: OutlineInputBorder(
            borderSide: BorderSide(color: colors["color-main-green"]!),
          ),
        ),
      ),
    );
  }
}
