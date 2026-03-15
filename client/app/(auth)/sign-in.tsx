import { COLORS } from "@/constants";
import { useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import { Pressable, TextInput, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Page() {
    const { signIn, errors, fetchStatus } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [code, setCode] = React.useState("");

    const handleSubmit = async () => {
        const { error } = await signIn.password({
            emailAddress,
            password,
        });

        if (error) {

            return;
        }

        if (signIn.status === "complete") {
            await signIn.finalize({
                navigate: ({ session, decorateUrl }) => {
                    if (session?.currentTask) {
                        console.log(session?.currentTask);
                        return;
                    }
                    const url = decorateUrl("/");
                    router.push(url as Href);
                },
            });
        } else if (signIn.status === "needs_client_trust") {
            const emailCodeFactor = signIn.supportedSecondFactors.find(
                (factor) => factor.strategy === "email_code"
            );
            if (emailCodeFactor) {
                await signIn.mfa.sendEmailCode();
            }
        } else {
            console.error("Sign-in attempt not complete:", signIn);
        }
    };

    const handleVerify = async () => {
        await signIn.mfa.verifyEmailCode({ code });

        if (signIn.status === "complete") {
            await signIn.finalize({
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
            console.error("Sign-in attempt not complete:", signIn);
        }
    };

    if (signIn.status === "needs_client_trust") {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="px-7 pt-4 pb-2 z-10">
                    <TouchableOpacity onPress={() => signIn.reset()} className="w-10 h-10 justify-center">
                        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <ScrollView 
                        contentContainerStyle={{ flexGrow: 1 , justifyContent: 'center'}}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="px-7 pb-10">
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
                                {errors?.fields?.code && (
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
                                onPress={() => signIn.mfa.sendEmailCode()}
                            >
                                <Text className="text-primary font-bold">Resend Code</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="px-7 pt-4 pb-2 z-10">
                <TouchableOpacity onPress={() => router.push("/")} className="w-10 h-10 justify-center">
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "padding"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'}}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className=" px-7 pb-10">
                        <View className="items-center mb-8">
                            <Text className="text-3xl font-bold text-primary mb-2">Welcome Back</Text>
                            <Text className="text-secondary">Sign in to continue</Text>
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
                            {errors?.fields?.identifier && (
                                <Text className="text-red-500 text-xs mt-1">{errors.fields.identifier.message}</Text>
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
                            {errors?.fields?.password && (
                                <Text className="text-red-500 text-xs mt-1">{errors.fields.password.message}</Text>
                            )}
                        </View>

                        <TouchableOpacity
                            className={`w-full py-4 rounded-full items-center mb-10 ${!emailAddress || !password || fetchStatus === "fetching" ? "bg-gray-300" : "bg-primary"}`}
                            onPress={handleSubmit}
                            disabled={!emailAddress || !password || fetchStatus === "fetching"}
                        >
                            <Text className="text-white font-bold text-lg">Sign In</Text>
                        </TouchableOpacity>

                        <View className="flex-row justify-center mt-auto">
                            <Text className="text-secondary">Don&apos;t have an account? </Text>
                            <Link href="/sign-up">
                                <Text className="text-primary font-bold">Sign up</Text>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}