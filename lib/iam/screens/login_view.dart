import 'package:ayni_mobile_app/iam/widgets/auth_text_field_widget.dart';
import 'package:ayni_mobile_app/iam/widgets/checkbox_widget.dart';
import 'package:ayni_mobile_app/iam/widgets/password_text_field_widget.dart';
import 'package:ayni_mobile_app/shared/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class LoginView extends StatefulWidget {
  const LoginView({super.key});

  @override
  State<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _isCheckedRememberMe = false;

  String? _validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your email';
    }
    // Verificar formato de correo electrónico
    if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
      return 'Enter a valid email address';
    }
    return null; // Si es válido, devuelve null
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      context.goNamed("home_view");
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        body: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(
                height: 100,
                child: Text(
                  "Login",
                  style: TextStyle(
                    fontSize: 38,
                    fontWeight: FontWeight.w900,
                    color: colors["color-main-green"],
                  ),
                ),
              ),
              Form(
                key: _formKey,
                child: Column(
                  children: [
                    SizedBox(
                      height: 190,
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          AuthTextFieldWidget(
                            controller: _emailController,
                            labelText: "Email",
                            validator: _validateEmail,
                          ),
                          PasswordTextFieldWidget(
                            controller: _passwordController,
                            labelText: "Password",
                          ),
                        ],
                      ),
                    ),
                    CheckboxWidget(
                      value: _isCheckedRememberMe,
                      onChanged: (bool? val) {
                        setState(() {
                          _isCheckedRememberMe = val!;
                        });
                      },
                      text: "Remember me",
                    ),
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
                            "Log in",
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: colors["color-white"],
                            ),
                          ),
                        ),
                      ),
                    ),
                    TextButton(
                      onPressed: () => {},
                      child: Text(
                        "Forgot password?",
                        style: TextStyle(
                          fontSize: 13,
                          color: colors["color-50-black"],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: Row(
                  children: [
                    Expanded(
                      child: Container(
                        height: 1, // Altura de la línea
                        color: Colors.grey, // Color de la línea
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(
                          horizontal: 8.0), // Espacio alrededor del texto
                      child: Text(
                        'or',
                        style: TextStyle(
                          fontSize: 14,
                          color: Color(0xFF121212), // Color del texto
                        ),
                      ),
                    ),
                    Expanded(
                      child: Container(
                        height: 1, // Altura de la línea
                        color: Colors.grey, // Color de la línea
                      ),
                    ),
                  ],
                ),
              ),
              Column(
                children: [
                  ElevatedButton(
                    onPressed: () => {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colors["color-light-green"],
                      padding: const EdgeInsets.symmetric(vertical: 16.0),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                    child: SizedBox(
                      width: double.infinity,
                      child: Center(
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Image.asset(
                              'assets/images/google-logo.png',
                              height: 22,
                            ),
                            const SizedBox(width: 10),
                            Text(
                              "Log in using Gmail",
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w400,
                                color: colors["color-black"],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(0, 12, 0, 0),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          "Don't you have an account?",
                          style: TextStyle(
                            fontSize: 13,
                            color: colors["color-50-black"],
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            context.goNamed("register_view");
                          },
                          child: Text(
                            "Register",
                            style: TextStyle(
                              fontSize: 13,
                              color: colors["color-50-black"],
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
