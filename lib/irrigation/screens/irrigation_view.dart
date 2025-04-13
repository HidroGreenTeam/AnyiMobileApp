import 'dart:async';

import 'package:ayni_mobile_app/home/models/crop.dart';
import 'package:ayni_mobile_app/irrigation/widgets/automatic_irrigation_control_widget.dart';
import 'package:ayni_mobile_app/irrigation/widgets/irrigation_history_modal.dart';
import 'package:ayni_mobile_app/irrigation/widgets/manual_irrigation_control_widget.dart';
import 'package:ayni_mobile_app/shared/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class IrrigationView extends StatefulWidget {
  final Crop crop;

  const IrrigationView({super.key, required this.crop});

  @override
  State<IrrigationView> createState() => _IrrigationViewState();
}

class _IrrigationViewState extends State<IrrigationView> {
  // Methods to change between automatic and manual irrigation view
  final PageController _pageController = PageController();
  int _currentIndex = 0;

  void _toggleIrrigationView() {
    _pageController.animateToPage(
      (_currentIndex + 1) % 2,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
    setState(() {
      _currentIndex = (_currentIndex + 1) % 2;
    });
  }

  ButtonStyle _buildElevatedButtonDecoration(bool indexConditional) {
    return ElevatedButton.styleFrom(
      backgroundColor:
          indexConditional ? colors["color-main-green"] : colors["color-white"],
      padding: const EdgeInsets.all(16.0),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10.0),
      ),
      elevation: 0,
      side: BorderSide(
        width: 1.5,
        color: colors["color-main-green"]!,
      ),
    );
  }

  // Methods to handle irrigation history modal
  final irrigationHistory = [
    {'date': '2024-09-19 10:00', 'status': 'Started'},
    {'date': '2024-09-19 10:30', 'status': 'Stopped'},
  ];

  void _displayIrrigationHistoryModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
        ),
        child: IrrigationHistoryModal(history: irrigationHistory),
      ),
    );
  }

  // Methods to handle switchs in automatic and manual views
  bool _isAutomaticIrrigationOn = false;
  void _handleAutomaticIrrigationSwitch(bool value) {
    setState(() {
      _isAutomaticIrrigationOn = value;
    });
  }

  bool _isManualIrrigationOn = false;
  final TextEditingController _durationController =
      TextEditingController(text: "0");
  Timer? _timer;
  int _remainingMinutes = 0;

  void _handleManualIrrigationSwitch(bool value) {
    if (_durationController.text.isEmpty) return;

    int durationInMinutes = int.parse(_durationController.text);
    if (durationInMinutes > 0) {
      setState(() {
        _isManualIrrigationOn = value;
      });
    }

    if (value) {
      if (durationInMinutes > 0) {
        _startCountdown(durationInMinutes);
      }
    } else {
      _stopCountdown();
    }
  }

  void _startCountdown(int minutes) {
    setState(() {
      _remainingMinutes = minutes;
      _durationController.text = _remainingMinutes.toString();
    });

    _timer = Timer.periodic(Duration(minutes: 1), (timer) {
      if (_remainingMinutes > 0) {
        setState(() {
          _remainingMinutes--;
          _durationController.text = _remainingMinutes.toString();
        });
      }

      if (_remainingMinutes <= 0) {
        _stopCountdown();
      }
    });
  }

  void _stopCountdown() {
    _timer?.cancel();
    _timer = null;
    setState(() {
      _isManualIrrigationOn = false;
      _durationController.text = "0";
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _durationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        appBar: AppBar(
          backgroundColor: colors["color-light-green"],
          toolbarHeight: 70,
          title: Text(
            widget.crop.name,
            style: TextStyle(
              color: colors["color-text-black"],
              fontSize: 22,
            ),
          ),
          leading: IconButton(
            icon: Icon(
              Icons.arrow_back_ios_new,
              color: colors["color-text-black"],
            ),
            onPressed: () {
              context.goNamed("home_view");
            },
          ),
        ),
        body: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: 20,
            vertical: 20,
          ),
          child: Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _toggleIrrigationView,
                      style: _buildElevatedButtonDecoration(_currentIndex == 0),
                      child: Text(
                        "Automatic",
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                          color: _currentIndex == 0
                              ? colors["color-white"]
                              : colors["color-main-green"],
                        ),
                      ),
                    ),
                  ),
                  SizedBox(
                    width: 12,
                  ),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _toggleIrrigationView,
                      style: _buildElevatedButtonDecoration(_currentIndex != 0),
                      child: Text(
                        "Manual",
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                          color: _currentIndex != 0
                              ? colors["color-white"]
                              : colors["color-main-green"],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 16),
              Expanded(
                child: PageView(
                  controller: _pageController,
                  onPageChanged: (index) {
                    setState(() {
                      _currentIndex = index;
                    });
                  },
                  children: [
                    AutomaticIrrigationControlWidget(
                      isEnabled: _isAutomaticIrrigationOn,
                      onToggle: _handleAutomaticIrrigationSwitch,
                    ),
                    ManualIrrigationControlWidget(
                      isSwitchEnabled: _isManualIrrigationOn,
                      onToggle: _handleManualIrrigationSwitch,
                      durationController: _durationController,
                    )
                  ],
                ),
              ),
              SizedBox(height: 16),
              ElevatedButton(
                onPressed: _displayIrrigationHistoryModal,
                style: ElevatedButton.styleFrom(
                  backgroundColor: colors["color-light-green"],
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10)),
                  elevation: 0,
                ),
                child: SizedBox(
                  width: double.infinity,
                  child: Center(
                    child: Text(
                      "See irrigation history",
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: colors["color-main-green"],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
