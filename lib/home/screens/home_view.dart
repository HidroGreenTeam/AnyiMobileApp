import 'package:ayni_mobile_app/home/models/crop.dart';
import 'package:ayni_mobile_app/home/widgets/crops_list_widget.dart';
import 'package:ayni_mobile_app/home/widgets/weather_widget.dart';
import 'package:ayni_mobile_app/shared/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomeView extends StatefulWidget {
  const HomeView({super.key});

  @override
  State<HomeView> createState() => _HomeViewState();
}

class _HomeViewState extends State<HomeView> {
  Future<List<Crop>> fetchCrops() async {
    // Simulate API call
    final response = await Future.delayed(Duration(seconds: 1), () {
      return [
        {
          "id": 1,
          "name": "Wheat",
        },
        {
          "id": 2,
          "name": "Corn",
        },
      ];
    });

    return response.map<Crop>((json) => Crop.fromJson(json)).toList();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: true,
      child: Scaffold(
        body: FutureBuilder(
          future: fetchCrops(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Center(child: Text('Error: ${snapshot.error}'));
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return Center(child: Text('No crops found.'));
            }

            final crops = snapshot.data!;

            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(bottom: 36),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          height: 48,
                          width: 48,
                          decoration: const BoxDecoration(
                            color: Color(0xFFD9D9D9),
                            shape: BoxShape.circle,
                          ),
                          child: IconButton(
                            icon: Icon(
                              Icons.settings,
                              color: colors["color-50-black"],
                            ),
                            onPressed: () {},
                          ),
                        ),
                        Container(
                          height: 48,
                          width: 48,
                          decoration: const BoxDecoration(
                            color: Color(0xFFD9D9D9),
                            shape: BoxShape.circle,
                          ),
                          child: IconButton(
                            icon: Icon(
                              Icons.person,
                              color: colors["color-50-black"],
                            ),
                            onPressed: () {
                              context.goNamed("profile_view");
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    "Welcome, Aaron",
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: colors["color-black"],
                    ),
                  ),
                  const SizedBox(
                    height: 24,
                  ),
                  const WeatherWidget(),
                  const SizedBox(
                    height: 24,
                  ),
                  CropsListWidget(cropsList: crops),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
