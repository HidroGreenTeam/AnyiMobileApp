import 'package:ayni_mobile_app/home/models/crop.dart';
import 'package:ayni_mobile_app/home/widgets/new_crop_modal.dart';
import 'package:ayni_mobile_app/shared/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class CropsListWidget extends StatefulWidget {
  final List<Crop> cropsList;

  const CropsListWidget({super.key, required this.cropsList});

  @override
  State<CropsListWidget> createState() => _CropsListWidgetState();
}

class _CropsListWidgetState extends State<CropsListWidget> {
  void _navigateToCropDetails(Crop crop) {
    context.go("/home/irrigation/${crop.id}", extra: crop);
  }

  void _displayAddCropForm() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
      ),
      builder: (context) => const AddCropModal(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Padding(
                padding: const EdgeInsets.only(right: 12),
                child: SizedBox(
                  height: 30,
                  width: 30,
                  child: Image.asset(
                    "assets/images/app_icons/crop_icon.png",
                  ),
                ),
              ),
              Text(
                "Crops",
                style: TextStyle(
                  fontSize: 20,
                  color: colors["color-text-black"],
                  fontWeight: FontWeight.w900,
                ),
              ),
            ],
          ),
          const SizedBox(
            height: 18,
          ),
          Flexible(
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2, // Número de columnas
                crossAxisSpacing: 12, // Espacio entre columnas
                mainAxisSpacing: 12, // Espacio entre filas
              ),
              itemCount: widget.cropsList.length + 1,
              itemBuilder: (context, index) {
                if (index < widget.cropsList.length) {
                  final crop = widget.cropsList[index];
                  return CropCardWidget(
                    crop: crop,
                    onTap: () => _navigateToCropDetails(crop),
                  );
                } else {
                  return CropCardWidget(
                    crop: Crop(id: 999, name: "Add crop"),
                    onTap: () => _displayAddCropForm(),
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}

class CropCardWidget extends StatelessWidget {
  final Crop crop;
  final VoidCallback onTap;

  const CropCardWidget({
    super.key,
    required this.crop,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        color: colors["color-light-green"],
        elevation: 2,
        child: SizedBox(
          height: 156,
          width: 156,
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                SizedBox(
                  height: 72,
                  width: 72,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      color: colors["color-white"],
                      borderRadius: const BorderRadius.all(
                        Radius.circular(50),
                      ),
                    ),
                  ),
                ),
                Text(
                  crop.name,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
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
