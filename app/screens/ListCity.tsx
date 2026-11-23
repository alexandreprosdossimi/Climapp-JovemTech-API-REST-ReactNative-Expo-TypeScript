import CityTile from "../../components/CityTile";
import { WeatherForecast } from "../../interfaces/forecast_interfaces";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const listCity = ['Aracaju,SE', 'Itabaiana,SE', 'Salvador,BA', 'Curitiba,PR'];

export default function ListCityScreen() {
    const router = useRouter();

    const [allCities, setAllCities] = useState<WeatherForecast[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [filteredCities, setFilteredCities] = useState<WeatherForecast[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const filterCities = (text: string) => {
        setSearchQuery(text);

        if (text.trim() === '') {
            setFilteredCities(allCities);
        } else {
            const filtered = allCities.filter((city) =>
                city.cityName.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredCities(filtered);
        }
    }

    const loadCities = useCallback(async () => {
        try {
            setIsLoading(true);
            setErrorMessage(null);
            const apiUrl = process.env.EXPO_PUBLIC_API_URL;
            const apiKey = process.env.EXPO_PUBLIC_API_KEY;

            if (!apiUrl || !apiKey) {
                throw new Error('Configure EXPO_PUBLIC_API_URL e EXPO_PUBLIC_API_KEY no arquivo .env.');
            }

            const promises = listCity.map(async (city) => {
                const separator = apiUrl.includes('?') ? '&' : '?';
                const responseFormat = Platform.OS === 'web' ? 'json-cors' : 'json';
                const response = await fetch(
                    `${apiUrl}${separator}format=${responseFormat}&key=${encodeURIComponent(apiKey)}&city_name=${encodeURIComponent(city)}`
                );
                if (!response.ok) {
                    throw new Error(`A API respondeu com o status ${response.status}.`);
                }
                const data = await response.json();
                if (!data?.results?.city || !Array.isArray(data.results.forecast)) {
                    throw new Error('A resposta da API veio em um formato inesperado.');
                }
                return {
                    cityName: data.results.city,
                    conditionSlug: data.results.condition_slug,
                    temp: data.results.temp,
                    date: data.results.date,
                    description: data.results.description,
                    forecast: data.results.forecast,
                } as WeatherForecast;
            });

            const listAllCities = await Promise.all(promises);

            setAllCities(listAllCities);
            setFilteredCities(listAllCities);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Não foi possível carregar a previsão.';
            setErrorMessage(message);
            console.error('Falha ao carregar cidades:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadCities();
    }, [loadCities]);

    return (
        <LinearGradient
            colors={['#00457D', '#05051F']}
            style={styles.container}>
            <View style={styles.content}>
                <View style={{ height: 60 }} />
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite uma cidade"
                        placeholderTextColor='#FFFFFF80'
                        value={searchQuery}
                        onChangeText={filterCities}
                    />
                    <Ionicons
                        name='search'
                        size={24}
                        color='white'
                        style={styles.searchIcon}
                    />
                </View>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FFFFFF" />
                    </View>
                ) : errorMessage ? (
                    <View style={styles.feedbackContainer}>
                        <Text style={styles.feedbackTitle}>Não foi possível carregar as cidades</Text>
                        <Text style={styles.feedbackText}>{errorMessage}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={loadCities}>
                            <Text style={styles.retryButtonText}>Tentar novamente</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={filteredCities}
                        keyExtractor={(item) => item.cityName}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    Nenhuma cidade encontrada para &quot;{searchQuery}&quot;
                                </Text>
                            </View>
                        )}
                        renderItem={({ item }) => (
                            <CityTile
                                cityName={item.cityName}
                                icon={item.conditionSlug}
                                temperature={item.temp}
                                onTap={() => {
                                    router.push({
                                        pathname: '/screens/WeatherCity',
                                        params: { weatherData: JSON.stringify(item) }
                                    })
                                }} />
                        )}
                    />
                )}
            </View>
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/screens/MapScreen')}
            >
                <Ionicons name="map" size={28} color="white" />
            </TouchableOpacity>
        </LinearGradient>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#00457D',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 30,
        paddingHorizontal: 16,
        height: 50,
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Montserrat_400Regular',
    },
    searchIcon: {
        marginLeft: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyText: {
        color: '#FFFFFF80',
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'Montserrat_400Regular',
    },
    feedbackContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        gap: 12,
    },
    feedbackTitle: {
        color: '#FFFFFF',
        fontSize: 19,
        textAlign: 'center',
        fontFamily: 'Montserrat_600SemiBold',
    },
    feedbackText: {
        color: '#FFFFFFB3',
        fontSize: 15,
        textAlign: 'center',
        fontFamily: 'Montserrat_400Regular',
    },
    retryButton: {
        backgroundColor: '#7693ff',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 11,
        marginTop: 4,
    },
    retryButtonText: {
        color: '#05051F',
        fontFamily: 'Montserrat_600SemiBold',
    },
});
