import 'package:ayni_mobile_app/iam/widgets/auth_text_field_widget.dart';
import 'package:ayni_mobile_app/iam/widgets/checkbox_widget.dart';
import 'package:ayni_mobile_app/iam/widgets/password_text_field_widget.dart';
import 'package:ayni_mobile_app/shared/utils/colors.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class RegisterView extends StatefulWidget {
  const RegisterView({super.key});

  @override
  State<RegisterView> createState() => _RegisterViewState();
}

class _RegisterViewState extends State<RegisterView> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastnameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  bool _areTermsAccepted = false;

  String? _validatePersonalData(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter a valid name.';
    }
    if (value.length < 3) {
      return 'Name must be at least 3 characters.';
    }
    return null;
  }

  String? _validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your email';
    }
    if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
      return 'Enter a valid email address';
    }
    return null;
  }

  String? _confirmPassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please confirm your password';
    }
    if (value != _passwordController.text) {
      return "Please, confirm your password correctly";
    }
    return null;
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      print("Register successful");
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        body: SingleChildScrollView(
          child: Container(
            constraints: BoxConstraints(
              minHeight: MediaQuery.of(context).size.height,
            ),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 36),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  height: 56,
                  child: Text(
                    "Register",
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: colors["color-main-green"],
                    ),
                  ),
                ),
                Form(
                  key: _formKey,
                  child: SizedBox(
                    height: 560,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        AuthTextFieldWidget(
                          controller: _firstNameController,
                          labelText: "First name",
                          validator: _validatePersonalData,
                        ),
                        AuthTextFieldWidget(
                          controller: _lastnameController,
                          labelText: "Lastname",
                          validator: _validatePersonalData,
                        ),
                        AuthTextFieldWidget(
                          controller: _emailController,
                          labelText: "Email",
                          validator: _validateEmail,
                        ),
                        PasswordTextFieldWidget(
                          controller: _passwordController,
                          labelText: "Password",
                        ),
                        PasswordTextFieldWidget(
                          controller: _confirmPasswordController,
                          labelText: "Confirm password",
                          validator: _confirmPassword,
                        ),
                        CheckboxWidget(
                          value: _areTermsAccepted,
                          onChanged: (bool? val) {
                            setState(() {
                              _areTermsAccepted = val!;
                            });
                          },
                          text: "I agree with Ayni's Terms & Conditions",
                        ),
                        ElevatedButton(
                          onPressed: _areTermsAccepted ? _submitForm : null,
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
                                "Sign up",
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
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
                                "Sign up using Gmail",
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
                            "Do you have an account?",
                            style: TextStyle(
                              fontSize: 13,
                              color: colors["color-50-black"],
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              context.goNamed("login_view");
                            },
                            child: Text(
                              "Log in",
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
      ),
    );
  }
}
