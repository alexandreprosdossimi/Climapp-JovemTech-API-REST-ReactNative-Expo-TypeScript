import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MapScreenWeb() {
    const router = useRouter();

    return (
        <LinearGradient colors={['#00457D', '#05051F']} style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Voltar">
                    <MaterialIcons name="arrow-back-ios" size={22} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>Mapa</Text>
                <View style={styles.backButton} />
            </View>
            <View style={styles.content}>
                <MaterialIcons name="map" size={56} color="#7693ff" />
                <Text style={styles.message}>O mapa interativo está disponível no aplicativo para Android e iOS.</Text>
                <Text style={styles.detail}>No navegador, você pode abrir o mapa de Aracaju no OpenStreetMap.</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => void Linking.openURL('https://www.openstreetmap.org/?mlat=-10.98888&mlon=-37.04821#map=14/-10.98888/-37.04821')}
                >
                    <Text style={styles.buttonText}>Abrir OpenStreetMap</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 48,
        paddingHorizontal: 16,
        paddingBottom: 18,
        backgroundColor: 'rgba(0, 69, 125, 0.5)',
    },
    backButton: { width: 40, padding: 8 },
    title: { color: 'white', fontSize: 22, fontFamily: 'Montserrat_600SemiBold' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 18 },
    message: { color: 'white', fontSize: 20, textAlign: 'center', fontFamily: 'Montserrat_600SemiBold' },
    detail: { color: '#FFFFFFB3', fontSize: 16, textAlign: 'center', fontFamily: 'Montserrat_400Regular' },
    button: { backgroundColor: '#7693ff', paddingHorizontal: 20, paddingVertical: 13, borderRadius: 10, marginTop: 4 },
    buttonText: { color: '#05051F', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
});
