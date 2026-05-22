# Contexto Completo del Proyecto CV-CREATOR-APP


================================================
📄 ARCHIVO: .claude\settings.json
================================================

{
  "enabledPlugins": {
    "expo@claude-plugins-official": true
  }
}


================================================
📄 ARCHIVO: .env
================================================

EXPO_PUBLIC_SUPABASE_URL=https://hiqiwvvtwsizmzsxmdso.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_yovHR88YGverzcH9OOTpug_lqOIBjjC

================================================
📄 ARCHIVO: .gitignore
================================================

# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local
.env

# typescript
*.tsbuildinfo

app-example

# generated native folders
/ios
/android


================================================
📄 ARCHIVO: AGENTS.md
================================================

# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.


================================================
📄 ARCHIVO: app\(app)\chat\[roomId].tsx
================================================

import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { Message } from "@features/chat/domain/entities/Message";
import { useChat } from "@features/chat/presentation/hooks/useChat";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { messages, sendMessage, isLoading } = useChat(roomId);
  const user = useAuthStore((s) => s.user);
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) listRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  }, [input, sendMessage]);

  const renderMsg = ({ item }: { item: Message }) => {
    const isOwn = item.userId === user?.id;
    return (
      <View style={[styles.row, isOwn && styles.rowOwn]}>
        <View style={[styles.bubble, isOwn ? styles.own : styles.other]}>
          {!isOwn && <Text style={styles.author}>{item.authorUsername}</Text>}
          <Text style={[styles.text, isOwn && styles.textOwn]}>
            {item.content}
          </Text>
          <Text style={styles.time}>
            {item.createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderMsg}
        contentContainerStyle={{ padding: 12 }}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Escribe..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  row: { flexDirection: "row", marginVertical: 4 },
  rowOwn: { justifyContent: "flex-end" },
  bubble: { maxWidth: "75%", borderRadius: 12, padding: 10 },
  own: { backgroundColor: "#007AFF" },
  other: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e0e0e0" },
  author: { fontSize: 11, fontWeight: "600", color: "#555", marginBottom: 2 },
  text: { fontSize: 15, color: "#000" },
  textOwn: { color: "#fff" },
  time: { fontSize: 10, color: "#aaa", marginTop: 4, alignSelf: "flex-end" },
  inputRow: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: { color: "#fff", fontSize: 16 },
});


================================================
📄 ARCHIVO: app\(app)\index.tsx
================================================

import { Room } from "@features/chat/domain/entities/Message";
import { useRooms } from "@features/chat/presentation/hooks/useRooms";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RoomsScreen() {
  const { rooms, isLoading, createRoom, isCreating, createError } = useRooms();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [roomName, setRoomName] = useState("");

  const handleCreate = () => {
    if (!roomName.trim() || isCreating) return;
    createRoom(roomName.trim(), {
      onSuccess: () => {
        setRoomName("");
        setModalVisible(false);
      },
    });
  };

  const renderRoom = ({ item }: { item: Room }) => (
    <TouchableOpacity
      style={styles.roomItem}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <Text style={styles.roomName}># {item.name}</Text>
      <Text style={styles.roomDate}>{item.createdAt.toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rooms}
        keyExtractor={(r) => r.id}
        renderItem={renderRoom}
        contentContainerStyle={rooms.length === 0 ? { flex: 1 } : undefined}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.empty}>No hay salas aún. ¡Crea una!</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Nueva sala</Text>
            {createError && <Text style={styles.dialogError}>{createError}</Text>}
            <TextInput
              style={styles.dialogInput}
              placeholder="Nombre de la sala"
              value={roomName}
              onChangeText={setRoomName}
              autoFocus
              maxLength={50}
            />
            <View style={styles.dialogActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.createBtn, isCreating && { opacity: 0.6 }]}
                onPress={handleCreate}
                disabled={isCreating}
              >
                {isCreating ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.createText}>Crear</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { color: "#999", fontSize: 16 },
  roomItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomName: { fontSize: 16, fontWeight: "600" },
  roomDate: { fontSize: 12, color: "#999" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 28,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: { color: "#fff", fontSize: 28, lineHeight: 32 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  dialog: { backgroundColor: "#fff", borderRadius: 12, padding: 20 },
  dialogTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  dialogError: { color: "red", fontSize: 13, marginBottom: 8 },
  dialogInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  dialogActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  cancelBtn: { padding: 10 },
  cancelText: { color: "#666", fontSize: 15 },
  createBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  createText: { color: "#fff", fontWeight: "600", fontSize: 15 },
});



