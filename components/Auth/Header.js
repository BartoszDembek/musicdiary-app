import { View, StyleSheet, Text } from "react-native";
import { colors } from '../../theme';

const Header = ({subtitle}) => {
    return (
        <View>
            <Text style={styles.logo}>MusicDiary</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    logo: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.secondary,
        marginBottom: 40,
        textAlign: 'center',
    },
})

export default Header;