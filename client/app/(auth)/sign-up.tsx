import { COLORS } from "@/constants";
import { useAuth, useSignUp } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { type Href, Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function SignUpScreen() {
    const { signUp, errors, fetchStatus } = useSignUp();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [code, setCode] = useState("");

    const handleSubmit = async () => {
        const { error } = await signUp.password({
            emailAddress,
            password,
            firstName,
            lastName,
        });

        if (error) {
            console.error(JSON.stringify(error, null, 2));
            return;
        }

        if (!error) await signUp.verifications.sendEmailCode();
    };

    const handleVerify = async () => {
        await signUp.verifications.verifyEmailCode({ code });

        if (signUp.status === "complete") {
            await signUp.finalize({
                navigate: ({ session, decorateUrl }) => {
                    if (session?.currentTask) {
                        console.log(session?.currentTask);
                        return;
                    }
                    const url = decorateUrl("/");
                    router.push(url as Href);
                },
            });
        } else {
            console.error("Sign-up attempt not complete:", signUp);
        }
    };

    if (signUp.status === "complete" || isSignedIn) {
        return null;
    }

    if (
        signUp.status === "missing_requirements" &&
        signUp.unverifiedFields.includes("email_address") &&
        signUp.missingFields.length === 0
    ) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center" style={{ padding: 28 }}>
                <TouchableOpacity onPress={() => router.back()} className="absolute top-12 z-10">
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>

                <View className="items-center mb-8">
                    <Text className="text-3xl font-bold text-primary mb-2">Verify Email</Text>
                    <Text className="text-secondary text-center">Enter the code sent to your email</Text>
                </View>

                <View className="mb-6">
                    <TextInput
                        className="w-full bg-surface p-4 rounded-xl text-primary text-center tracking-widest"
                        placeholder="123456"
                        placeholderTextColor="#999"
                        keyboardType="number-pad"
                        value={code}
                        onChangeText={setCode}
                    />
                    {errors.fields.code && (
                        <Text className="text-red-500 text-xs mt-1">{errors.fields.code.message}</Text>
                    )}
                </View>

                <TouchableOpacity
                    className={`w-full py-4 rounded-full items-center mb-4 ${fetchStatus === "fetching" || !code ? "bg-gray-300" : "bg-primary"}`}
                    onPress={handleVerify}
                    disabled={fetchStatus === "fetching" || !code}
                >
                    <Text className="text-white font-bold text-lg">Verify</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="w-full py-4 rounded-full items-center border border-primary"
                    onPress={() => signUp.verifications.sendEmailCode()}
                >
                    <Text className="text-primary font-bold">Resend Code</Text>
                </TouchableOpacity>

                {/* Required for Clerk bot protection */}
                <View nativeID="clerk-captcha" />
            </SafeAreaView>
        );
    }

    return (
    <SafeAreaView className="flex-1 bg-white" >
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
        >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 28 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                        <SafeAreaView className="flex-1 bg-white justify-center" style={{ padding: 28 }}>
            <TouchableOpacity onPress={() => router.push("/")} className="absolute top-12 z-10">
                <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <View className="items-center mb-8">
                <Text className="text-3xl font-bold text-primary mb-2">Create Account</Text>
                <Text className="text-secondary">Sign up to get started</Text>
            </View>

            <View className="mb-4">
                <Text className="text-primary font-medium mb-2">First Name</Text>
                <TextInput
                    className="w-full bg-surface p-4 rounded-xl text-primary"
                    placeholder="John"
                    placeholderTextColor="#999"
                    value={firstName}
                    onChangeText={setFirstName}
                />
            </View>

            <View className="mb-4">
                <Text className="text-primary font-medium mb-2">Last Name</Text>
                <TextInput
                    className="w-full bg-surface p-4 rounded-xl text-primary"
                    placeholder="Doe"
                    placeholderTextColor="#999"
                    value={lastName}
                    onChangeText={setLastName}
                />
            </View>

            <View className="mb-4">
                <Text className="text-primary font-medium mb-2">Email</Text>
                <TextInput
                    className="w-full bg-surface p-4 rounded-xl text-primary"
                    placeholder="user@example.com"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                />
                {errors.fields.emailAddress && (
                    <Text className="text-red-500 text-xs mt-1">{errors.fields.emailAddress.message}</Text>
                )}
            </View>

            <View className="mb-6">
                <Text className="text-primary font-medium mb-2">Password</Text>
                <TextInput
                    className="w-full bg-surface p-4 rounded-xl text-primary"
                    placeholder="********"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {errors.fields.password && (
                    <Text className="text-red-500 text-xs mt-1">{errors.fields.password.message}</Text>
                )}
            </View>

            <TouchableOpacity
                className={`w-full py-4 rounded-full items-center mb-10 ${!emailAddress || !password || !firstName || !lastName || fetchStatus === "fetching" ? "bg-gray-300" : "bg-primary"}`}
                onPress={handleSubmit}
                disabled={!emailAddress || !password || !firstName || !lastName || fetchStatus === "fetching"}
            >
                <Text className="text-white font-bold text-lg">Continue</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center">
                <Text className="text-secondary">Already have an account? </Text>
                <Link href="/sign-in">
                    <Text className="text-primary font-bold">Login</Text>
                </Link>
            </View>

            {/* Required for Clerk bot protection */}
            <View nativeID="clerk-captcha" />
        </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
);
}