================================================
📄 ARCHIVO: app\(app)\_layout.tsx
================================================

import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { Stack } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export default function AppLayout() {
  const { logout } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#007AFF" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Salas de Chat",
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={{ marginRight: 4 }}>
              <Text style={{ color: "#fff", fontSize: 14 }}>Salir</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="chat/[roomId]" options={{ title: "Chat" }} />
    </Stack>
  );
}



================================================
📄 ARCHIVO: app\(auth)\login.tsx
================================================

import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido 👋</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => login({ email, password })}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Ingresar</Text>
        )}
      </TouchableOpacity>
      <Link href="/(auth)/register" style={styles.link}>
        ¿No tienes cuenta? Regístrate
      </Link>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  error: { color: "red", marginBottom: 12, textAlign: "center" },
  link: { marginTop: 16, textAlign: "center", color: "#007AFF" },
});


================================================
📄 ARCHIVO: app\(auth)\register.tsx
================================================

import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { register, isLoading, error } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Usuario (sin espacios)"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña (mín. 6 caracteres)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => register({ email, password, username })}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>
      <Link href="/(auth)/login" style={styles.link}>
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  error: { color: "red", marginBottom: 12, textAlign: "center" },
  link: { marginTop: 16, textAlign: "center", color: "#007AFF" },
});


================================================
📄 ARCHIVO: app\(auth)\_layout.tsx
================================================

import { Stack } from "expo-router";

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}


================================================
📄 ARCHIVO: app\_layout.tsx
================================================

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { AuthProvider } from '@features/auth/presentation/providers/AuthProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
      staleTime: 30_000,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </QueryClientProvider>
  );
}

================================================
📄 ARCHIVO: app.json
================================================

{
  "expo": {
    "name": "MI-CHAT-APP",
    "slug": "MI-CHAT-APP",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "michatapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      "expo-secure-store"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}


================================================
📄 ARCHIVO: CLAUDE.md
================================================

@AGENTS.md


================================================
📄 ARCHIVO: components\external-link.tsx
================================================

import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}


================================================
📄 ARCHIVO: components\haptic-tab.tsx
================================================

import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}


================================================
📄 ARCHIVO: components\hello-wave.tsx
================================================

import Animated from 'react-native-reanimated';

export function HelloWave() {
  return (
    <Animated.Text
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}>
      👋
    </Animated.Text>
  );
}


================================================
📄 ARCHIVO: components\parallax-scroll-view.tsx
================================================

import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor, flex: 1 }}
      scrollEventThrottle={16}>
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
          headerAnimatedStyle,
        ]}>
        {headerImage}
      </Animated.View>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});


================================================
📄 ARCHIVO: components\themed-text.tsx
================================================

import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});


================================================
📄 ARCHIVO: components\themed-view.tsx
================================================

import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}


================================================
📄 ARCHIVO: components\ui\collapsible.tsx
================================================

import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});


================================================
📄 ARCHIVO: components\ui\icon-symbol.ios.tsx
================================================

import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}


================================================
📄 ARCHIVO: components\ui\icon-symbol.tsx
================================================

// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}


================================================
📄 ARCHIVO: constants\theme.ts
================================================

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});


================================================
📄 ARCHIVO: env.d.ts
================================================

declare const process: {
env: {
    readonly EXPO_PUBLIC_SUPABASE_URL: string;
    readonly EXPO_PUBLIC_ANON_KEY: string;
    readonly [key: string]: string | undefined;
};
};

================================================
📄 ARCHIVO: eslint.config.js
================================================

// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);


================================================
📄 ARCHIVO: expo-env.d.ts
================================================

/// <reference types="expo/types" />

// NOTE: This file should not be edited and should be in your git ignore

================================================
📄 ARCHIVO: package.json
================================================

{
  "name": "mi-chat-app",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@react-navigation/bottom-tabs": "^7.4.0",
    "@react-navigation/elements": "^2.6.3",
    "@react-navigation/native": "^7.1.8",
    "@supabase/supabase-js": "^2.106.1",
    "@tanstack/react-query": "^5.100.13",
    "expo": "~54.0.33",
    "expo-constants": "~18.0.13",
    "expo-font": "~14.0.11",
    "expo-haptics": "~15.0.8",
    "expo-image": "~3.0.11",
    "expo-linking": "~8.0.11",
    "expo-router": "~6.0.23",
    "expo-secure-store": "~15.0.8",
    "expo-splash-screen": "~31.0.13",
    "expo-status-bar": "~3.0.9",
    "expo-symbols": "~1.0.8",
    "expo-system-ui": "~6.0.9",
    "expo-web-browser": "~15.0.10",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.5.1",
    "zustand": "^5.0.13"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "eslint": "^9.25.0",
    "eslint-config-expo": "~10.0.0",
    "typescript": "~5.9.2"
  },
  "private": true
}


