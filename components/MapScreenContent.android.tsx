import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';

export default function MapScreen() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const locationSubscription = useRef<Location.LocationSubscription | null>(null);

    useEffect(() => {
        let isMounted = true;

        const startLocationTracking = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permita o acesso à localização para visualizar o mapa.');
                    return;
                }
                const currentLocation = await Location.getCurrentPositionAsync({});
                if (!isMounted) return;
                setLocation(currentLocation);
                locationSubscription.current = await Location.watchPositionAsync(
                    { accuracy: Location.Accuracy.Balanced, distanceInterval: 25 },
                    (newLocation) => setLocation(newLocation)
                );
            } catch (error) {
                console.error('Falha ao obter a localização:', error);
                if (isMounted) setErrorMsg('Não foi possível obter sua localização. Verifique as permissões e tente novamente.');
            }
        };

        void startLocationTracking();

        return () => {
            isMounted = false;
            if (locationSubscription.current) {
                locationSubscription.current.remove();
            }
        }
    }, []);

    if (errorMsg) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#00457D" />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                showsUserLocation={true}
                followsUserLocation={true}
            >
                <UrlTile
                    urlTemplate='https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
                    maximumZ={19}
                    flipY={false}

                />
                <Marker
                    coordinate={{
                        latitude: -10.98888,
                        longitude: -37.04821,
                    }}
                    title="Arcos da Orla, Aracaju"
                />
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    errorText: { color: '#333333', fontSize: 16, textAlign: 'center' },
})
