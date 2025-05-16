import { TouchableOpacity, View, Text, TextInput } from "react-native";

export default function ForgotPassword() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-2xl font-bold">Forgot Password</Text>
        <Text className="mt-4 text-gray-600">Please enter your email to reset your password.</Text>
        <View className="mt-8 w-full px-4">
            <TextInput
            placeholder="Email"
            className="border border-gray-300 rounded-lg p-2"
            keyboardType="email-address"
            />
            <TouchableOpacity className="mt-4 bg-blue-500 rounded-lg p-2">
            <Text className="text-white text-center">Send Reset Link</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
}