================================================
📄 ARCHIVO: README.md
================================================

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


================================================
📄 ARCHIVO: scripts\reset-project.js
================================================

#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /app, /components, /hooks, /scripts, and /constants directories to /app-example based on user input and creates a new /app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];
const exampleDir = "app-example";
const newAppDir = "app";
const exampleDirPath = path.join(root, exampleDir);

const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Create the app-example directory
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories to new app-example directory or delete them
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Create new /app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /app directory created.");

    // Create index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 app/index.tsx created.");

    // Create _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 app/_layout.tsx created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit app/index.tsx to edit the main screen.${
        userInput === "y"
          ? `\n3. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

rl.question(
  "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);


================================================
📄 ARCHIVO: src\features\auth\application\use-cases\LoginUseCase.ts
================================================

import { AuthError } from "../../../../shared/domain/errors/AppError";
import { User } from "../../domain/entities/User";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";

export class LoginUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new AuthError("Email y contraseña son requeridos");
    }
    try {
      return await this.authRepo.login(email, password);
    } catch (error) {
      throw new AuthError("Credenciales inválidas", error);
    }
  }
}

================================================
📄 ARCHIVO: src\features\auth\application\use-cases\RegisterUseCase.ts
================================================

import { AuthError } from "../../../../shared/domain/errors/AppError";
import { User } from "../../domain/entities/User";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";

export class RegisterUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(email: string, password: string, username: string): Promise<User> {
    if (!email || !password || !username) {
      throw new AuthError('Todos los campos son requeridos');
    }
    if (password.length < 6) {
      throw new AuthError('La contraseña debe tener al menos 6 caracteres');
    }
    if (username.includes(' ')) {
      throw new AuthError('El username no puede contener espacios');
    }
    try {
      return await this.authRepo.register(email, password, username);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar usuario';
      throw new AuthError(message, error);
    }
  }
}

================================================
📄 ARCHIVO: src\features\auth\domain\entities\User.ts
================================================

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
}

================================================
📄 ARCHIVO: src\features\auth\domain\repositories\IAuthRepository.ts
================================================

import { User } from '../entities/User';

export interface IAuthRepository {
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string, username: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

================================================
📄 ARCHIVO: src\features\auth\infrastructure\repositories\SupabaseAuthRepository.ts
================================================

import { supabase } from "../../../../shared/infrastructure/supabase/client";
import { User } from "../../domain/entities/User";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";

export class SupabaseAuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) throw error;

    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", data.user.id)
      .single();

    return {
      id: data.user.id,
      email: data.user.email!,
      username: profile?.username ?? "",
      avatarUrl: profile?.avatar_url ?? undefined,
    };
  }

  async register(
    email: string,
    password: string,
    username: string,
  ): Promise<User> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // Supabase puede retornar null en data.user si requiere confirmación de email
    const userId = data.user?.id;
    if (!userId) throw new Error("No se pudo crear el usuario");

    // Verificar si el perfil ya existe antes de insertar
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({ id: userId, username });
      if (profileError) throw new Error(profileError.message);
    }

    return { 
      id: userId, 
      email: data.user?.email ?? email, 
      username 
    };
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();
    return {
      id: user.id,
      email: user.email!,
      username: profile?.username ?? "",
      avatarUrl: profile?.avatar_url ?? undefined,
    };
  }
}

================================================
📄 ARCHIVO: src\features\auth\presentation\hooks\useAuth.ts
================================================

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { LoginUseCase } from "../../application/use-cases/LoginUseCase";
import { RegisterUseCase } from "../../application/use-cases/RegisterUseCase";
import { SupabaseAuthRepository } from "../../infrastructure/repositories/SupabaseAuthRepository";
import { useAuthStore } from "../store/authStore";

type RegisterDto = { email: string; password: string; username: string };

const authRepo = new SupabaseAuthRepository();
const loginUseCase = new LoginUseCase(authRepo);
const registerUseCase = new RegisterUseCase(authRepo);

export function useAuth() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  // useMutation de TanStack Query maneja isLoading y error automáticamente
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUseCase.execute(email, password),
    onSuccess: (user) => {
      setUser(user);
      router.replace("/(app)");
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password, username }: RegisterDto) =>
      registerUseCase.execute(email, password, username),
    onSuccess: (user) => {
      setUser(user);
      router.replace("/(app)");
    },
  });

  const logout = async () => {
    try {
      await authRepo.logout();
    } finally {
      setUser(null);
      router.replace("/(auth)/login");
    }
  };

  return {
    user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error:
      loginMutation.error?.message ?? registerMutation.error?.message ?? null,
  };
}


================================================
📄 ARCHIVO: src\features\auth\presentation\providers\AuthProvider.tsx
================================================

import { useEffect, useState, type PropsWithChildren } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { supabase } from '@shared/infrastructure/supabase/client';
import { useAuthStore } from '../store/authStore';
import { SupabaseAuthRepository } from '../../infrastructure/repositories/SupabaseAuthRepository';

const authRepo = new SupabaseAuthRepository();

export function AuthProvider({ children }: PropsWithChildren) {
  const { user, setUser } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const currentUser = await authRepo.getCurrentUser();
          setUser(currentUser);
        } else {
          setUser(null);
        }
        setIsReady(true); // ← marcar listo después del primer check
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isReady) return; // ← no navegar hasta que esté listo

    const inAuthGroup = segments[0] === '(auth)';
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(app)');
    }
  }, [user, segments, isReady]);

  return <>{children}</>;
}

================================================
📄 ARCHIVO: src\features\auth\presentation\store\authStore.ts
================================================

import { create } from 'zustand';
import { User } from '../../domain/entities/User';

interface AuthState {
  user:        User | null;
  setUser:     (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:     null,
  setUser:  (user) => set({ user }),
}));

================================================
📄 ARCHIVO: src\features\chat\application\use-cases\CreateRoomUseCase.ts
================================================

import { ChatError } from "../../../../shared/domain/errors/AppError";
import { Room } from "../../domain/entities/Message";
import { IChatRepository } from "../../domain/repositories/IChatRepository";

export class CreateRoomUseCase {
  constructor(private readonly chatRepo: IChatRepository) {}

  async execute(name: string, userId: string): Promise<Room> {

    if (!name.trim())
      throw new ChatError("El nombre de la sala es requerido");

    return this.chatRepo.createRoom(name.trim(), userId);
  }
}

================================================
📄 ARCHIVO: src\features\chat\application\use-cases\GetMessagesUseCase.ts
================================================

import { Message } from "../../domain/entities/Message";
import { IChatRepository } from "../../domain/repositories/IChatRepository";

export class GetMessagesUseCase {
  constructor(private readonly chatRepo: IChatRepository) {}
  execute(roomId: string): Promise<Message[]> {
    return this.chatRepo.getMessages(roomId);
  }
}

================================================
📄 ARCHIVO: src\features\chat\application\use-cases\SendMessageUseCase.ts
================================================

import { ChatError } from "../../../../shared/domain/errors/AppError";
import { Message } from "../../domain/entities/Message";
import { IChatRepository } from "../../domain/repositories/IChatRepository";

export class SendMessageUseCase {
  constructor(private readonly chatRepo: IChatRepository) {}

  async execute(
    roomId: string,
    userId: string,
    content: string,
  ): Promise<Message> {

    const trimmed = content.trim();

    if (!trimmed) throw new ChatError("El mensaje no puede estar vacío");

    if (trimmed.length > 500)
      throw new ChatError("Máximo 500 caracteres");

    return this.chatRepo.sendMessage(roomId, userId, trimmed);
  }
}

================================================
📄 ARCHIVO: src\features\chat\application\use-cases\SubscribeToRoomUseCase.ts
================================================

import { Message } from "../../domain/entities/Message";
import { IChatRepository } from "../../domain/repositories/IChatRepository";

export class SubscribeToRoomUseCase {

  constructor(private readonly chatRepo: IChatRepository) {}

  execute(
    roomId: string,
    onMessage: (msg: Message) => void
  ): () => void {

    return this.chatRepo.subscribeToRoom(roomId, onMessage);
  }
}

================================================
📄 ARCHIVO: src\features\chat\domain\entities\Message.ts
================================================

export interface Message {
  id:              string;
  roomId:          string;
  userId:          string;
  content:         string;
  createdAt:       Date;
  authorUsername?: string; // Desnormalización controlada para la UI
}

export interface Room {
  id:        string;
  name:      string;
  createdBy: string;
  createdAt: Date;
}

================================================
📄 ARCHIVO: src\features\chat\domain\entities\Room.ts
================================================



================================================
📄 ARCHIVO: src\features\chat\domain\repositories\IChatRepository.ts
================================================

import { Message, Room } from "../entities/Message";

export interface IChatRepository {
  getRooms(): Promise<Room[]>;
  createRoom(name: string, userId: string): Promise<Room>;
  getMessages(roomId: string): Promise<Message[]>;
  sendMessage(
    roomId: string,
    userId: string,
    content: string,
  ): Promise<Message>;
  // Devuelve la funcion unsubscribe, compatible con el return de useEffect
  subscribeToRoom(
    roomId: string,
    onMessage: (msg: Message) => void,
  ): () => void;
}

================================================
📄 ARCHIVO: src\features\chat\infraestructure\repositories\SupabaseChatRepository.ts
================================================

import { supabase } from "@shared/infrastructure/supabase/client";
import { Message, Room } from "@features/chat/domain/entities/Message";
import { IChatRepository } from "@features/chat/domain/repositories/IChatRepository";
export class SupabaseChatRepository implements IChatRepository {
 
  async getRooms(): Promise<Room[]> {
    const { data, error } = await supabase
      .from('rooms').select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(this.mapRoom);
  }
 
  async createRoom(name: string, userId: string): Promise<Room> {
    const { data, error } = await supabase
      .from('rooms').insert({ name, created_by: userId })
      .select().single();
    if (error) throw error;
    return this.mapRoom(data);
  }
 
  async getMessages(roomId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('id, room_id, user_id, content, created_at, profiles(username)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(50);
    if (error) throw error;
    return (data ?? []).map(this.mapMessage);
  }
 
  async sendMessage(roomId: string, userId: string, content: string): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({ room_id: roomId, user_id: userId, content })
      .select('id, room_id, user_id, content, created_at, profiles(username)')
      .single();
    if (error) throw error;
    return this.mapMessage(data);
  }
 
  subscribeToRoom(roomId: string, onMessage: (msg: Message) => void): () => void {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
          event: 'INSERT', schema: 'public',
          table: 'messages', filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          // El payload no incluye el username — se obtiene con una query extra
          const { data: profile } = await supabase
            .from('profiles').select('username')
            .eq('id', payload.new.user_id).single();
          onMessage({
            id:             payload.new.id,
            roomId:         payload.new.room_id,
            userId:         payload.new.user_id,
            content:        payload.new.content,
            createdAt:      new Date(payload.new.created_at),
            authorUsername: profile?.username,
          });
        }
      ).subscribe();
 
    return () => { supabase.removeChannel(channel); };
  }
 
  private mapRoom = (raw: any): Room => ({
    id: raw.id, name: raw.name,
    createdBy: raw.created_by, createdAt: new Date(raw.created_at),
  });
 
  private mapMessage = (raw: any): Message => ({
    id: raw.id, roomId: raw.room_id, userId: raw.user_id,
    content: raw.content, createdAt: new Date(raw.created_at),
    authorUsername: raw.profiles?.username,
  });
}


================================================
📄 ARCHIVO: src\features\chat\presentation\hooks\useChat.ts
================================================

import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { GetMessagesUseCase } from "@features/chat/application/use-cases/GetMessagesUseCase";
import { SendMessageUseCase } from "@features/chat/application/use-cases/SendMessageUseCase";
import { SubscribeToRoomUseCase } from "@features/chat/application/use-cases/SubscribeToRoomUseCase";
import { Message } from "@features/chat/domain/entities/Message";
import { SupabaseChatRepository } from "@features/chat/infraestructure/repositories/SupabaseChatRepository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const chatRepo = new SupabaseChatRepository();
const sendMessageUseCase = new SendMessageUseCase(chatRepo);
const getMessagesUseCase = new GetMessagesUseCase(chatRepo);
const subscribeUseCase = new SubscribeToRoomUseCase(chatRepo);

export function useChat(roomId: string) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // Paso 1: obtener historial de mensajes con cache
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", roomId], // Clave única por sala
    queryFn: () => getMessagesUseCase.execute(roomId),
    enabled: !!user,
    // Los mensajes antiguos no se revalidan automáticamente.
    // Realtime se encarga de los mensajes nuevos.
    staleTime: Infinity,
  });

  // Paso 2: suscribirse al canal Realtime
  useEffect(() => {
    const unsubscribe = subscribeUseCase.execute(roomId, (newMsg) => {
      queryClient.setQueryData(["messages", roomId], (old: Message[] = []) => {
        // Evitar duplicados: el optimistic update ya agregó este mensaje
        const exists = old.some((m) => m.id === newMsg.id);
        return exists ? old : [...old, newMsg];
      });
    });
    return unsubscribe; // Cleanup al desmontar: cierra el WebSocket
  }, [roomId]);

  // Paso 3: enviar mensaje con optimistic update via useMutation
  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      sendMessageUseCase.execute(roomId, user!.id, content),

    // onMutate se ejecuta ANTES de la petición (optimistic update)
    onMutate: async (content) => {
      const tempMsg: Message = {
        id: `temp-${Date.now()}`,
        roomId,
        userId: user!.id,
        content,
        createdAt: new Date(),
        authorUsername: user!.username,
      };
      queryClient.setQueryData(["messages", roomId], (old: Message[] = []) => [
        ...old,
        tempMsg,
      ]);
      return { tempMsg }; // Contexto para onError
    },

    onSuccess: (realMsg, _content, context) => {
      queryClient.setQueryData(["messages", roomId], (old: Message[] = []) =>
        old.map((m) => (m.id === context?.tempMsg.id ? realMsg : m)),
      );
    },

    onError: (_err, _content, context) => {
      if (context?.tempMsg) {
        queryClient.setQueryData(["messages", roomId], (old: Message[] = []) =>
          old.filter((m) => m.id !== context.tempMsg.id),
        );
      }
    },
  });

  return {
    messages,
    sendMessage: sendMutation.mutate,
    isLoading,
    isSending: sendMutation.isPending,
  };
}


================================================
📄 ARCHIVO: src\features\chat\presentation\hooks\useRooms.ts
================================================

import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { CreateRoomUseCase } from "@features/chat/application/use-cases/CreateRoomUseCase";
import { Room } from "@features/chat/domain/entities/Message";
import { SupabaseChatRepository } from "@features/chat/infraestructure/repositories/SupabaseChatRepository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const chatRepo = new SupabaseChatRepository();
const createRoomUseCase = new CreateRoomUseCase(chatRepo);

export function useRooms() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // useQuery obtiene la lista de salas y la cachea bajo la clave ['rooms']
  const {
    data: rooms = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => chatRepo.getRooms(),
    enabled: !!user, // Solo fetchar si hay usuario autenticado
  });

  // useMutation para crear una sala nueva
  const createMutation = useMutation({
    mutationFn: (name: string) => createRoomUseCase.execute(name, user!.id),
    onSuccess: (newRoom) => {
      // Actualizar el cache 
      queryClient.setQueryData(["rooms"], (old: Room[]) => [
        newRoom,
        ...(old ?? []),
      ]);
    },
  });

  return {
    rooms,
    isLoading,
    error: error?.message ?? null,
    createRoom: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error?.message ?? null,
  };
}



================================================
📄 ARCHIVO: src\shared\domain\errors\AppError.ts
================================================

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('AUTH_ERROR', message, cause);
  }
}

export class ChatError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('CHAT_ERROR', message, cause);
  }
}

================================================
📄 ARCHIVO: src\shared\infrastructure\supabase\client.ts
================================================

// src/shared/infrastructure/supabase/client.ts

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Supabase espera métodos getItem/setItem/removeItem, pero expo-secure-store
// expone getItemAsync/setItemAsync/deleteItemAsync – este adaptador los mapea.
const SecureStoreAdapter = {
  getItem: (key: string) => 
    SecureStore.getItemAsync(key),

  setItem: (key: string, value: string) => 
    SecureStore.setItemAsync(key, value),

  removeItem: (key: string) => 
    SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: SecureStoreAdapter, // tokens guardados en almacenamiento encriptado del dispositivo
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

================================================
📄 ARCHIVO: tsconfig.json
================================================

{
  "extends": "expo/tsconfig.base",
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "env.d.ts",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ],
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "lib": [
      "ESNext"
    ],
    "ignoreDeprecations": "6.0",
    "paths": {
      "@features/*": [
        "src/features/*"
      ],
      "@shared/*": [
        "src/shared/*"
      ]
    }
  }
}
