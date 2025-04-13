import 'package:ayni_mobile_app/home/models/crop.dart';
import 'package:ayni_mobile_app/home/screens/home_view.dart';
import 'package:ayni_mobile_app/iam/screens/login_view.dart';
import 'package:ayni_mobile_app/iam/screens/register_view.dart';
import 'package:ayni_mobile_app/irrigation/screens/irrigation_view.dart';
import 'package:ayni_mobile_app/profile/screens/profile_view.dart';
import 'package:go_router/go_router.dart';

final routes = GoRouter(
  initialLocation: "/login",
  routes: <GoRoute>[
    GoRoute(
      path: '/login',
      name: "login_view",
      builder: (context, state) => const LoginView(),
    ),
    GoRoute(
      path: '/register',
      name: "register_view",
      builder: (context, state) => const RegisterView(),
    ),
    GoRoute(
      path: '/home',
      name: "home_view",
      builder: (context, state) => const HomeView(),
    ),
    GoRoute(
      path: '/profile',
      name: "profile_view",
      builder: (context, state) => const ProfileView(),
    ),
    GoRoute(
      path: '/home/irrigation/:id',
      name: "irrigation_view",
      builder: (context, state) {
        final id = state.pathParameters["id"]!;
        final crop = state.extra as Crop;
        return IrrigationView(crop: crop);
      },
    )
  ],
);
